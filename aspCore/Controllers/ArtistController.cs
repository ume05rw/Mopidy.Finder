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

        [HttpGet("GetPagenatedList")]
        public XhrResponse GetPagenatedList(
            [FromQuery] int[] genreIds,
            [FromQuery] int? page,
            [FromServices] ArtistStore store
        )
        {
            var result = store.GetPagenatedList(genreIds, page);
            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
