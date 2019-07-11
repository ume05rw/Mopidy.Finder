using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Genres;
using MusicFront.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("Genre")]
    public class GenreController : Controller
    {
        /// <summary>
        /// ジャンル一覧
        /// </summary>
        /// <param name="store"></param>
        /// <returns></returns>
        /// <remarks>
        /// こちらはページング無しの全件取得。
        /// </remarks>
        [HttpGet("GetPagenatedList")]
        public XhrResponse GetPagenatedList(
            [FromQuery] int? Page,
            [FromServices] GenreStore store
        )
        {
            var genres = store.GetPagenatedList(Page);
            return XhrResponseFactory.CreateSucceeded(genres);
        }
    }
}
