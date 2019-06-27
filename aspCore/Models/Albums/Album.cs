using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.Albums
{
    [Table("albums")]
    public class Album
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Uri { get; set; }

        public int? Year { get; set; }

        public string ImageUri { get; set; }

    }
}
