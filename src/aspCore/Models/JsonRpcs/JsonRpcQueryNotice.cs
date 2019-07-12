using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcQueryNotice : JsonRpcQuery
    {
        [JsonProperty("method")]
        public string Method;

        public JsonRpcQueryNotice(string method) : base()
        {
            this.Method = method;
        }
    }
}
