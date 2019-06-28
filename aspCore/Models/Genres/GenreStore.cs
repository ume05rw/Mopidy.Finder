using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Genres
{
    public class GenreStore : MopidyStoreBase<Genre>
    {
        private const string QueryString = "local:directory?type=genre";

        public GenreStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public List<Genre> FindAll(string name = null)
        {
            return (name != null)
                ? this.Dbc.Genres.Where(e => e.Name.Contains(name)).ToList()
                : this.Dbc.Genres.ToList();
        }

        public Genre Get(int genreId)
            => this.Dbc.Genres.FirstOrDefault(e => e.Id == genreId);

        public List<Artist> GetArtistsByGenre(Genre genre)
        {
            return this.Dbc.GenreArtists
                .Where(e => e.GenreId == genre.Id)
                .Select(e => e.Artist)
                .OrderBy(e => e.Name)
                .ToList();
        }

        public List<Album> GetAlbumsByGenre(Genre genre)
        {
            return this.Dbc.GenreAlbums
                .Where(e => e.GenreId == genre.Id)
                .Select(e => e.Album)
                .OrderBy(e => e.Name)
                .ToList();
        }

        public void Refresh()
        {
            this.Dbc.Genres.RemoveRange(this.Dbc.Genres);
            this.Dbc.SaveChanges();

            var args = new MethodArgs(QueryString);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            var genres = result.Select(e => new Genre()
            {
                Name = e.name,
                Uri = e.uri
            }).ToArray();

            this.Dbc.Genres.AddRange(genres);
            this.Dbc.SaveChanges();
        }
    }
}
