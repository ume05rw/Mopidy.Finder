using MusicFront.Models.Relations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Artists
{
    [Table("artists")]
    public class Artist
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Uri { get; set; }

        public string ImageUrl { get; set; }

        public List<ArtistAlbum> ArtistAlbums { get; set; }

        public List<GenreArtist> GenreArtists { get; set; }
    }
}
