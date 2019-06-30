using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class Seek
    {
        private const string Method = "core.playback.seek";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("time_position")]
            public int TimePosition;
        }

        public static async Task<bool> Request(int timePosition)
        {
            var notice = JsonRpcFactory.CreateNotice(Seek.Method, new Args() {
                TimePosition = timePosition
            });

            var resultObject = await Query.Exec(notice);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(resultObject).ToObject<bool>();

            return result;
        }
    }
}
