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

        public async Task<int> Scan()
        {
            this._processLength = 0;
            this._processed = 0;

            var genreArtists = this.Dbc.GenreAlbums
                .Join(
                    this.Dbc.ArtistAlbums,
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
                    this.Dbc.GenreArtists,
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

            this._processLength = genreArtists.Length;

            this.Dbc.GenreArtists.AddRange(genreArtists);

            this._processed = this._processLength;

            return genreArtists.Length;
        }
    }
}
