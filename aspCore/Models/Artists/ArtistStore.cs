using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using MusicFront.Models.Albums;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods.Libraries;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace MusicFront.Models.Artists
{
    public class ArtistStore : MopidyStoreBase<Artist>
    {
        private const string QueryString = "local:directory?type=artist";

        public ArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Artist Get(int artistId)
            => this.Dbc.GetArtistQuery().FirstOrDefault(e => e.Id == artistId);

        public List<Artist> FindAll(string[] names, int[] ids)
        {
            var query = this.Dbc.GetArtistQuery();
            if (names != null && 0 < names.Length)
                query = query.Where(e => names.All(name => e.Name.Contains(name)));
            if (ids != null && 0 < ids.Length)
                query = query.Where(e => ids.Contains(e.Id));

            return query.ToList();
        }

        public List<Album> GetAlbumsByArtist(Artist artist)
            => this.Dbc.GetAlbumQuery()
                .Where(e => e.ArtistAlbums.Select(e2 => e2.ArtistId).Contains(artist.Id))
                .OrderBy(e => e.Year)
                .ThenBy(e => e.Name)
                .ToList();

        public List<Genre> GetGenresByArtist(Artist artist)
            => this.Dbc.GetGenreQuery()
                .Where(e => e.GenreArtists.Select(e2 => e2.ArtistId).Contains(artist.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public void Refresh()
        {
            this.Dbc.Artists.RemoveRange(this.Dbc.Artists);
            this.Dbc.SaveChanges();

            var request = Browse.CreateRequest(ArtistStore.QueryString);

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
