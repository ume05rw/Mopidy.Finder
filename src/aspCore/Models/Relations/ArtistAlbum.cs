using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Bases;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.Relations
{
    [Table("artist_albums")]
    [JsonObject(MemberSerialization.OptIn)]
    public class ArtistAlbum : IEntity
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
