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
