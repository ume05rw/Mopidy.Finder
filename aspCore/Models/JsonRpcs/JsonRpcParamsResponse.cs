using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.JsonRpcs
{
    public class JsonRpcParamsResponse : JsonRpcBase
    {
        public int? id;
        public object result;
        public object error;
    }
}
