using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods.Playbacks
{
    public static class Play
    {
        private const string Method = "core.playback.play";

        [JsonObject(MemberSerialization.OptIn)]
        private class Args
        {
            [JsonProperty("tlid")]
            public int TlId;
        }

        public static async Task<bool> Request(int tlId)
        {
            var notice = JsonRpcFactory.CreateNotice(Play.Method, new Args()
            {
                TlId = tlId
            });

            var resultObject = await Query.Exec(notice);

            return true;
        }
    }
}
