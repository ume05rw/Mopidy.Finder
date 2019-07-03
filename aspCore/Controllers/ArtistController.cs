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
    [Route("Artist")]
    public class ArtistController : Controller
    {
        [HttpGet("{id}")]
        public XhrResponse Index(
            [FromRoute] int id,
            [FromServices] ArtistStore store
        )
        {
            var artist = store.Get(id);
            return (artist == null)
                ? XhrResponseFactory.CreateError($"Artist Not Found: id={id}")
                : XhrResponseFactory.CreateSucceeded(artist);
        }

        [HttpGet("GetList")]
        public XhrResponse GetList(
            [FromQuery] string[] names,
            [FromQuery] int[] ids,
            [FromServices] ArtistStore store
        )
        {
            var artists = store.GetList(names, ids);
            return XhrResponseFactory.CreateSucceeded(artists.ToArray());
        }

        [HttpGet("GetListByGenreId/{genreId}")]
        public XhrResponse GetListByGenreId(
            [FromRoute] int genreId,
            [FromServices] ArtistStore store,
            [FromServices] GenreStore genreStore
        )
        {
            var genre = genreStore.Get(genreId);
            return (genre == null)
                ? XhrResponseFactory.CreateError($"Related Artists Not Found: genreId={genreId}")
                : XhrResponseFactory.CreateSucceeded(
                    store.GetListByGenre(genre).ToArray()
                  );
        }

        [HttpGet("GetListByAlbumId/{albumId}")]
        public XhrResponse GetListByAlbumId(
            [FromRoute] int albumId,
            [FromServices] ArtistStore store,
            [FromServices] AlbumStore albumStore
        )
        {
            var album = albumStore.Get(albumId);
            return (album == null)
                ? XhrResponseFactory.CreateError($"Related Artists Not Found: albumId={albumId}")
                : XhrResponseFactory.CreateSucceeded(
                    store.GetListByAlbum(album).ToArray()
                  );
        }
    }
}
