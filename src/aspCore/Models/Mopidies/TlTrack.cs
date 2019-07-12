using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Mopidies
{
    /// <summary>
    /// 
    /// </summary>
    /// <remarks>
    /// https://docs.mopidy.com/en/latest/api/models/#mopidy.models.TlTrack
    /// </remarks>
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class TlTrack
    {
        [JsonProperty("tlid")]
        public int TlId { get; set; }

        [JsonProperty("track")]
        public Track Track { get; set; }
    }
}
