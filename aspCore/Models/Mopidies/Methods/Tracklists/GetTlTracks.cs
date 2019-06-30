using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Tracklists
{
    public static class GetTlTracks
    {
        private const string Method = "core.tracklist.get_tl_tracks";

        public static async Task<List<TlTrack>> Request(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(GetTlTracks.Method);

            var resultObject = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<TlTrack>>();

            return result;
        }
    }
}
