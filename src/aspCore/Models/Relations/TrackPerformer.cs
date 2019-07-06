using MusicFront.Models.Artists;
using MusicFront.Models.Tracks;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("track_performers")]
    [JsonObject(MemberSerialization.OptIn)]
    public class TrackPerformer
    {
        [Required]
        [JsonProperty]
        public int TrackId { get; set; }

        [Required]
        [JsonProperty]
        public int PerformerId { get; set; }

        [ForeignKey("TrackId")]
        public Track Track { get; set; }

        [ForeignKey("PerformerId")]
        public Artist Performer { get; set; }
    }
}
