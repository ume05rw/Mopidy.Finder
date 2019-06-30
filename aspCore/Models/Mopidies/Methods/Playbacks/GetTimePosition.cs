using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class GetTimePosition
    {
        private const string Method = "core.playback.get_time_position";

        public static async Task<int> Request()
        {
            var notice = JsonRpcFactory.CreateNotice(GetTimePosition.Method);

            var resultObject = await Query.Exec(notice);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(resultObject).ToObject<int>();

            return result;
        }
    }
}
