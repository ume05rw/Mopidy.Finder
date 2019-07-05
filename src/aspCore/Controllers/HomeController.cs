using Microsoft.AspNetCore.Mvc;
using MusicFront.Models;

namespace MusicFront.Controllers
{
    public class HomeController : Controller
    {
        // 本番ビルドを試すときはこちら。
        private const string IndexName = "index.html";
        private static readonly string IndexPath
            = System.IO.Path.Combine(Program.DistPath, HomeController.IndexName);
        private static readonly byte[] IndexBytes
            = System.IO.File.ReadAllBytes(HomeController.IndexPath);

        // VSデバッグ用HTML
        private const string IndexDevName = "index.dev.html";
        private static readonly string IndexDevPath
            = System.IO.Path.Combine(Program.DistPath, HomeController.IndexDevName);
        private static readonly byte[] IndexDevBytes
            = System.IO.File.ReadAllBytes(HomeController.IndexDevPath);

        public IActionResult Index()
        {
            Initializer.Exec();

            return this.File(HomeController.IndexDevBytes, "text/html");
        }
    }
}
