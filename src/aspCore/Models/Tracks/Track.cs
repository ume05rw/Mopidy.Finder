using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Bases;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.Tracks
{
    [Table("tracks")]
    [JsonObject(MemberSerialization.OptIn)]
    public class Track : IEntity
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

        [Required]
        public int AlbumId { get; set; }

        [NotMapped]
        [JsonProperty("TlId")]
        public int? TlId { get; set; }

        [JsonProperty("DiscNo")]
        public int? DiscNo { get; set; }

        [JsonProperty("TrackNo")]
        public int? TrackNo { get; set; }

        [JsonProperty("Date")]
        public string Date { get; set; }

        [JsonProperty("Comment")]
        public string Comment { get; set; }

        [JsonProperty("Length")]
        public int? Length { get; set; }

        [JsonProperty("BitRate")]
        public int BitRate { get; set; }

        [JsonProperty("LastModified")]
        public long? LastModified { get; set; }

        [ForeignKey("AlbumId")]
        public Album Album { get; set; }
    }
}
