using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public abstract class JsonRpcResult : JsonRpcBase
    {
        [JsonProperty("id")]
        public int Id;

        protected JsonRpcResult(int id)
        {
            this.Id = id;
        }
    }
}
