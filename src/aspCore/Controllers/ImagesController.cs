using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Settings;
using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    /// <summary>
    /// 画像プロキシ
    /// </summary>
    [Route("Images")]
    public class ImagesController : Controller
    {
        [HttpGet("{fileName}")]
        public async Task<FileStreamResult> Index(
            [FromRoute] string fileName,
            [FromServices] SettingsStore store
        )
        {
            var url = $"{store.Entity.ImageUri}/{fileName}";

            HttpResponseMessage message;
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

                try
                {
                    message = await client.GetAsync(url);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                var bytes = await message.Content.ReadAsByteArrayAsync();
                var stream = new MemoryStream(bytes);
                var type = message.Content.Headers.ContentType.ToString();

                return new FileStreamResult(stream, type);
            }
        }
    }
}
