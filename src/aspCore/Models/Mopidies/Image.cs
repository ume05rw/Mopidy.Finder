using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Mopidies
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Image
    /// </remarks>
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Image
    {
        [JsonProperty("uri")]
        public string Uri { get; set; }

        [JsonProperty("width")]
        public int Width { get; set; }

        [JsonProperty("height")]
        public int Height { get; set; }
    }
}
