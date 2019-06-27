using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

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
