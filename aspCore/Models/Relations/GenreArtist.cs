using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("genre_artists")]
    public class GenreArtist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GenreId { get; set; }

        [Required]
        public int ArtistId { get; set; }

        public Genre Genre { get; set; }
        public Artist Artist { get; set; }
    }
}
