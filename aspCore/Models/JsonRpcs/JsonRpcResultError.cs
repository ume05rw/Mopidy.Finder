using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject]
    public class JsonRpcResultError : JsonRpcResult
    {
        [JsonProperty("error")]
        public object error;

        public JsonRpcResultError(int id, object error) : base(id)
        {
            this.error = error;
        }
    }
}
