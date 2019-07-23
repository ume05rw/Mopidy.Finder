using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MopidyFinder.Models;
using System.IO;
using System.Threading.Tasks;

namespace MopidyFinder.Controllers
{
    public class HomeController : Controller
    {
        // 本番ビルドを試すときはこちら。
        private const string IndexName = "index.html";
        private static readonly string IndexPath
            = System.IO.Path.Combine(Program.DistPath, HomeController.IndexName);
        private static byte[] IndexBytes = null;

        // VSデバッグ用HTML
        private const string IndexDevName = "index.dev.html";
        private static readonly string IndexDevPath
            = System.IO.Path.Combine(Program.DistPath, HomeController.IndexDevName);
        private static byte[] IndexDevBytes = null;

        private void EnsureIndex()
        {
            if (HomeController.IndexBytes != null)
                return;
            
            if (!System.IO.File.Exists(HomeController.IndexPath))
                throw new FileNotFoundException("dist/index.html Not Found.");

            HomeController.IndexBytes
                = System.IO.File.ReadAllBytes(HomeController.IndexPath);
        }

        private void EnsureIndexDev()
        {
            if (HomeController.IndexDevBytes != null)
                return;
            
            if (!System.IO.File.Exists(HomeController.IndexDevPath))
                throw new FileNotFoundException("dist/index.dev.html Not Found.");

            HomeController.IndexDevBytes
                = System.IO.File.ReadAllBytes(HomeController.IndexDevPath);
        }

        public IActionResult Index()
        {
#if DEBUG
            this.EnsureIndexDev();
            return this.File(HomeController.IndexDevBytes, "text/html");

#else
            // TS/WebpackコンパイルはMSBuild側ではやってない。
            // 別途 npm run build:prod を実行すること。
            this.EnsureIndex();
            return this.File(HomeController.IndexBytes, "text/html");
#endif
        }

        public IActionResult Debug()
        {
            this.EnsureIndexDev();
            return this.File(HomeController.IndexDevBytes, "text/html");
        }

        public IActionResult Release()
        {
            this.EnsureIndex();
            return this.File(HomeController.IndexBytes, "text/html");
        }
    }
}
