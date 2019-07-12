using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Tracks;
using MopidyFinder.Models;
using MopidyFinder.Models.Mopidies.Methods;
using MopidyFinder.Models.Xhrs;
using MopidyFinder.Models.AlbumTracks;

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
            [FromServices] AlbumTracksStore store
        )
        {
            var result = await Playback.Play(tlId);
            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpPost("PlayAlbumByTrack")]
        public async Task<XhrResponse> PlayAlbumByTrack(
            [FromBody] Track track,
            [FromServices] AlbumTracksStore store
        )
        {
            var result = await store.PlayAlbum(track);
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
        public async Task<XhrResponse> GetState()
        {
            try
            {
                var result = await Playback.GetState();
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
            [FromRoute] int? tlId
        )
        {
            try
            {
                var result = (tlId != null)
                    ? await Playback.Play((int)tlId)
                    : await Playback.Resume();

                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Pause")]
        public async Task<XhrResponse> Pause()
        {
            try
            {
                await Playback.Pause();
                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Next")]
        public async Task<XhrResponse> Next()
        {
            try
            {
                await Playback.Next();
                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }

        [HttpGet("Previous")]
        public async Task<XhrResponse> Previous()
        {
            try
            {
                await Playback.Previous();
                return XhrResponseFactory.CreateSucceeded();
            }
            catch (Exception ex)
            {
                return XhrResponseFactory.CreateError(ex.Message);
            }
        }
    }
}
