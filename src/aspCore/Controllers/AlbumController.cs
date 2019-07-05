using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Album")]
    public class AlbumController : Controller
    {
        [HttpGet("{id}")]
        public XhrResponse Index(
            [FromRoute] int id,
            [FromServices] AlbumStore store
        )
        {
            var album = store.Get(id);
            return (album == null)
                ? XhrResponseFactory.CreateError($"Album Not Found: id={id}")
                : XhrResponseFactory.CreateSucceeded(album);
        }

        [HttpGet("GetPagenatedList")]
        public XhrResponse GetPagenatedList(
            [FromQuery] int[] genreIds,
            [FromQuery] int[] artistIds,
            [FromQuery] int? page,
            [FromServices] AlbumStore store
        )
        {
            var result = store.GetPagenatedList(genreIds, artistIds, page);
            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
