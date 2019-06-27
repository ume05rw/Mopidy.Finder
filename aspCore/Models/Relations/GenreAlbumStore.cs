using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Relations
{
    public class GenreAlbumStore : MopidyStoreBase<GenreAlbum>
    {
        public GenreAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            this.Dbc.GenreAlbums.RemoveRange(this.Dbc.GenreAlbums);
            await this.Dbc.SaveChangesAsync();

            var tasks = new List<Task<bool>>();
            var genres = this.Dbc.Genres.ToList();

            foreach (var genre in this.Dbc.Genres.ToArray())
                tasks.Add(this.AddAlbumsByGenre(genre));

            await Task.WhenAll(tasks);

            return true;
        }

        private async Task<bool> AddAlbumsByGenre(Genre genre)
        {
            var args = new MethodArgs(genre.Uri);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = await this.QueryMopidy(request);
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            foreach (var row in result)
            {
                var refQuery = row.uri.Split('?')[1];
                var uriParams = refQuery.Split('&')
                    .Where(e => e.StartsWith("album=")).FirstOrDefault();

                if (uriParams == null)
                    continue;

                var albumUri = uriParams.Split('=')[1];

                var album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == albumUri);

                if (album == null)
                    continue;

                this.Dbc.GenreAlbums.Add(new GenreAlbum() {
                    GenreId = genre.Id,
                    AlbumId = album.Id
                });
            }

            await this.Dbc.SaveChangesAsync();

            return true;
        }
    }
}
