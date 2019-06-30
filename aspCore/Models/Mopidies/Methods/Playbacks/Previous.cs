using MusicFront.Models.JsonRpcs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class Previous
    {
        private const string Method = "core.playback.previous";

        public static async Task<bool> Request()
        {
            var notice = JsonRpcFactory.CreateNotice(Previous.Method);

            var resultObject = await Query.Exec(notice);

            return true;
        }
    }
}
