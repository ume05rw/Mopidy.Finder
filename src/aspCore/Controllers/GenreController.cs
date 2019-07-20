using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models;
using MopidyFinder.Models.Genres;
using MopidyFinder.Models.Xhrs;
using System.Linq;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    [Produces("application/json")]
    [Route("Genre")]
    public class GenreController : Controller
    {
        [HttpGet("Exists")]
        public XhrResponse Exists([FromServices] Dbc dbc)
        {
            var result = dbc.Genres.Any();

            return XhrResponseFactory.CreateSucceeded(result);
        }

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
            [FromQuery] string FilterText,
            [FromQuery] int? Page,
            [FromServices] GenreStore store
        )
        {
            var args = new GenreStore.PagenagedQueryArgs()
            {
                FilterText = FilterText,
                Page = Page
            };
            var genres = store.GetPagenatedList(args);

            return XhrResponseFactory.CreateSucceeded(genres);
        }
    }
}
