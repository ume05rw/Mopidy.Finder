using MusicFront.Models.JsonRpcs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Libraries
{
    public static class Browse
    {
        private const string Method = "core.library.browse";

        private class Args
        {
            public string uri;
        }

        public static JsonRpcQuery CreateRequest(string uri)
            => JsonRpcFactory.CreateRequest(Browse.Method, new Args() { uri = uri });
    }
}
