using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods.Libraries;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : MopidyStoreBase<Album>
    {
        private const string QueryString = "local:directory?type=album";

        public AlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Album Get(int genreId)
            => this.Dbc.GetAlbumQuery().FirstOrDefault(e => e.Id == genreId);

        public List<Album> FindAll(string[] names, int[] ids)
        {
            var query = this.Dbc.GetAlbumQuery();
            if (names != null && 0 < names.Length)
                query = query.Where(e => names.All(name => e.LowerName.Contains(name.ToLower())));
            if (ids != null && 0 < ids.Length)
                query = query.Where(e => ids.Contains(e.Id));

            return query.ToList();
        }

        public List<Artist> GetArtistsByAlbum(Album album)
            => this.Dbc.GetArtistQuery()
                .Where(e => e.ArtistAlbums.Select(e2 => e2.AlbumId).Contains(album.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public List<Genre> GetGenresByAlbum(Album album)
            => this.Dbc.GetGenreQuery()
                .Where(e => e.GenreAlbums.Select(e2 => e2.AlbumId).Contains(album.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public void Refresh()
        {
            this.Dbc.Albums.RemoveRange(this.Dbc.Albums);
            this.Dbc.SaveChanges();

            var request = Browse.CreateRequest(AlbumStore.QueryString);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            var albums = result.Select(e => new Album()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this.Dbc.Albums.AddRange(albums);
            this.Dbc.SaveChanges();
        }
    }
}
