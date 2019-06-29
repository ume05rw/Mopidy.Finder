using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcResultSucceeded : JsonRpcResult
    {
        [JsonProperty("result")]
        public object Result;

        public JsonRpcResultSucceeded(int id, object result) : base(id)
        {
            this.Result = result;
        }
    }
}
