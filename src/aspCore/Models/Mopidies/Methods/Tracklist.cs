using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Mopidies.Methods
{
    public class Tracklist
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

        private readonly Query _query;

        public Tracklist([FromServices] Query query)
        {
            this._query = query;
        }

        public async Task<bool> Clear()
        {
            var request = JsonRpcFactory.CreateRequest(Tracklist.MethodClear);

            var response = await this._query.Exec(request);

            return true;
        }

        public async Task<List<TlTrack>> Add(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Tracklist.MethodAdd, new ArgsUris()
            {
                Uris = uris
            });

            var response = await this._query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(response.Result).ToObject<List<TlTrack>>();

            return result;
        }

        public async Task<List<TlTrack>> GetTlTracks()
        {
            var request = JsonRpcFactory.CreateRequest(Tracklist.MethodGetTlTracks);

            var response = await this._query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(response.Result).ToObject<List<TlTrack>>();

            return result;
        }
    }
}
