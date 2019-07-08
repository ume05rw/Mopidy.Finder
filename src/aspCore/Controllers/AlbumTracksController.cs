using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.AlbumTracks;
using MusicFront.Models.Mopidies.Methods;
using MusicFront.Models.Tracks;
using MusicFront.Models.Xhrs;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.src.aspCore.Controllers
{
    [Produces("application/json")]
    [Route("AlbumTracks")]
    public class AlbumTracksController : Controller
    {
        [HttpGet("GetPagenatedList")]
        public async Task<XhrResponse> GetPagenatedList(
            [FromQuery] int[] GenreIds,
            [FromQuery] int[] ArtistIds,
            [FromQuery] int? Page,
            [FromServices] AlbumTracksStore store
        )
        {
            var result = await store.GetPagenatedList(GenreIds, ArtistIds, Page);
            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
