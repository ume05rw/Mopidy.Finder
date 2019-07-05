using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class JsonRpcResultError : JsonRpcResult
    {
        [JsonProperty("error")]
        public object Error;

        public JsonRpcResultError(int id, object error) : base(id)
        {
            this.Error = error;
        }
    }
}
