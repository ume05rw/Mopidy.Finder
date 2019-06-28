using MusicFront.Models.Relations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Genres
{
    [Table("genres")]
    public class Genre
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Uri { get; set; }

        public List<GenreArtist> GenreArtists { get; set; }

        public List<GenreAlbum> GenreAlbums { get; set; }
    }
}
