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
    /// https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Album
    /// </remarks>
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Album
    {
        [JsonProperty("uri")]
        public string Uri { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("artists")]
        public List<Artist> Artists { get; set; }

        [JsonProperty("Date")]
        public string Date { get; set; }

        [JsonProperty("images")]
        public List<string> Images { get; set; }

        [JsonProperty("num_tracks")]
        public int? NumTracks { get; set; }

        [JsonProperty("num_discs")]
        public int? NumDiscs { get; set; }

        [JsonProperty("musicbrainz_id")]
        public string MusicbrainzId { get; set; }
    }
}
