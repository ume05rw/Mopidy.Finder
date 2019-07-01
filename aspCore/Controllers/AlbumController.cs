using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Xhrs;
using System;
using System.Collections.Generic;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Album")]
    public class AlbumController : Controller
    {
        [HttpGet("{id}")]
        public XhrResponse Index(
            [FromRoute] int id,
            [FromServices] AlbumStore store
        )
        {
            var album = store.Get(id);
            return (album == null)
                ? XhrResponseFactory.CreateError($"Album Not Found: id={id}")
                : XhrResponseFactory.CreateSucceeded(album);
        }

        [HttpGet("GetList")]
        public XhrResponse GetList(
            [FromQuery] string[] names,
            [FromQuery] int[] ids,
            [FromServices] AlbumStore store
        )
        {
            var albums = store.GetList(names, ids);
            return XhrResponseFactory.CreateSucceeded(albums);
        }

        [HttpGet("GetListByArtistId/{artistId}")]
        public XhrResponse GetListByArtistId(
            [FromRoute] int artistId,
            [FromServices] AlbumStore store,
            [FromServices] ArtistStore artistStore
        )
        {
            var artist = artistStore.Get(artistId);
            return (artist == null)
                ? XhrResponseFactory.CreateError($"Related Albums Not Found: artistId={artistId}")
                : XhrResponseFactory.CreateSucceeded(
                    store.GetListByArtist(artist).ToArray()
                  );
        }

        [HttpGet("GetListByGenreId/{genreId}")]
        public XhrResponse GetListByGenreId(
            [FromRoute] int genreId,
            [FromServices] AlbumStore store,
            [FromServices] GenreStore genreStore
        )
        {
            var genre = genreStore.Get(genreId);
            return (genre == null)
                ? XhrResponseFactory.CreateError($"Related Albums Not Found: genreId={genreId}")
                : XhrResponseFactory.CreateSucceeded(
                    store.GetListByGenre(genre).ToArray()
                  );
        }
    }
}
