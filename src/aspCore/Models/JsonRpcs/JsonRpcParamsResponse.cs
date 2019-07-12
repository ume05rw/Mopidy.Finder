using Newtonsoft.Json;

namespace MopidyFinder.Models.JsonRpcs
{
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcParamsResponse : JsonRpcBase
    {
        [JsonProperty("id")]
        public int? Id;

        [JsonProperty("result")]
        public object Result;

        [JsonProperty("error")]
        public object Error;
    }
}
