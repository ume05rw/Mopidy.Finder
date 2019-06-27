using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject]
    public class JsonRpcQueryNotice : JsonRpcQuery
    {
        [JsonProperty("method")]
        public string method;

        public JsonRpcQueryNotice(string method) : base()
        {
            this.method = method;
        }
    }
}
