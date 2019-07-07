using MusicFront.Models.Artists;
using MusicFront.Models.Tracks;
using MusicFront.Models.Albums;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.AlbumTracks
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
