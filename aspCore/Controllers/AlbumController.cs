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
    [Route("Album")]
    public class AlbumController : Controller
    {
        [HttpGet("{id}")]
        public Album Index(
            [FromQuery] int id,
            [FromServices] AlbumStore store
        )
        {
            return store.Get(id);
        }

        [HttpGet("FindAll")]
        public List<Album> FindAll(
            [FromQuery] string[] names,
            [FromQuery] int[] ids,
            [FromServices] AlbumStore store
        )
        {
            return store.FindAll(names, ids);
        }

        [HttpGet("GetArtistsByAlbumId/{albumId}")]
        public Artist[] GetArtistsByAlbumId(
            [FromRoute] int albumId,
            [FromServices] AlbumStore store
        )
        {
            var album = store.Get(albumId);
            return (album == null)
                ? Array.Empty<Artist>()
                : store.GetArtistsByAlbum(album).ToArray();
        }

        [HttpGet("GetGenresByAlbumId/{albumId}")]
        public Genre[] GetGenresByAlbumId(
            [FromRoute] int albumId,
            [FromServices] AlbumStore store
        )
        {
            var album = store.Get(albumId);
            return (album == null)
                ? Array.Empty<Genre>()
                : store.GetGenresByAlbum(album).ToArray();
        }
    }
}
