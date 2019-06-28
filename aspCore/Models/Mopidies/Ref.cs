using System.Linq;

namespace MusicFront.Models.Mopidies
{
    public class Ref
    {
        public const string TypeAlbum = "album";
        public const string TypeDirectory = "directory";
        public const string TypeArtist = "artist";
        public const string TypeTrack = "track";

        public string type;
        public string name;
        public string uri;

        public string GetAlbumUri()
        {
            if (this.type == Ref.TypeAlbum)
                return this.uri;

            if (this.type == Ref.TypeDirectory)
            {
                var uriParams = this.uri.Split('?');
                if (uriParams.Length <= 0)
                    return null;

                var albumParams = uriParams[1].Split('&')
                    .Where(e => e.StartsWith("album=")).FirstOrDefault();

                return (albumParams != null)
                    ? albumParams.Split('=')[1]
                    : null;
            }

            return null;
        }
    }
}
