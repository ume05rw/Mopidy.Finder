using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods.Libraries;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MusicFront.Models.Relations
{
    public class ArtistAlbumStore : MopidyStoreBase<ArtistAlbum>
    {
        public ArtistAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public void Refresh()
        {
            this.Dbc.ArtistAlbums.RemoveRange(this.Dbc.ArtistAlbums);
            this.Dbc.SaveChanges();

            foreach (var artist in this.Dbc.Artists.ToArray())
                this.AddAlbumsByArtist(artist);

            this.Dbc.SaveChanges();
        }

        private void AddAlbumsByArtist(Artist artist)
        {
            var request = Browse.CreateRequest(artist.Uri);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            foreach (var row in result)
            {
                var albumUri = row.GetAlbumUri();
                if (albumUri == null)
                    throw new Exception($"Album-Uri Not Found: uri={row.Uri}"); // アルバムURIが取得出来ないことは無いはず。

                try
                {
                    var albumId = this.Dbc.Albums
                        .Where(e => e.Uri == albumUri)
                        .Select(e => e.Id)
                        .First();

                    this.Dbc.ArtistAlbums.Add(new ArtistAlbum()
                    {
                        ArtistId = artist.Id,
                        AlbumId = albumId
                    });
                }
                catch (Exception ex)
                {
                    // 合致アルバムが取得出来ないことは無いはず。
                    throw new Exception($"Album Not Matched: uri={albumUri}");
                }

            }
        }
    }
}
