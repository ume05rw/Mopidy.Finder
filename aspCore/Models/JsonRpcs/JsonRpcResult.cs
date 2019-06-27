using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject]
    public abstract class JsonRpcResult : JsonRpcBase
    {
        [JsonProperty("id")]
        public int id;

        protected JsonRpcResult(int id)
        {
            this.id = id;
        }
    }
}
