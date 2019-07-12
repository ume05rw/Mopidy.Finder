using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Genres;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.Relations
{
    [Table("genre_artists")]
    [JsonObject(MemberSerialization.OptIn)]
    public class GenreArtist
    {
        [Required]
        [JsonProperty]
        public int GenreId { get; set; }

        [Required]
        [JsonProperty]
        public int ArtistId { get; set; }

        [ForeignKey("GenreId")]
        public Genre Genre { get; set; }

        [ForeignKey("ArtistId")]
        public Artist Artist { get; set; }
    }
}
