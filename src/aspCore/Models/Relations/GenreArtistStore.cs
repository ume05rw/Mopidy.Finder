using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class GenreArtistStore : StoreBase<GenreArtist>, IMopidyScannable
    {
        public GenreArtistStore([FromServices] Dbc dbc) : base(dbc)
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

        public async Task<IEntity[]> Scan(Dbc dbc)
        {
            this._processLength = 0;
            this._processed = 0;

            var newEntities = dbc.GenreAlbums
                .Join(
                    dbc.ArtistAlbums,
                    ga => ga.AlbumId,
                    aa => aa.AlbumId,
                    (ga, aa) => new
                    {
                        ga.GenreId,
                        aa.ArtistId
                    }
                )
                .GroupBy(e => new
                {
                    e.GenreId,
                    e.ArtistId
                })
                .Select(e => new GenreArtist()
                {
                    GenreId = e.Key.GenreId,
                    ArtistId = e.Key.ArtistId
                })
                .ToArray()
                .GroupJoin(
                    dbc.GenreArtists,
                    found => new { found.GenreId, found.ArtistId },
                    exists => new { exists.GenreId, exists.ArtistId },
                    (found, exists) => new
                    {
                        found = found,
                        exists = exists
                    }
                )
                .Where(e => !e.exists.Any())
                .Select(e => e.found)
                .ToArray();

            this._processLength = newEntities.Length;
            this._processed = this._processLength;

            if (0 < newEntities.Length)
                dbc.GenreArtists.AddRange(newEntities);

            return newEntities;
        }
    }
}
