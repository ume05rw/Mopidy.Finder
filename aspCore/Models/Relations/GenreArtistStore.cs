using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using System.Collections.Generic;
using System.Linq;

namespace MusicFront.Models.Relations
{
    public class GenreArtistStore : StoreBase<GenreArtist>
    {
        public GenreArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public void Refresh()
        {
            this.Dbc.GenreArtists.RemoveRange(this.Dbc.GenreArtists);
            this.Dbc.SaveChanges();

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

            this.Dbc.GenreArtists.AddRange(genreArtists);

            this.Dbc.SaveChanges();
        }
    }
}
