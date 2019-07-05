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
    public class XhrResponseWithResult : XhrResponse
    {
        [JsonProperty("Result")]
        public object Result { get; set; }

        public XhrResponseWithResult(object result) : base(true)
        {
            this.Result = result;
        }
    }
}
