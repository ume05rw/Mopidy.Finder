using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.JsonRpcs;
using MopidyFinder.Models.Mopidies.Methods;
using System;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MopidyFinder.Controllers
{
    /// <summary>
    /// JsonRPCプロキシ
    /// </summary>
    [Produces("application/json")]
    [Route("JsonRpc")]
    public class JsonRpcController : Controller
    {
        // GET: /<controller>/
        [HttpPost()]
        public async Task<JsonRpcResult> Index([FromBody] JsonRpcParamsQuery values)
        {
            // APIクエリ用パラメータセットを宣言する。
            var request = JsonRpcFactory.CreateQuery(values);

            // id有無(=リクエストor通知)を判定
            var hasId = (values.Id != null);

            try
            {
                var response = await Query.Exec(request);

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
                    return JsonRpcFactory.CreateResult(response);
                }
            }
            catch (Exception ex)
            {
                var id = (hasId)
                    ? (int)values.Id
                    : -1;
                return JsonRpcFactory.CreateErrorResult(id, ex);
            }
        }
    }
}
