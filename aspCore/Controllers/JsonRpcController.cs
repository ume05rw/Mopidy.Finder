using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    [Produces("application/json")]
    [Route("JsonRpc")]
    public class JsonRpcController : Controller
    {
        // GET: /<controller>/
        [HttpPost()]
        public async Task<JsonRpcResult> Index([FromBody] JsonRpcParamsQuery values)
        {
            // APIクエリ用パラメータセットを宣言する。
            var sendValues = JsonRpcFactory.CreateQuery(values);

            // id有無(=リクエストor通知)を判定
            var hasId = (values.id != null);

            var url = "http://192.168.254.251:6680/mopidy/rpc";
            HttpResponseMessage message;
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
            );
            client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

            try
            {
                var sendJson = JsonConvert.SerializeObject(sendValues);
                var content = new StringContent(sendJson, Encoding.UTF8, "application/json");
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                message = await client.PostAsync(url, content);
            }
            catch (Exception ex)
            {
                return JsonRpcFactory.CreateErrorResult(
                    (hasId
                        ? (int)values.id
                        : -1),
                    $"Network Error: {ex.Message}"
                );
            }

            // クエリ後
            if (!hasId)
            {
                // 通知の場合
                // レスポンスには何も含まない。
                return null;
            }
            else
            {
                // リクエストの場合
                // 戻り値JSONをそのまま返す。
                var responseJson = await message.Content.ReadAsStringAsync();
                var response = JsonConvert.DeserializeObject<JsonRpcParamsResponse>(responseJson);
                var result = JsonRpcFactory.CreateResult(response);

                return result;
            }
        }
    }
}
