using MusicFront.Models.JsonRpcs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class Pause
    {
        private const string Method = "core.playback.pause";

        public static async Task<bool> Request()
        {
            var notice = JsonRpcFactory.CreateNotice(Pause.Method);

            var resultObject = await Query.Exec(notice);

            return true;
        }
    }
}
