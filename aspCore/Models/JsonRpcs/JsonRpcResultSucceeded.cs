using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject]
    public class JsonRpcResultSucceeded : JsonRpcResult
    {
        [JsonProperty("result")]
        public object result;

        public JsonRpcResultSucceeded(int id, object result) : base(id)
        {
            this.result = result;
        }
    }
}
