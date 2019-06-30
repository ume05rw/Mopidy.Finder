using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies.Methods;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Libraries
{
    public static class Browse
    {
        private const string Method = "core.library.browse";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("uri")]
            public string Uri;
        }

        public static async Task<List<Ref>> Request(string uri)
        {
            var request = JsonRpcFactory.CreateRequest(Browse.Method, new Args() {
                Uri = uri
            });

            var resultObject = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            return result;
        }
    }
}
