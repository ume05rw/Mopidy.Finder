using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Relations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Tracks
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Track
    {
        [JsonProperty("Id")]
        public int Id { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("LowerName")]
        public string LowerName { get; set; }

        [JsonProperty("Uri")]
        public string Uri { get; set; }

        [JsonProperty("TlId")]
        public int? TlId { get; set; }

        [JsonProperty("DiscNo")]
        public int? DiscNo { get; set; }

        [JsonProperty("TrackNo")]
        public int? TrackNo { get; set; }

        [JsonProperty("Date")]
        public string Date { get; set; }

        [JsonProperty("Comment")]
        public string Comment { get; set; }

        [JsonProperty("Length")]
        public int? Length { get; set; }

        [JsonProperty("BitRate")]
        public int BitRate { get; set; }

        [JsonProperty("LastModified")]
        public long? LastModified { get; set; }
    }
}
