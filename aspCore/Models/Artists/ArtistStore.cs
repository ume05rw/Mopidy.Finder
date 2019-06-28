using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Artists
{
    public class ArtistStore : MopidyStoreBase<Artist>
    {
        private const string QueryString = "local:directory?type=artist";

        public ArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public List<Artist> FindAll(string name = null)
        {
            return (name != null)
                ? this.Dbc.Artists.Where(e => e.Name.Contains(name)).ToList()
                : this.Dbc.Artists.ToList();
        }

        public Artist Get(int artistId)
            => this.Dbc.Artists.FirstOrDefault(e => e.Id == artistId);

        public List<Album> GetAlbumsByArtist(Artist artist)
        {
            return this.Dbc.ArtistAlbums
                .Where(e => e.ArtistId == artist.Id)
                .Select(e => e.Album)
                .OrderBy(e => e.Year)
                .ThenBy(e => e.Name)
                .ToList();
        }

        public List<Genre> GetGenresByArtist(Artist artist)
        {
            return this.Dbc.GenreArtists
                .Where(e => e.ArtistId == artist.Id)
                .Select(e => e.Genre)
                .OrderBy(e => e.Name)
                .ToList();
        }

        public void Refresh()
        {
            this.Dbc.Artists.RemoveRange(this.Dbc.Artists);
            this.Dbc.SaveChanges();

            var args = new MethodArgs(QueryString);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            var artists = result.Select(e => new Artist()
            {
                Name = e.name,
                Uri = e.uri
            }).ToArray();

            this.Dbc.Artists.AddRange(artists);
            this.Dbc.SaveChanges();
        }
    }
}
