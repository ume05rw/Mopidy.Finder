using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods;
using MusicFront.Models.Mopidies.Methods.Libraries;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.aspCore.Models.Mopidies.Methods.Libraries
{
    public static class Lookup
    {
        private const string Method = "core.library.lookup";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("uris")]
            public List<string> Uris;
        }

        public static JsonRpcQuery CreateRequest(List<string> uris)
            => JsonRpcFactory.CreateRequest(Lookup.Method, new Args() { Uris = uris });

        public static async Task<List<Track>> Request(List<string> uris)
        {
            var request = JsonRpcFactory.CreateRequest(Lookup.Method, new Args() {
                Uris = uris
            });

            var resultObject = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Track>>();

            return result;
        }
    }
}
