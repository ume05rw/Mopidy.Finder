using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Mopidies.Methods
{
    public class Playback
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

        private readonly Query _query;

        public Playback([FromServices] Query query)
        {
            this._query = query;
        }

        public async Task<TlTrack> GetCurrentTlTrack()
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodGetCurrentTlTrack);

            var response = await this._query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            return (response.Result == null)
                ? null
                : JObject.FromObject(response.Result).ToObject<TlTrack>();
        }

        public async Task<string> GetState()
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodGetState);

            var response = await this._query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(response.Result).ToObject<string>();

            return result;
        }

        public async Task<bool> Play(int tlId)
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodPlay, new ArgsTlId()
            {
                TlId = tlId
            });

            var response = await this._query.Exec(notice);

            return true;
        }

        public async Task<bool> Resume()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodResume);

            var response = await this._query.Exec(notice);

            return true;
        }

        public async Task<bool> Pause()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodPause);

            var response = await this._query.Exec(notice);

            return true;
        }

        public async Task<bool> Stop()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodStop);

            var response = await this._query.Exec(notice);

            return true;
        }

        public async Task<bool> Next()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodNext);

            var response = await this._query.Exec(notice);

            return true;
        }

        public async Task<bool> Previous()
        {
            var notice = JsonRpcFactory.CreateNotice(Playback.MethodPrevious);

            var response = await this._query.Exec(notice);

            return true;
        }

        public async Task<int> GetTimePosition()
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodGetTimePosition);

            var response = await this._query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(response.Result).ToObject<int>();

            return result;
        }

        public async Task<bool> Seek(int timePosition)
        {
            var request = JsonRpcFactory.CreateRequest(Playback.MethodSeek, new ArgsTimePosition()
            {
                TimePosition = timePosition
            });

            var response = await this._query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JValue.FromObject(response.Result).ToObject<bool>();

            return result;
        }
    }
}
