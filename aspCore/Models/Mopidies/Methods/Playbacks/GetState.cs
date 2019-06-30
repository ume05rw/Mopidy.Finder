using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class GetState
    {
        private const string Method = "core.playback.get_state";

        public static async Task<string> Request()
        {
            var notice = JsonRpcFactory.CreateNotice(GetState.Method);

            var resultObject = await Query.Exec(notice);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(resultObject).ToObject<string>();

            return result;
        }
    }
}
