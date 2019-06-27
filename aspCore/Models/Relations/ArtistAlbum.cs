using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
