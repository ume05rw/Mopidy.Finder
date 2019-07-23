using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class ArtistAlbumStore : StoreBase<ArtistAlbum>, IMopidyScannable
    {
        private Library _library;

        public ArtistAlbumStore(
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
                    : ((this._processLength <= this._processed)
                        ? 1
                        : (this._processed / this._processLength));
            }
        }

        public async Task<IEntity[]> Scan(Dbc dbc)
        {
            this._processLength = 0;
            this._processed = 0;

            var artists = dbc.Artists.ToArray();
            var albums = dbc.Albums.ToArray();
            var artistAlbums = dbc.ArtistAlbums.ToArray();
            var result = new List<ArtistAlbum>();
            this._processLength = artists.Length;

            foreach (var artist in artists)
            {
                var refs = await this._library.Browse(artist.Uri);
                var albumUris = refs.Select(e => e.GetAlbumUri()).ToArray();
                var albumIds = albums
                    .Where(e => albumUris.Contains(e.Uri))
                    .Select(e => e.Id)
                    .ToArray();

                var exists = artistAlbums
                    .Where(e => albumIds.Contains(e.AlbumId) && e.ArtistId == artist.Id)
                    .ToArray();

                foreach (var albumId in albumIds)
                {
                    if (exists.All(e => e.AlbumId != albumId))
                    {
                        result.Add(new ArtistAlbum()
                        {
                            ArtistId = artist.Id,
                            AlbumId = albumId
                        });
                    }
                }
                this._processed++;
            }

            return result.ToArray();
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
