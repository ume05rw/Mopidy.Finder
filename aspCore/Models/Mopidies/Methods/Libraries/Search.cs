using MusicFront.Models.JsonRpcs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Libraries
{
    public static class Search
    {
        private const string Method = "core.library.search";

        private class Args
        {
            public string uri;
        }

        public static JsonRpcQuery CreateRequest(string uri)
            => JsonRpcFactory.CreateRequest(Search.Method, new Args() { uri = uri });
    }
}
