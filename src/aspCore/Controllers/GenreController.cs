using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
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
        [HttpGet("GetList")]
        public XhrResponse GetList([FromServices] GenreStore store)
        {
            var genres = store.GetList();
            return XhrResponseFactory.CreateSucceeded(genres);
        }
    }
}
