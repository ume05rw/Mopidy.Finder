using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.a.Models;
using MusicFront.Models;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;

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
