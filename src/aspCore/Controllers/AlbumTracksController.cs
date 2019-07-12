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
        /// <summary>
        /// 
        /// </summary>
        /// <param name="GenreIds"></param>
        /// <param name="ArtistIds"></param>
        /// <param name="FilterText"></param>
        /// <param name="Page"></param>
        /// <param name="store"></param>
        /// <returns></returns>
        /// <remarks>
        /// Getクエリにつき、JSONオブジェクトでなくパラメータごとに取得する。
        /// </remarks>
        [HttpGet("GetPagenatedList")]
        public async Task<XhrResponse> GetPagenatedList(
            [FromQuery] int[] GenreIds,
            [FromQuery] int[] ArtistIds,
            [FromQuery] string FilterText,
            [FromQuery] int? Page,
            [FromServices] AlbumTracksStore store
        )
        {
            var args = new AlbumTracksStore.PagenagedQueryArgs()
            {
                GenreIds = GenreIds,
                ArtistIds = ArtistIds,
                FilterText = FilterText,
                Page = Page
            };
            var result = await store.GetPagenatedList(args);

            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
