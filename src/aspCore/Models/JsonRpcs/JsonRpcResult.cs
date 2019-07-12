using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.JsonRpcs
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
