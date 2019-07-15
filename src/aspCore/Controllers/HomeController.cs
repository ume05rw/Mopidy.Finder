using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models;
using System.Threading.Tasks;

namespace MopidyFinder.Controllers
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

        public async Task<IActionResult> Index()
        {
            //await Initializer.Exec();

#if DEBUG
            return this.File(HomeController.IndexDevBytes, "text/html");
#else
            // TS/WebpackコンパイルはMSBuild側ではやってない。
            // 別途 npm run build:prod を実行すること。
            return this.File(HomeController.IndexBytes, "text/html");
#endif
        }

        public IActionResult Debug()
        {
            return this.File(HomeController.IndexDevBytes, "text/html");
        }

        public IActionResult Release()
        {
            return this.File(HomeController.IndexBytes, "text/html");
        }
    }
}
