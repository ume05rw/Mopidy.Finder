using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcQueryRequest : JsonRpcQuery
    {
        private static int _idForService = 90001;

        [JsonProperty("id")]
        public int Id;

        [JsonProperty("method")]
        public string Method;

        public JsonRpcQueryRequest(int id, string method)
        {
            this.Id = id;
            this.Method = method;
        }
    }
}
