using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
