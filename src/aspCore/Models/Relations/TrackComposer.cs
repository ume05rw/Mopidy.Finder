using MusicFront.Models.Artists;
using MusicFront.Models.Tracks;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("track_composers")]
    [JsonObject(MemberSerialization.OptIn)]
    public class TrackComposer
    {
        [Required]
        [JsonProperty]
        public int TrackId { get; set; }

        [Required]
        [JsonProperty]
        public int ComposerId { get; set; }

        [ForeignKey("TrackId")]
        public Track Track { get; set; }

        [ForeignKey("ComposerId")]
        public Artist Composer { get; set; }
    }
}
