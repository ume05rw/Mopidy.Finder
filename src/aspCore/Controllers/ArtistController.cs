using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    [Produces("application/json")]
    [Route("Artist")]
    public class ArtistController : Controller
    {
        [HttpGet("GetPagenatedList")]
        public XhrResponse GetPagenatedList(
            [FromQuery] int[] GenreIds,
            [FromQuery] string FilterText,
            [FromQuery] int? Page,
            [FromServices] ArtistStore store
        )
        {
            var args = new ArtistStore.PagenagedQueryArgs()
            {
                GenreIds = GenreIds,
                FilterText = FilterText,
                Page = Page
            };
            var result = store.GetPagenatedList(args);

            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
