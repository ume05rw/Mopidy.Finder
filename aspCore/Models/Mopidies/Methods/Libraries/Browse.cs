using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;

namespace MusicFront.Models.Mopidies.Methods.Libraries
{
    public static class Browse
    {
        private const string Method = "core.library.browse";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("uri")]
            public string Uri;
        }

        public static JsonRpcQuery CreateRequest(string uri)
            => JsonRpcFactory.CreateRequest(Browse.Method, new Args() { Uri = uri });
    }
}
