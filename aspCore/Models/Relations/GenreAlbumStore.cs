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

        public void Refresh()
        {
            this.Dbc.GenreAlbums.RemoveRange(this.Dbc.GenreAlbums);
            this.Dbc.SaveChanges();

            var genres = this.Dbc.Genres.ToList();

            foreach (var genre in this.Dbc.Genres.ToArray())
                this.AddAlbumsByGenre(genre);

            this.Dbc.SaveChanges();
        }

        private void AddAlbumsByGenre(Genre genre)
        {
            var args = new MethodArgs(genre.Uri);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            foreach (var row in result)
            {
                var albumUri = row.GetAlbumUri();
                if (albumUri == null)
                    continue;

                var album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == albumUri);

                if (album == null)
                    continue;

                this.Dbc.GenreAlbums.Add(new GenreAlbum() {
                    GenreId = genre.Id,
                    AlbumId = album.Id
                });
            }
        }
    }
}
