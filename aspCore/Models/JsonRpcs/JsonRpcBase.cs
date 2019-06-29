using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class JsonRpcBase
    {
        [JsonProperty("jsonrpc")]
        public string JsonRpc = "2.0";
    }
}
