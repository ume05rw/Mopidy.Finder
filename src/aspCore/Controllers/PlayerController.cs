using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.AlbumTracks;
using MopidyFinder.Models.Mopidies.Methods;
using MopidyFinder.Models.Tracks;
using MopidyFinder.Models.Xhrs;
using System;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    [Produces("application/json")]
    [Route("Player")]
    public class PlayerController : Controller
    {
        [HttpPost("PlayAlbumByTlId")]
        public async Task<XhrResponse> PlayAlbumByTrack(
            [FromBody] int tlId,
            [FromServices] Playback playback
        )
        {
            var result = await playback.Play(tlId);
            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpPost("PlayAlbumByTrackId")]
        public async Task<XhrResponse> PlayAlbumByTrackId(
            [FromBody] int TrackId,
            [FromServices] AlbumTracksStore store
        )
        {
            var result = await store.PlayAlbumByTrackId(TrackId);
            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpPost("ClearList")]
        public async Task<XhrResponse> ClearList(
            [FromServices] TrackStore store
        )
        {
            var result = await store.ClearList();
            return (!result)
                ? XhrResponseFactory.CreateError($"Clear Failed.")
                : XhrResponseFactory.CreateSucceeded();
        }

        [HttpGet("GetState")]
        public async Task<XhrResponse> GetState([FromServices] Playback playback)
        {
            try
            {
                var result = await playback.GetState();
                return XhrResponseFactory.CreateSucceeded(result);
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("GetCurrentTrack")]
        public async Task<XhrResponse> GetCurrentTrack(
            [FromServices] TrackStore store
        )
        {
            try
            {
                var result = await store.GetCurrentTrack();
                return XhrResponseFactory.CreateSucceeded(result);
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Play/{tlId?}")]
        public async Task<XhrResponse> Play(
            [FromRoute] int? tlId,
            [FromServices] Playback playback
        )
        {
            try
            {
                var result = (tlId != null)
                    ? await playback.Play((int)tlId)
                    : await playback.Resume();

                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Pause")]
        public async Task<XhrResponse> Pause([FromServices] Playback playback)
        {
            try
            {
                await playback.Pause();
                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Next")]
        public async Task<XhrResponse> Next([FromServices] Playback playback)
        {
            try
            {
                await playback.Next();
                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Previous")]
        public async Task<XhrResponse> Previous([FromServices] Playback playback)
        {
            try
            {
                await playback.Previous();
                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }
    }
}
