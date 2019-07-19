using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class ArtistAlbumStore : StoreBase<ArtistAlbum>, IMopidyScannable
    {
        public ArtistAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
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

        public async Task<int> Scan()
        {
            this._processLength = 0;
            this._processed = 0;
            var added = 0;

            var albumDictionary = this.Dbc.Albums
                .ToDictionary(e => e.Uri);

            this._processLength = albumDictionary.Count();

            foreach (var artist in this.Dbc.Artists.ToArray())
            {
                var refs = await Library.Browse(artist.Uri);
                var albumUris = refs.Select(e => e.GetAlbumUri()).ToArray();
                var albumIds = this.Dbc.Albums
                    .Where(e => albumUris.Contains(e.Uri))
                    .Select(e => e.Id)
                    .ToArray();

                var exists = this.Dbc.ArtistAlbums
                    .Where(e => albumIds.Contains(e.AlbumId) && e.ArtistId == artist.Id)
                    .ToArray();

                foreach (var albumId in albumIds)
                {
                    if (exists.All(e => e.AlbumId != albumId))
                    {
                        this.Dbc.ArtistAlbums.Add(new ArtistAlbum()
                        {
                            ArtistId = artist.Id,
                            AlbumId = albumId
                        });
                        added++;
                    }
                }

                this._processed++;
            }

            return added;
        }
    }
}
