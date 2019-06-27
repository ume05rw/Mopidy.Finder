using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

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
