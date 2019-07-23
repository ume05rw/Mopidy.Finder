using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Relations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.Albums
{
    [Table("albums")]
    [JsonObject(MemberSerialization.OptIn)]
    public class Album: IEntity
    {
        [Key]
        [JsonProperty("Id")]
        public int Id { get; set; }

        [Required]
        [JsonProperty("Name")]
        public string Name { get; set; }

        [Required]
        [JsonProperty("LowerName")]
        public string LowerName { get; set; }

        [Required]
        [JsonProperty("Uri")]
        public string Uri { get; set; }

        [JsonProperty("Year")]
        public int? Year { get; set; }

        [JsonProperty("ImageUri")]
        public string ImageUri { get; set; }

        [JsonProperty("ArtistAlbums")]
        public List<ArtistAlbum> ArtistAlbums { get; set; }

        [JsonProperty("GenreAlbums")]
        public List<GenreAlbum> GenreAlbums { get; set; }
    }
}
