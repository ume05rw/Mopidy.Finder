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
    public class JsonRpcQueryRequestWithParams : JsonRpcQueryRequest
    {
        [JsonProperty("params")]
        public object @params;

        public JsonRpcQueryRequestWithParams(int id, string method, object @params) : base(id, method)
        {
            this.@params = @params;
        }
    }
}
