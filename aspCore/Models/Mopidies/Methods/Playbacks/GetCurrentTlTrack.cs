using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class GetCurrentTlTrack
    {
        private const string Method = "core.playback.get_current_tl_track";

        public static async Task<TlTrack> Request()
        {
            var notice = JsonRpcFactory.CreateNotice(GetCurrentTlTrack.Method);

            var resultObject = await Query.Exec(notice);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JObject.FromObject(resultObject).ToObject<TlTrack>();

            return result;
        }
    }
}
