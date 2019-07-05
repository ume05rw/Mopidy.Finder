using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.AlbumTracks;
using MusicFront.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.src.aspCore.Controllers
{
    [Produces("application/json")]
    [Route("AlbumTracks")]
    public class AlbumTracksController : Controller
    {
        [HttpGet("GetList")]
        public async Task<XhrResponse> GetPagenatedList(
            [FromQuery] int[] albumIds,
            [FromServices] AlbumTracksStore store
        )
        {
            var result = await store.GetList(albumIds);
            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
