using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            var args = new MethodArgs(artist.Uri);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            foreach (var row in result)
            {
                var albumUri = row.GetAlbumUri();
                if (albumUri == null)
                    continue; // アルバムURIが取得出来ないことは無いはず。

                var album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == albumUri);
                if (album == null)
                    continue; // 合致アルバムが取得出来ないことは無いはず。

                this.Dbc.ArtistAlbums.Add(new ArtistAlbum() {
                    ArtistId = artist.Id,
                    AlbumId = album.Id
                });
            }
        }
    }
}
