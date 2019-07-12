using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcQueryRequestWithParams : JsonRpcQueryRequest
    {
        [JsonProperty("params")]
        public object Params;

        public JsonRpcQueryRequestWithParams(int id, string method, object @params) : base(id, method)
        {
            this.Params = @params;
        }
    }
}
