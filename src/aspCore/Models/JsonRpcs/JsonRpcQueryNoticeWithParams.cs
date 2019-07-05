using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcQueryNoticeWithParams : JsonRpcQueryNotice
    {
        [JsonProperty("params")]
        public object Params;

        public JsonRpcQueryNoticeWithParams(string method, object @params) : base(method)
        {
            this.Params = @params;
        }
    }
}
