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
