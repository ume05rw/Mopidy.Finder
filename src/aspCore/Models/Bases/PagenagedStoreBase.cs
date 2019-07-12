using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Bases
{
    public class PagenagedStoreBase<T> : StoreBase<T>
    {
        [JsonObject(MemberSerialization.OptIn)]
        public class PagenatedResult
        {
            [JsonProperty("TotalLength")]
            public int TotalLength { get; set; }

            [JsonProperty("ResultPage")]
            public int? ResultPage { get; set; }

            [JsonProperty("ResultLength")]
            public int ResultLength { get; set; }

            [JsonProperty("ResultList")]
            public T[] ResultList { get; set; }
        }

        protected int PageLength = 100;

        protected PagenagedStoreBase(Dbc dbc) : base(dbc)
        {
        }
    }
}
