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
