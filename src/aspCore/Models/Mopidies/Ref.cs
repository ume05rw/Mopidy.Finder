using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace MopidyFinder.Models.Mopidies
{
    [NotMapped]
    [JsonObject(MemberSerialization.OptIn)]
    public class Ref
    {
        public const string TypeAlbum = "album";
        public const string TypeDirectory = "directory";
        public const string TypeArtist = "artist";
        public const string TypeTrack = "track";

        [JsonProperty("type")]
        public string Type;

        [JsonProperty("name")]
        public string Name;

        [JsonProperty("uri")]
        public string Uri;

        public string GetAlbumUri()
        {
            if (this.Type == Ref.TypeAlbum)
                return this.Uri;

            if (this.Type == Ref.TypeDirectory)
            {
                var uriParams = this.Uri.Split('?');
                if (uriParams.Length <= 0)
                    return null;

                var albumParams = uriParams[1].Split('&')
                    .Where(e => e.StartsWith("album=")).FirstOrDefault();

                // アルバムが存在しない場合はnull-return
                return albumParams?.Split('=')[1];
            }

            return null;
        }
    }
}
