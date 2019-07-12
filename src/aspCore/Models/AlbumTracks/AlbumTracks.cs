using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Tracks;
using MopidyFinder.Models.Albums;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MopidyFinder.Models.AlbumTracks
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class AlbumTracks
    {
        [JsonProperty("Album")]
        public Album Album { get; set; }

        [JsonProperty("Artists")]
        public List<Artist> Artists { get; set; }

        [JsonProperty("Tracks")]
        public List<Track> Tracks { get; set; }
    }
}
