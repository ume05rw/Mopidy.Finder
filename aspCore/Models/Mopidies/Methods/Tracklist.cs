using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace MusicFront.Models.Mopidies.Methods
{
    public static class Tracklist
    {
        private const string MethodClear = "core.tracklist.clear";
        private const string MethodAdd = "core.tracklist.add";
        private const string MethodGetTlTracks = "core.tracklist.get_tl_tracks";

        [JsonObject(MemberSerialization.OptIn)]
        private class ArgsUris
        {
            [JsonProperty("uris")]
            public string[] Uris;
        }

        public static async Task<bool> Clear()
        {
            var request = JsonRpcFactory.CreateRequest(Tracklist.MethodClear);

            var response = await Query.Exec(request);

            return true;
        }

        public static async Task<List<TlTrack>> Add(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Tracklist.MethodAdd, new ArgsUris()
            {
                Uris = uris
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(response.Result).ToObject<List<TlTrack>>();

            return result;
        }

        public static async Task<List<TlTrack>> GetTlTracks()
        {
            var request = JsonRpcFactory.CreateRequest(Tracklist.MethodGetTlTracks);

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(response.Result).ToObject<List<TlTrack>>();

            return result;
        }
    }
}
