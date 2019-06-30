using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Libraries
{
    public static class Lookup
    {
        private const string Method = "core.library.lookup";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("uris")]
            public string[] Uris;
        }

        public static async Task<List<Track>> Request(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Lookup.Method, new Args() {
                Uris = uris
            });

            var resultObject = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var dic = JObject.FromObject(resultObject).ToObject<Dictionary<string, List<Track>>>();
            var result = new List<Track>();
            foreach (var pair in dic)
                result.AddRange(pair.Value);

            return result;
        }
    }
}
