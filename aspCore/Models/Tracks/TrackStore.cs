using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods.Libraries;
using System;
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

        public async Task<List<Track>> GetTracksByAlbum(Album album)
        {
            var refs = await Browse.Request(album.Uri);
            var trackUris = refs
                .Where(e => e.Type == "track")
                .Select(e => e.Uri)
                .ToArray();

            var mopidyTracks = await Lookup.Request(trackUris);

            var result = mopidyTracks
                .Select(mt => new Track()
                {
                    Name = mt.Name,
                    Uri = mt.Uri,
                    TrackNo = mt.TrackNo,
                    DiscNo = mt.DiscNo,
                    Length = mt.Length,
                    Date = mt.Date,
                    Comment = mt.Comment,
                    BitRate = mt.BitRate,
                    LastModified = mt.LastModified,
                    Album = album,
                    Genre = this.Dbc.Genres.FirstOrDefault(e => e.Name == mt.Genre),
                    Artists = (mt.Artists == null)
                        ? new List<Artist>()
                        : mt.Artists
                            .Join(
                                this.Dbc.Artists,
                                ma => ma.Uri,
                                at => at.Uri,
                                (ma, at) => at
                            )
                            .ToList(),
                    

                    Composers = (mt.Composers == null)
                        ? new List<Artist>()
                        : mt.Composers
                            .Join(
                                this.Dbc.Artists,
                                ma => ma.Uri,
                                at => at.Uri,
                                (ma, at) => at
                            )
                            .ToList(),
                    Performers = (mt.Performers == null)
                        ? new List<Artist>()
                        : mt.Performers
                            .Join(
                                this.Dbc.Artists,
                                ma => ma.Uri,
                                at => at.Uri,
                                (ma, at) => at
                            )
                            .ToList()
                })
                .ToList();

            return result;
        }
    }
}
