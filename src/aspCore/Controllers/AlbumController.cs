using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models;
using MopidyFinder.Models.Xhrs;
using System.Linq;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    [Produces("application/json")]
    [Route("Album")]
    public class AlbumController : Controller
    {
        [HttpGet("Exists")]
        public XhrResponse Exists([FromServices] Dbc dbc)
        {
            var result = dbc.Albums.Any();

            return XhrResponseFactory.CreateSucceeded(result);
        }
    }
}
