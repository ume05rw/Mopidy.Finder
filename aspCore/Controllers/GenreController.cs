using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Genre")]
    public class GenreController : Controller
    {
        [HttpGet("{id}")]
        public XhrResponse Index(
            [FromRoute] int id,
            [FromServices] GenreStore store
        )
        {
            var genre = store.Get(id);
            return (genre == null)
                ? XhrResponseFactory.CreateError($"Genre Not Found: id={id}")
                : XhrResponseFactory.CreateSucceeded(genre);
        }

        [HttpGet("GetList")]
        public XhrResponse GetList(
            [FromQuery] string[] names,
            [FromQuery] int[] ids,
            [FromServices] GenreStore store
        )
        {
            var genres = store.GetList(names, ids);
            return XhrResponseFactory.CreateSucceeded(genres);
        }

        [HttpGet("GetListByArtistId/{artistId}")]
        public XhrResponse GetListByArtistId(
            [FromRoute] int artistId,
            [FromServices] GenreStore store,
            [FromServices] ArtistStore artistStore
        )
        {
            var artist = artistStore.Get(artistId);
            return (artist == null)
                ? XhrResponseFactory.CreateError($"Related Genres Not Found: artistId={artistId}")
                : XhrResponseFactory.CreateSucceeded(
                    store.GetListByArtist(artist).ToArray()
                  );
        }

        [HttpGet("GetListByAlbumId/{albumId}")]
        public XhrResponse GetListByAlbumId(
            [FromRoute] int albumId,
            [FromServices] GenreStore store,
            [FromServices] AlbumStore albumStore
        )
        {
            var album = albumStore.Get(albumId);
            return (album == null)
                ? XhrResponseFactory.CreateError($"Related Genres Not Found: albumId={albumId}")
                : XhrResponseFactory.CreateSucceeded(
                    store.GetListByAlbum(album).ToArray()
                  );
        }
    }
}
