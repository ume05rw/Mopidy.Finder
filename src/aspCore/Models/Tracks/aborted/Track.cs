//using MusicFront.Models.Albums;
//using MusicFront.Models.Artists;
//using MusicFront.Models.Genres;
//using MusicFront.Models.Relations;
//using Newtonsoft.Json;
//using System.Collections.Generic;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace MusicFront.Models.Tracks
//{
//    [Table("tracks")]
//    [JsonObject(MemberSerialization.OptIn)]
//    public class Track
//    {
//        [Key]
//        [JsonProperty("Id")]
//        public int Id { get; set; }

//        [Required]
//        [JsonProperty("Name")]
//        public string Name { get; set; }

//        [Required]
//        [JsonProperty("LowerName")]
//        public string LowerName { get; set; }

//        [Required]
//        [JsonProperty("Uri")]
//        public string Uri { get; set; }

//        [NotMapped]
//        [JsonProperty("TlId")]
//        public int? TlId { get; set; }

//        [JsonProperty("DiscNo")]
//        public int? DiscNo { get; set; }

//        [JsonProperty("TrackNo")]
//        public int? TrackNo { get; set; }

//        [JsonProperty("Date")]
//        public string Date { get; set; }

//        [JsonProperty("Comment")]
//        public string Comment { get; set; }

//        [JsonProperty("Length")]
//        public int? Length { get; set; }

//        [JsonProperty("BitRate")]
//        public int BitRate { get; set; }

//        [JsonProperty("LastModified")]
//        public long? LastModified { get; set; }

//        [JsonProperty("GenreId")]
//        public int? GenreId { get; set; }

//        [Required]
//        [JsonProperty("AlbumId")]
//        public int AlbumId { get; set; }

//        // JSONがアホほどでかくなるので、以下項目をJSONから除外。
//        public List<TrackArtist> TrackArtists { get; set; }

//        public List<TrackComposer> TrackComposers { get; set; }

//        public List<TrackPerformer> TrackPerformers { get; set; }

//        [ForeignKey("GenreId")]
//        public Genre Genre { get; set; }

//        [ForeignKey("AlbumId")]
//        public Album Album { get; set; }

//        [NotMapped]
//        public List<Artist> Artists { get; set; }

//        [NotMapped]
//        public List<Artist> Composers { get; set; }

//        [NotMapped]
//        public List<Artist> Performers { get; set; }
//    }
//}
