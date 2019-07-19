using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models;
using MopidyFinder.Models.Settings;
using MopidyFinder.Models.Xhrs;
using System.Threading.Tasks;

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

        [HttpGet("Update")]
        public XhrResponse GetUpdateStatus()
        {
            var result = DbMaintainer.Instance.GetStatus();

            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpPost("Update")]
        public XhrResponse ExecUpdate()
        {
            if (DbMaintainer.Instance.IsActive)
                return XhrResponseFactory.CreateError("Already Updating.");

            Task.Run(() => {
                DbMaintainer.Instance.Refresh(false);
            });

            return XhrResponseFactory.CreateSucceeded(true);
        }

        [HttpGet("Refresh")]
        public XhrResponse GetRefreshStatus()
        {
            var result = DbMaintainer.Instance.GetStatus();

            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpPost("Refresh")]
        public XhrResponse ExecRefresh()
        {
            if (DbMaintainer.Instance.IsActive)
                return XhrResponseFactory.CreateError("Already Refreshing.");

            Task.Run(() => {
                DbMaintainer.Instance.Refresh(true);
            });

            return XhrResponseFactory.CreateSucceeded(true);
        }
    }
}
