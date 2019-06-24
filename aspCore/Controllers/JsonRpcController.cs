using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Entities;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicFront.Controllers
{
    public class JsonRpcController : Controller
    {
        // GET: /<controller>/
        [HttpPost()]
        [Produces("application/json")]
        public async Task<string> Index([FromBody] JsonRpcFullParams values)
        {
            // APIクエリ用パラメータセットを宣言する。
            JsonRpcBase sendValues;

            // パラメータ有無判定
            var hasParams = (values.@params != null);
            // id有無(=リクエストor通知)を判定
            var hasId = (values.id != null);
            
            if (hasId)
            {
                // id付き=リクエスト
                sendValues = (hasParams)
                    ? new JsonRpcRequestWithParams((int)values.id, values.method, values.@params)
                    : new JsonRpcRequest((int)values.id, values.method);
            }
            else
            {
                // id無し=通知
                sendValues = (hasParams)
                    ? new JsonRpcNoticeWithParams(values.method, values.@params)
                    : new JsonRpcNotice(values.method);
            }

            var url = "http://192.168.254.251:6680/mopidy/rpc";
            HttpResponseMessage response;
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
                response = await client.PostAsync(url, content);
            }
            catch (Exception ex)
            {
                var error = new JsonRpcErrorResult(
                    (hasId
                        ? (int)values.id
                        : -1),
                    $"Network Error: {ex.Message}"
                );
                return JsonConvert.SerializeObject(error);
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
                var resultJson = await response.Content.ReadAsStringAsync();
                return resultJson;
            }
        }
    }
}
