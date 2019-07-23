using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Tracks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.AlbumTracks
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class AlbumTracks : IEntity
    {
        [JsonProperty("Album")]
        public Album Album { get; set; }

        [JsonProperty("Artists")]
        public List<Artist> Artists { get; set; }

        [JsonProperty("Tracks")]
        public List<Track> Tracks { get; set; }
    }
}
