using MopidyFinder.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Mopidies.Methods
{
    public static class Playback
    {
        private const string MethodGetCurrentTlTrack = "core.playback.get_current_tl_track";
        private const string MethodGetState = "core.playback.get_state";
        private const string MethodGetTimePosition = "core.playback.get_time_position";
        private const string MethodPlay = "core.playback.play";
        private const string MethodResume = "core.playback.resume";
        private const string MethodPause = "core.playback.pause";
        private const string MethodStop = "core.playback.stop";
        private const string MethodPrevious = "core.playback.previous";
        private const string MethodNext = "core.playback.next";
        private const string MethodSeek = "core.playback.seek";

        [JsonObject(MemberSerialization.OptIn)]
        private class ArgsTlId
        {
            [JsonProperty("tlid")]
            public int TlId;
        }

        [JsonObject(MemberSerialization.OptIn)]
        private class ArgsTimePosition
        {
            [JsonProperty("time_position")]
            public int TimePosition;
        }

        public static async Task<TlTrack> GetCurrentTlTrack()
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodGetCurrentTlTrack);

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            return (response.Result == null)
                ? null
                : JObject.FromObject(response.Result).ToObject<TlTrack>();
        }

        public static async Task<string> GetState()
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodGetState);

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(response.Result).ToObject<string>();

            return result;
        }

        public static async Task<bool> Play(int tlId)
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodPlay, new ArgsTlId()
            {
                TlId = tlId
            });

            var response = await Query.Exec(notice);

            return true;
        }

        public static async Task<bool> Resume()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodResume);

            var response = await Query.Exec(notice);

            return true;
        }

        public static async Task<bool> Pause()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodPause);

            var response = await Query.Exec(notice);

            return true;
        }

        public static async Task<bool> Stop()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodStop);

            var response = await Query.Exec(notice);

            return true;
        }

        public static async Task<bool> Next()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodNext);

            var response = await Query.Exec(notice);

            return true;
        }

        public static async Task<bool> Previous()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodPrevious);

            var response = await Query.Exec(notice);

            return true;
        }

        public static async Task<int> GetTimePosition()
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodGetTimePosition);

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(response.Result).ToObject<int>();

            return result;
        }

        public static async Task<bool> Seek(int timePosition)
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodSeek, new ArgsTimePosition()
            {
                TimePosition = timePosition
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(response.Result).ToObject<bool>();

            return result;
        }
    }
}
