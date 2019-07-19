using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class GenreArtistStore : StoreBase<GenreArtist>, IRefreshable
    {
        public GenreArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        private decimal _refreshLength = 0;
        private decimal _refreshed = 0;
        public decimal RefreshProgress
        {
            get
            {
                return (this._refreshLength <= 0)
                    ? 0
                    : (this._refreshLength <= this._refreshed)
                        ? 1
                        : (this._refreshed / this._refreshLength);
            }
        }

        public async Task<bool> Refresh()
        {
            this._refreshLength = 0;
            this._refreshed = 0;

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
                .ToArray();

            this._refreshLength = genreArtists.Count();

            this.Dbc.GenreArtists.AddRange(genreArtists);

            this._refreshed = this._refreshLength;

            return true;
        }
    }
}
