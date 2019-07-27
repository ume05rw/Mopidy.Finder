using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.WindowsServices;
using MopidyFinder.Models;
using System.ServiceProcess;

namespace MopidyFinder.Extensions
{
    public static class WebHostServiceExtensions
    {
        public static void RunAsCustomService(this IWebHost host)
        {
            var webHostService = new CustomWebHostService(host);
            ServiceBase.Run(webHostService);
        }
    }

    /// <summary>
    /// このプロセスがサービスである事を表します。
    /// </summary>
    public class CustomWebHostService : WebHostService
    {
        public CustomWebHostService(IWebHost host) : base(host) { }

        protected override void OnStarting(string[] args)
        {
            base.OnStarting(args);
        }

        protected override void OnStarted()
        {
            if (
                DbMaintainer.Instance != null
                && !DbMaintainer.Instance.IsAlbumScannerRunning
            )
            {
                DbMaintainer.Instance.RunAlbumScanner();
            }

            base.OnStarted();
        }

        protected override void OnStopping()
        {
            if (
                DbMaintainer.Instance != null
                && (DbMaintainer.Instance.IsAlbumScannerRunning
                    || DbMaintainer.Instance.IsDbUpdateRunning)
            )
            {
                DbMaintainer.Instance.StopAllTasks()
                    .GetAwaiter()
                    .GetResult();
            }

            base.OnStopping();
        }
    }
}
