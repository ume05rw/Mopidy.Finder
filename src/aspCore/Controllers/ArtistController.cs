using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Artists;
using MusicFront.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Artist")]
    public class ArtistController : Controller
    {
        [HttpGet("GetPagenatedList")]
        public XhrResponse GetPagenatedList(
            [FromQuery] int[] GenreIds,
            [FromQuery] int? Page,
            [FromServices] ArtistStore store
        )
        {
            var result = store.GetPagenatedList(GenreIds, Page);
            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
