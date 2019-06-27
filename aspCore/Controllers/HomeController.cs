using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models;
using MusicFront.Models.Albums;

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

        public async Task<IActionResult> Index([FromServices] AlbumStore stroe)
        {
            await stroe.Refresh();

            return this.File(HomeController.IndexDevBytes, "text/html");
        }
    }
}
