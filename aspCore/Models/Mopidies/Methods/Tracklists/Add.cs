using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Tracklists
{
    public static class Add
    {
        private const string Method = "core.tracklist.add";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("uris")]
            public string[] Uris;
        }

        public static async Task<List<TlTrack>> Request(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Add.Method, new Args()
            {
                Uris = uris
            });

            var resultObject = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<TlTrack>>();

            return result;
        }
    }
}
