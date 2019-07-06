using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Albums;
using MusicFront.Models.Bases;
using MusicFront.Models.Tracks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.AlbumTracks
{
    public class AlbumTracksStore : StoreBase<AlbumTracks>
    {
        public AlbumTracksStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<List<AlbumTracks>> GetList(int[] albumIds)
        {
            var result = new List<AlbumTracks>();

            foreach (var albumId in albumIds)
            {
                var album = this.Dbc.GetAlbumQuery()
                    .FirstOrDefault(e => e.Id == albumId);

                if (album == null)
                    continue;

                var artistId = album.ArtistAlbums.FirstOrDefault()?.ArtistId;

                var artist = (artistId != null)
                    ? this.Dbc.GetArtistQuery().FirstOrDefault(e => e.Id == artistId)
                    : null;

                var tracks = default(List<Track>);
                using (var trackStore = new TrackStore(this.Dbc))
                    tracks = await trackStore.GetTracksByAlbum(album);

                if (album.Year == null || string.IsNullOrEmpty(album.ImageUri))
                {
                    var albumStore = new AlbumStore(this.Dbc);
                    await albumStore.CoverInfo(album, tracks);
                }

                result.Add(new AlbumTracks()
                {
                    Album = album,
                    Artist = artist,
                    Tracks = tracks
                });
            }

            return result;
        }
    }
}
