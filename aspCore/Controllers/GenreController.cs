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
        [HttpGet("{id}")]
        public Genre Index(
            [FromQuery] int id,
            [FromServices] GenreStore store
        )
        {
            return store.Get(id);
        }

        [HttpGet("FindAll")]
        public List<Genre> FindAll(
            [FromQuery] string[] names,
            [FromQuery] int[] ids,
            [FromServices] GenreStore store
        )
        {
            return store.FindAll(names, ids);
        }

        [HttpGet("GetArtistsByGenreId/{genreId}")]
        public Artist[] GetArtistsByGenreId(
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
