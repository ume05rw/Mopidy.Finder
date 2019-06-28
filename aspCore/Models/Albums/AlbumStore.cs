using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : MopidyStoreBase<Album>
    {
        private const string QueryString = "local:directory?type=album";

        public AlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public List<Album> FindAll(string name = null)
        {
            return (name != null)
                ? this.Dbc.Albums.Where(e => e.Name.Contains(name)).ToList()
                : this.Dbc.Albums.ToList();
        }

        public Album Get(int albumId)
            => this.Dbc.Albums.FirstOrDefault(e => e.Id == albumId);

        public List<Artist> GetArtistsByAlbum(Album album)
        {
            return this.Dbc.ArtistAlbums
                .Where(e => e.AlbumId == album.Id)
                .Select(e => e.Artist)
                .OrderBy(e => e.Name)
                .ToList();
        }

        public List<Genre> GetGenresByAlbum(Album album)
        {
            return this.Dbc.GenreAlbums
                .Where(e => e.AlbumId == album.Id)
                .Select(e => e.Genre)
                .OrderBy(e => e.Name)
                .ToList();
        }

        public void Refresh()
        {
            this.Dbc.Albums.RemoveRange(this.Dbc.Albums);
            this.Dbc.SaveChanges();

            var args = new MethodArgs(QueryString);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            var albums = result.Select(e => new Album()
            {
                Name = e.name,
                Uri = e.uri
            }).ToArray();

            this.Dbc.Albums.AddRange(albums);
            this.Dbc.SaveChanges();
        }
    }
}
