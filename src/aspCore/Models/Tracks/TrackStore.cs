using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Genres;
using MopidyFinder.Models.Mopidies;
using MopidyFinder.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Tracks
{
    public class TrackStore : StoreBase<Track>
    {
        private Tracklist _tracklist;
        private Playback _playback;

        public TrackStore(
            [FromServices] Dbc dbc,
            [FromServices] Tracklist tracklist,
            [FromServices] Playback playback
        ) : base(dbc)
        {
            this._tracklist = tracklist;
            this._playback = playback;
        }

        private Track Create(Mopidies.Track mopidyTrack)
        {
            var track = new Track()
            {
                Name = mopidyTrack.Name,
                LowerName = mopidyTrack.Name?.ToLower(),
                Uri = mopidyTrack.Uri,
                TrackNo = mopidyTrack.TrackNo,
                DiscNo = mopidyTrack.DiscNo,
                Length = mopidyTrack.Length,
                Date = mopidyTrack.Date,
                Comment = mopidyTrack.Comment,
                BitRate = mopidyTrack.BitRate,
                LastModified = mopidyTrack.LastModified
            };

            return track;
        }

        public Track CreateTrack(Mopidies.Track mopidyTrack)
            => this.Create(mopidyTrack);

        private Track Create(TlTrack mopidyTlTrack)
        {
            var result = this.Create(mopidyTlTrack.Track);
            result.TlId = mopidyTlTrack.TlId;

            return result;
        }

        public Track CreateTrack(TlTrack mopidyTlTrack)
            => this.Create(mopidyTlTrack);

        public Task<bool> ClearList()
            => this._tracklist.Clear();

        public async Task<List<Track>> SetListByUris(string[] uris)
        {
            var tlTracks = await this._tracklist.Add(uris);
            var result = tlTracks
                .Select(mtt => this.Create(mtt))
                .ToList();

            return result;
        }

        public async Task<List<Track>> GetList()
        {
            var tlTracks = await this._tracklist.GetTlTracks();
            var result = tlTracks
                .Select(mtt => this.Create(mtt))
                .ToList();

            return result;
        }

        public async Task<Track> GetCurrentTrack()
        {
            var tlTrack = await this._playback.GetCurrentTlTrack();
            return (tlTrack == null)
                ? null
                : this.Create(tlTrack);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this._playback = null;
                this._tracklist = null;
            }

            base.Dispose(disposing);
        }
    }
}
