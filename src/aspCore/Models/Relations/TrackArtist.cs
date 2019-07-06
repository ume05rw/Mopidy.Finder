using MusicFront.Models.Artists;
using MusicFront.Models.Tracks;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("track_artists")]
    [JsonObject(MemberSerialization.OptIn)]
    public class TrackArtist
    {
        [Required]
        [JsonProperty]
        public int TrackId { get; set; }

        [Required]
        [JsonProperty]
        public int ArtistId { get; set; }

        [ForeignKey("TrackId")]
        public Track Track { get; set; }

        [ForeignKey("ArtistId")]
        public Artist Artist { get; set; }
    }
}
