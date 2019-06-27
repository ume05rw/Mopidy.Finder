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

        public async Task<bool> Refresh()
        {
            this.Dbc.ArtistAlbums.RemoveRange(this.Dbc.ArtistAlbums);
            await this.Dbc.SaveChangesAsync();

            var tasks = new List<Task<bool>>();
            var artists = this.Dbc.Artists.ToArray();

            foreach (var artist in artists)
                tasks.Add(this.AddAlbumsByArtist(artist));

            await Task.WhenAll(tasks);

            return true;
        }

        private async Task<bool> AddAlbumsByArtist(Artist artist)
        {
            var args = new MethodArgs(artist.Uri);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = await this.QueryMopidy(request);
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            foreach (var row in result)
            {
                var album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == row.uri);

                if (album == null)
                    continue;

                this.Dbc.ArtistAlbums.Add(new ArtistAlbum() {
                    ArtistId = artist.Id,
                    AlbumId = album.Id
                });
            }

            await this.Dbc.SaveChangesAsync();

            return true;
        }
    }
}
