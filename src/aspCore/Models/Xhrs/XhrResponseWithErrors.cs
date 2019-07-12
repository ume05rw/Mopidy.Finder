using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Xhrs
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Error
    {
        [JsonProperty("Message")]
        public string Message { get; set; }

        [JsonProperty("Code")]
        public int Code { get; set; } = -1;

        [JsonProperty("FieldName")]
        public string FieldName { get; set; } = null;
    }

    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class XhrResponseWithErrors : XhrResponse
    {
        [JsonProperty("Errors")]
        public Error[] Errors { get; set; }

        public XhrResponseWithErrors(Error[] errors) : base(false)
        {
            this.Errors = errors;
        }
    }
}
