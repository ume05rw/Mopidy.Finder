using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Relations;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.Artists
{
    [Table("artists")]
    [JsonObject(MemberSerialization.OptIn)]
    public class Artist : IEntity
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

        [JsonProperty("ImageUri")]
        public string ImageUri { get; set; }

        [JsonProperty("ArtistAlbums")]
        public List<ArtistAlbum> ArtistAlbums { get; set; }

        [JsonProperty("GenreArtists")]
        public List<GenreArtist> GenreArtists { get; set; }
    }
}
