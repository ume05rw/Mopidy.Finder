using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Artist
    /// </remarks>
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Artist
    {
        [JsonProperty("uri")]
        public string Uri { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("sortname")]
        public string SortName { get; set; }

        [JsonProperty("musicbrainz_id")]
        public string MusicbrainzId { get; set; }
    }
}
