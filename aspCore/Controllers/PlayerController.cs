using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Tracks;
using MusicFront.Models;
using MusicFront.Models.Mopidies.Methods;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Player")]
    public class PlayerController : Controller
    {
        [HttpPost("ClearList")]
        public async Task<bool> ClearList(
            [FromServices] TrackStore store
        )
        {
            var result = await store.ClearList();
            return result;
        }

        [HttpPost("SetListByUris")]
        public async Task<List<Track>> SetListByUris(
            [FromBody] string[] uris,
            [FromServices] TrackStore store
        )
        {
            var result = await store.SetListByUris(uris);
            return result;
        }

        [HttpGet("GetList")]
        public async Task<List<Track>> GetList(
            [FromServices] TrackStore store
        )
        {
            var result = await store.GetList();
            return result;
        }

        [HttpGet("GetState")]
        public async Task<string> GetState()
        {
            var result = await Playback.GetState();
            return result;
        }

        [HttpGet("GetCurrentTrack")]
        public async Task<Track> GetCurrentTrack(
            [FromServices] TrackStore store
        )
        {
            var result = await store.GetCurrentTrack();
            return result;
        }

        [HttpGet("Play/{tlId?}")]
        public async Task<bool> Play(
            [FromRoute] int? tlId
        )
        {
            var result = (tlId != null)
                ? await Playback.Play((int)tlId)
                : await Playback.Resume();

            return result;
        }

        [HttpGet("Pause")]
        public async Task<bool> Pause()
        {
            return await Playback.Pause();
        }

        [HttpGet("Next")]
        public async Task<bool> Next()
        {
            return await Playback.Next();
        }

        [HttpGet("Previous")]
        public async Task<bool> Previous()
        {
            return await Playback.Previous();
        }
    }
}
