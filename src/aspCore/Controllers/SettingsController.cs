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

        [HttpGet("AlbumScanProgress")]
        public XhrResponse GetAlbumScanProgress()
        {
            var result = DbMaintainer.GetAlbumScanProgress();

            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpGet("UpdateProgress")]
        public XhrResponse GetUpdateProgress()
        {
            var result = DbMaintainer.Instance.GetProgress();

            return XhrResponseFactory.CreateSucceeded(result);
        }

        [HttpPost("DbScanNew")]
        public XhrResponse DbScanNew()
        {
            if (DbMaintainer.Instance.IsRunning)
                return XhrResponseFactory.CreateError("Already Updating.");

            var task = DbMaintainer.Instance.Update(DbMaintainer.UpdateType.ScanNew);

            return XhrResponseFactory.CreateSucceeded(true);
        }

        [HttpPost("DbCleanup")]
        public XhrResponse DbCleanup()
        {
            if (DbMaintainer.Instance.IsRunning)
                return XhrResponseFactory.CreateError("Already Refreshing.");

            var task = DbMaintainer.Instance.Update(DbMaintainer.UpdateType.Cleanup);

            return XhrResponseFactory.CreateSucceeded(true);
        }
    }
}
