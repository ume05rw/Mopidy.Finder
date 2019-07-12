using MopidyFinder.Models.JsonRpcs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Mopidies.Methods
{
    public static class Library
    {
        private const string MethodBrowse = "core.library.browse";
        private const string MethodSearch = "core.library.search";
        private const string MethodLookup = "core.library.lookup";
        private const string MethodGetImages = "core.library.get_images";

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

        public static async Task<Dictionary<string, List<Track>>> Lookup(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Library.MethodLookup, new ArgsUris()
            {
                Uris = uris
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JObject.FromObject(response.Result).ToObject<Dictionary<string, List<Track>>>();

            return result;
        }

        public static async Task<Image> GetImage(string albumUri)
        {
            var request = JsonRpcFactory.CreateRequest(Library.MethodGetImages, new ArgsUris()
            {
                Uris = new string[] { albumUri }
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var images = JObject.FromObject(response.Result).ToObject<Dictionary<string, List<Image>>>();

            if (images.Count() <= 0 || images.First().Value.Count() <= 0)
                return null;

            return images.First().Value.First();
        }

        public static async Task<Dictionary<string, Image>> GetImages(string[] uris)
        {
            var request = JsonRpcFactory.CreateRequest(Library.MethodGetImages, new ArgsUris()
            {
                Uris = uris
            });

            var response = await Query.Exec(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var imageDictionary = JObject.FromObject(response.Result).ToObject<Dictionary<string, List<Image>>>();

            var result = new Dictionary<string, Image>();
            if (imageDictionary == null)
                return result;

            foreach (var pair in imageDictionary)
            {
                if (pair.Value == null || pair.Value.Count() <= 0)
                    continue;
                result.Add(pair.Key, pair.Value.First());
            }

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
