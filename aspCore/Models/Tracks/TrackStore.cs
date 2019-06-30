using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods.Libraries;
using MusicFront.Models.Mopidies.Methods.Tracklists;
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

        private Track Create(Mopidies.TlTrack mopidyTlTrack)
        {
            var result = this.Create(mopidyTlTrack.Track);
            result.TlId = mopidyTlTrack.TlId;

            return result;
        }

        public async Task<List<Track>> GetTracksByAlbum(Albums.Album album)
        {
            var refs = await Browse.Request(album.Uri);
            var trackUris = refs
                .Where(e => e.Type == Ref.TypeTrack)
                .Select(e => e.Uri)
                .ToArray();

            var mopidyTracks = await Lookup.Request(trackUris);

            var result = mopidyTracks
                .Select(mt => this.Create(mt))
                .ToList();

            return result;
        }

        public async Task<bool> ClearTracks()
            => await Clear.Request();

        public async Task<List<Track>> SetTracks(List<string> uris)
        {
            var tlTracks = await Add.Request(uris.ToArray());
            var result = tlTracks
                .Select(mtt => this.Create(mtt))
                .ToList();

            return result;
        }
    }
}
