using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;

namespace MusicFront.Models.Mopidies.Methods.Libraries
{
    public static class Search
    {
        private const string Method = "core.library.search";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("uri")]
            public string Uri;
        }

        public static JsonRpcQuery CreateRequest(string uri)
            => JsonRpcFactory.CreateRequest(Search.Method, new Args() { Uri = uri });
    }
}
