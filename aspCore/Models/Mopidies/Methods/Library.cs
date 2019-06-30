using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods
{
    public static class Library
    {
        private const string MethodBrowse = "core.library.browse";
        private const string MethodSearch = "core.library.search";
        private const string MethodLookup = "core.library.lookup";

        [JsonObject(MemberSerialization.OptIn)]
        private class ArgsUri
        {
            [JsonProperty("uri")]
            public string Uri;
        }

        [JsonObject(MemberSerialization.OptIn)]
        private class ArgsUris
        {
            [JsonProperty("uris")]
            public string[] Uris;
        }

        public static async Task<List<Ref>> Browse(string uri)
        {
            var request = JsonRpcFactory.CreateRequest(Library.MethodBrowse, new ArgsUri()
            {
                Uri = uri
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(response.Result).ToObject<List<Ref>>();

            return result;
        }

        public static async Task<List<Track>> Lookup(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Library.MethodLookup, new ArgsUris()
            {
                Uris = uris
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var dic = JObject.FromObject(response.Result).ToObject<Dictionary<string, List<Track>>>();
            var result = new List<Track>();
            foreach (var pair in dic)
                result.AddRange(pair.Value);

            return result;
        }

        // 検索機能はAsp側で保持する。
        //public static async Task<List<Ref>> Search(string uri)
        //{
        //    var request = JsonRpcFactory.CreateRequest(Library.MethodSearch, new ArgsUri()
        //    {
        //        Uri = uri
        //    });
        //    var response = await Query.Exec(request);
        //    // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
        //    // 型が違うとパースエラーになる。
        //    var result = JArray.FromObject(response.Result).ToObject<List<SearchResult>>();
        //    return result;
        //}
    }
}
