using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidy
{
    public class MethodArgs
    {
        public string uri;

        public MethodArgs(string uri)
        {
            this.uri = uri;
        }
    }
}
