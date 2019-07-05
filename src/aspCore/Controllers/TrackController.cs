using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Tracks;
using MusicFront.Models.Xhrs;
using System;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Track")]
    public class TrackController : Controller
    {
        [HttpGet("GetTracksByAlbumId/{albumId}")]
        public async Task<XhrResponse> GetTracksByAlbumId(
            [FromRoute] int albumId,
            [FromServices] AlbumStore albumStore,
            [FromServices] TrackStore store
        )
        {
            var album = albumStore.Get(albumId);

            if (album == null)
                return XhrResponseFactory.CreateError($"Album Not Found: albumId={albumId}");

            var tracks = (await store.GetTracksByAlbum(album)).ToArray();
            return (tracks.Length <= 0)
                ? XhrResponseFactory.CreateError($"Related Tracks Not Found: albumId={albumId}")
                : XhrResponseFactory.CreateSucceeded(tracks);
        }
    }
}
