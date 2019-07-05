using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Tracks
{
    public class TrackStore : StoreBase<Track>
    {
        public TrackStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        private Track Create(Mopidies.Track mopidyTrack)
        {
            return new Track()
            {
                Name = mopidyTrack.Name,
                Uri = mopidyTrack.Uri,
                TrackNo = mopidyTrack.TrackNo,
                DiscNo = mopidyTrack.DiscNo,
                Length = mopidyTrack.Length,
                Date = mopidyTrack.Date,
                Comment = mopidyTrack.Comment,
                BitRate = mopidyTrack.BitRate,
                LastModified = mopidyTrack.LastModified,
                Album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == mopidyTrack.Album.Uri),
                Genre = this.Dbc.Genres.FirstOrDefault(e => e.Name == mopidyTrack.Genre),
                Artists = (mopidyTrack.Artists == null)
                        ? new List<Artists.Artist>()
                        : mopidyTrack.Artists
                            .Join(
                                this.Dbc.Artists,
                                ma => ma.Uri,
                                at => at.Uri,
                                (ma, at) => at
                            )
                            .ToList(),
                Composers = (mopidyTrack.Composers == null)
                        ? new List<Artists.Artist>()
                        : mopidyTrack.Composers
                            .Join(
                                this.Dbc.Artists,
                                ma => ma.Uri,
                                at => at.Uri,
                                (ma, at) => at
                            )
                            .ToList(),
                Performers = (mopidyTrack.Performers == null)
                        ? new List<Artists.Artist>()
                        : mopidyTrack.Performers
                            .Join(
                                this.Dbc.Artists,
                                ma => ma.Uri,
                                at => at.Uri,
                                (ma, at) => at
                            )
                            .ToList()
            };
        }

        private Track Create(TlTrack mopidyTlTrack)
        {
            var result = this.Create(mopidyTlTrack.Track);
            result.TlId = mopidyTlTrack.TlId;

            return result;
        }

        public async Task<List<Track>> GetTracksByAlbum(Albums.Album album)
        {
            var refs = await Library.Browse(album.Uri);
            var trackUris = refs
                .Where(e => e.Type == Ref.TypeTrack)
                .Select(e => e.Uri)
                .ToArray();

            if (trackUris.Length <= 0)
                return new List<Track>();

            var mopidyTracks = await Library.Lookup(trackUris);

            if (mopidyTracks == null || mopidyTracks.Count() <= 0)
                return new List<Track>();

            var result = mopidyTracks
                .Select(mt => this.Create(mt))
                .OrderBy(e => e.TrackNo)
                .ToList();

            return result;
        }

        public Task<bool> ClearList()
            => Tracklist.Clear();

        public async Task<List<Track>> SetListByUris(string[] uris)
        {
            var tlTracks = await Tracklist.Add(uris);
            var result = tlTracks
                .Select(mtt => this.Create(mtt))
                .ToList();

            return result;
        }

        public async Task<List<Track>> GetList()
        {
            var tlTracks = await Tracklist.GetTlTracks();
            var result = tlTracks
                .Select(mtt => this.Create(mtt))
                .ToList();

            return result;
        }

        public async Task<Track> GetCurrentTrack()
        {
            var tlTrack = await Playback.GetCurrentTlTrack();
            return (tlTrack == null)
                ? null
                : this.Create(tlTrack);
        }

        //public Task<bool> Play(int? tlId = null)
        //    => (tlId != null)
        //        ? Playback.Play((int)tlId)
        //        : Playback.Resume();

        //public Task<bool> Pause()
        //    => Playback.Pause();

        //public Task<bool> Next()
        //    => Playback.Next();

        //public Task<bool> Previous()
        //    => Playback.Previous();
    }
}
