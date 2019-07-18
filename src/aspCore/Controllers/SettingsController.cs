using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Settings;
using MopidyFinder.Models.Xhrs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    [Produces("application/json")]
    [Route("Settings")]
    public class SettingsController : Controller
    {
        [HttpGet()]
        public XhrResponse GetSettings([FromServices] SettingsStore store)
        {
            return XhrResponseFactory.CreateSucceeded(store.Entity);
        }

        [HttpPost()]
        public XhrResponse SetSettings(
            [FromServices] SettingsStore store,
            [FromBody] Settings newSettings
        )
        {
            store.Entity.ServerAddress = newSettings.ServerAddress;
            store.Entity.ServerPort = newSettings.ServerPort;
            store.Update();

            return XhrResponseFactory.CreateSucceeded(store.Entity);
        }
    }
}
