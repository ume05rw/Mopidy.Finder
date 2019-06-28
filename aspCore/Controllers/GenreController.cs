using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Genre")]
    public class GenreController : Controller
    {
        [HttpGet()]
        public List<Genre> Index(
            [FromQuery] string name,
            [FromServices] GenreStore store
        )
        {
            return store.FindAll(name);
        }

        [HttpGet("GetArtistByGenreId/{genreId}")]
        public Artist[] GetArtistByGenreId(
            [FromRoute] int genreId,
            [FromServices] GenreStore store
        )
        {
            var genre = store.Get(genreId);
            return (genre == null)
                ? Array.Empty<Artist>()
                : store.GetArtistsByGenre(genre).ToArray();
        }

        [HttpGet("GetAlbumsByGenreId/{genreId}")]
        public Album[] GetAlbumsByGenreId(
            [FromRoute] int genreId,
            [FromServices] GenreStore store
        )
        {
            var genre = store.Get(genreId);
            return (genre == null)
                ? Array.Empty<Album>()
                : store.GetAlbumsByGenre(genre).ToArray();
        }
    }
}
