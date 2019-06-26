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
