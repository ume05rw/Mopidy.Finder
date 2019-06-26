using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.JsonRpcs
{
    public class JsonRpcParamsQuery : JsonRpcBase
    {
        public int? id;
        public string method;
        public object @params;
    }
}
