using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class GenreAlbumStore : StoreBase<GenreAlbum>, IMopidyScannable
    {
        private Library _library;

        public GenreAlbumStore(
            [FromServices] Dbc dbc,
            [FromServices] Library library
        ) : base(dbc)
        {
            this._library = library;
        }

        private decimal _processLength = 0;
        private decimal _processed = 0;
        public decimal ScanProgress
        {
            get
            {
                return (this._processLength <= 0)
                    ? 0
                    : (this._processLength <= this._processed)
                        ? 1
                        : (this._processed / this._processLength);
            }
        }

        public async Task<IEntity[]> Scan(Dbc dbc)
        {
            this._processLength = 0;
            this._processed = 0;

            var genres = dbc.Genres.ToArray();
            var albums = dbc.Albums.ToArray();
            var genreAlbums = dbc.GenreAlbums.ToArray();
            var newEntities = new List<GenreAlbum>();
            this._processLength = genres.Length;

            foreach (var genre in genres)
            {
                var refs = await this._library.Browse(genre.Uri);
                var albumUris = refs.Select(e => e.GetAlbumUri()).ToArray();
                var albumIds = albums
                    .Where(e => albumUris.Contains(e.Uri))
                    .Select(e => e.Id)
                    .ToArray();

                var exists = genreAlbums
                    .Where(e => albumIds.Contains(e.AlbumId) && e.GenreId == genre.Id)
                    .ToArray();

                foreach (var albumId in albumIds)
                {
                    if (exists.All(e => e.AlbumId != albumId))
                    {
                        newEntities.Add(new GenreAlbum()
                        {
                            GenreId = genre.Id,
                            AlbumId = albumId
                        });
                    }
                }
                this._processed++;
            }

            if (0 < newEntities.Count())
                dbc.GenreAlbums.AddRange(newEntities);

            return newEntities.ToArray();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this._library = null;
            }

            base.Dispose(disposing);
        }
    }
}
