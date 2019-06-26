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
    public class JsonRpcQueryNoticeWithParams : JsonRpcQueryNotice
    {
        [JsonProperty("params")]
        public object @params;

        public JsonRpcQueryNoticeWithParams(string method, object @params) : base(method)
        {
            this.@params = @params;
        }
    }
}
