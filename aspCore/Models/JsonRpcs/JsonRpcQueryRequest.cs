using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject]
    public class JsonRpcQueryRequest : JsonRpcQuery
    {
        private static int _idForService = 90001;

        [JsonProperty("id")]
        public int id;

        [JsonProperty("method")]
        public string method;

        public JsonRpcQueryRequest(int id, string method)
        {
            this.id = id;
            this.method = method;
        }
    }
}
