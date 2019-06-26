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
    public abstract class JsonRpcBase
    {
        [JsonProperty("jsonrpc")]
        public string jsonrpc = "2.0";
    }
}
