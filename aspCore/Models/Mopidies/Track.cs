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
    /// https://docs.mopidy.com/en/latest/api/models/#mopidy.models.Track
    /// </remarks>
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Track
    {
        [JsonProperty("uri")]
        public string Uri { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("artists")]
        public List<Artist> Artists { get; set; }

        [JsonProperty("album")]
        public Album Album { get; set; }

        [JsonProperty("composers")]
        public List<Artist> Composers { get; set; }

        [JsonProperty("performers")]
        public List<Artist> Performers { get; set; }

        [JsonProperty("genre")]
        public string Genre { get; set; }

        [JsonProperty("track_no")]
        public int? TrackNo { get; set; }

        [JsonProperty("disc_no")]
        public int? DiscNo { get; set; }

        [JsonProperty("date")]
        public string Date { get; set; }

        [JsonProperty("length")]
        public int? Length { get; set; }

        [JsonProperty("bitrate")]
        public int BitRate { get; set; }

        [JsonProperty("comment")]
        public string Comment { get; set; }

        [JsonProperty("musicbrainz_id")]
        public string MusicbrainzId { get; set; }

        [JsonProperty("last_modified")]
        public int? LastModified { get; set; }
    }
}
