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
    [Route("Artist")]
    public class ArtistController : Controller
    {
        [HttpGet("{id}")]
        public Artist Index(
            [FromQuery] int id,
            [FromServices] ArtistStore store
        )
        {
            return store.Get(id);
        }

        [HttpGet("FindAll")]
        public List<Artist> Index(
            [FromQuery] string[] names,
            [FromQuery] int[] ids,
            [FromServices] ArtistStore store
        )
        {
            return store.FindAll(names, ids);
        }

        [HttpGet("GetGenresByArtistId/{artistId}")]
        public Genre[] GetGenresByArtistId(
            [FromRoute] int artistId,
            [FromServices] ArtistStore store
        )
        {
            var artist = store.Get(artistId);
            return (artist == null)
                ? Array.Empty<Genre>()
                : store.GetGenresByArtist(artist).ToArray();
        }

        [HttpGet("GetAlbumsByArtistId/{artistId}")]
        public Album[] GetAlbumsByArtistId(
            [FromRoute] int artistId,
            [FromServices] ArtistStore store
        )
        {
            var artist = store.Get(artistId);
            return (artist == null)
                ? Array.Empty<Album>()
                : store.GetAlbumsByArtist(artist).ToArray();
        }
    }
}
