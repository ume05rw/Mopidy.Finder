using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Tracks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Track")]
    public class TrackController : Controller
    {
        [HttpGet("GetTracksByAlbumId/{albumId}")]
        public async Task<Track[]> GetArtistsByAlbumId(
            [FromRoute] int albumId,
            [FromServices] AlbumStore albums,
            [FromServices] TrackStore store
        )
        {
            var album = albums.Get(albumId);
            return (album == null)
                ? Array.Empty<Track>()
                : (await store.GetTracksByAlbum(album)).ToArray();
        }
    }
}
