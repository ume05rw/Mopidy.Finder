using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods.Libraries;
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

        public Genre Get(int genreId)
            => this.Dbc.GetGenreQuery().FirstOrDefault(e => e.Id == genreId);

        public List<Genre> FindAll(string[] names, int[] ids)
        {
            var query = this.Dbc.GetGenreQuery();
            if (names != null && 0 < names.Length)
                query = query.Where(e => names.All(name => e.Name.Contains(name)));
            if (ids != null && 0 < ids.Length)
                query = query.Where(e => ids.Contains(e.Id));

            return query.ToList();
        }

        public List<Artist> GetArtistsByGenre(Genre genre)
            =>  this.Dbc.GetArtistQuery()
                .Where(e => e.GenreArtists.Select(e2 => e2.GenreId).Contains(genre.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public List<Album> GetAlbumsByGenre(Genre genre)
            =>  this.Dbc.GetAlbumQuery()
                .Where(e => e.GenreAlbums.Select(e2 => e2.GenreId).Contains(genre.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public void Refresh()
        {
            this.Dbc.Genres.RemoveRange(this.Dbc.Genres);
            this.Dbc.SaveChanges();

            var request = Browse.CreateRequest(GenreStore.QueryString);

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
