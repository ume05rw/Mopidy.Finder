using MusicFront.Models.JsonRpcs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Tracklists
{
    public static class Clear
    {
        private const string Method = "core.tracklist.clear";

        public static async Task<bool> Request()
        {
            var request = JsonRpcFactory.CreateRequest(Clear.Method);

            var resultObject = await Query.Exec(request);

            return true;
        }
    }
}
