using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Genres;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.Relations
{
    [Table("genre_albums")]
    [JsonObject(MemberSerialization.OptIn)]
    public class GenreAlbum : IEntity
    {
        [Required]
        [JsonProperty]
        public int GenreId { get; set; }

        [Required]
        [JsonProperty]
        public int AlbumId { get; set; }

        [ForeignKey("GenreId")]
        public Genre Genre { get; set; }

        [ForeignKey("AlbumId")]
        public Album Album { get; set; }
    }
}
