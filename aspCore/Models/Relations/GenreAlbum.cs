using MusicFront.Models.Albums;
using MusicFront.Models.Genres;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("genre_albums")]
    public class GenreAlbum
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GenreId { get; set; }

        [Required]
        public int AlbumId { get; set; }

        [ForeignKey("GenreId")]
        public Genre Genre { get; set; }

        [ForeignKey("AlbumId")]
        public Album Album { get; set; }
    }
}
