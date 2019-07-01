using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Xhrs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class XhrResponse
    {
        [JsonProperty("Succeeded")]
        public bool Succeeded { get; set; }

        public XhrResponse(bool succeeded)
        {
            this.Succeeded = succeeded;
        }
    }
}
