using Newtonsoft.Json;

namespace MopidyFinder.Models.JsonRpcs
{
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcParamsQuery : JsonRpcBase
    {
        [JsonProperty("id")]
        public int? Id;

        [JsonProperty("method")]
        public string Method;

        [JsonProperty("params")]
        public object Params;
    }
}
