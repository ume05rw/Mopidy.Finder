using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("artist_albums")]
    [JsonObject(MemberSerialization.OptIn)]
    public class ArtistAlbum
    {
        [Required]
        [JsonProperty]
        public int ArtistId { get; set; }

        [Required]
        [JsonProperty]
        public int AlbumId { get; set; }

        [ForeignKey("ArtistId")]
        public Artist Artist { get; set; }

        [ForeignKey("AlbumId")]
        public Album Album { get; set; }
    }
}
