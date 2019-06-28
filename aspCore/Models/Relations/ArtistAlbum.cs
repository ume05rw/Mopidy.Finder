using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Relations
{
    [Table("artist_albums")]
    public class ArtistAlbum
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ArtistId { get; set; }

        [Required]
        public int AlbumId { get; set; }

        [ForeignKey("ArtistId")]
        public Artist Artist { get; set; }

        [ForeignKey("AlbumId")]
        public Album Album { get; set; }
    }
}
