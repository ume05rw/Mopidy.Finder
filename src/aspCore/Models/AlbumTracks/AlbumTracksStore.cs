using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Albums;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
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
            using (var albumStore = new AlbumStore(this.Dbc))
            {
                var albums = this.Dbc.Albums
                    .Include(e => e.GenreAlbums)
                    .Include(e => e.ArtistAlbums)
                    .ThenInclude(e2 => e2.Artist)
                    .Where(e => albumIds.Contains(e.Id))
                    .ToList();

                var tmpList = this.GetListFromCache(albums);

                var cached = tmpList.Select(e => e.Album.Id).ToArray();
                var remainings = albums
                    .Where(e => !cached.Contains(e.Id))
                    .Select(e => e.Id)
                    .ToArray();

                if (0 < remainings.Length)
                    tmpList.AddRange(await this.GetListFromMopidy(remainings, albums));

                // 渡し値アルバムID順に並べ替え
                foreach (var id in albumIds)
                {
                    var at = tmpList.FirstOrDefault(e => e.Album.Id == id);
                    if (at != null)
                        result.Add(at);
                }

                await albumStore.CompleteAlbumInfo(result);
            }

            return result;
        }

        private List<AlbumTracks> GetListFromCache(List<Album> allAlbums)
        {
            var result = new List<AlbumTracks>();
            var albumIds = allAlbums.Select(e => e.Id).ToArray();

            var cachedTracks = this.Dbc.Tracks
                .Where(e => albumIds.Contains(e.AlbumId))
                .GroupBy(e => e.AlbumId)
                .Select(e => new
                {
                    AlbumId = e.Key,
                    Tracks = e.OrderBy(e2 => e2.DiscNo)
                        .ThenBy(e2 => e2.TrackNo)
                        .ToList()
                })
                .ToList();

            foreach (var pair in cachedTracks)
            {
                var album = allAlbums.First(e => e.Id == pair.AlbumId);
                result.Add(new AlbumTracks()
                {
                    Album = album,
                    Artists = album.ArtistAlbums.Select(e => e.Artist).ToList(),
                    Tracks = pair.Tracks
                });
            }

            return result;
        }

        private async Task<List<AlbumTracks>> GetListFromMopidy(
            int[] pickedAlbumIds,
            List<Album> allAlbums
        )
        {
            using (var trackStore = new TrackStore(this.Dbc))
            {
                var result = new List<AlbumTracks>();

                var albumDictionary = allAlbums
                    .Where(e => pickedAlbumIds.Contains(e.Id))
                    .ToDictionary(e => e.Uri);

                var mopidyTrackDictionary = await Library.Lookup(albumDictionary.Keys.ToArray());

                if (mopidyTrackDictionary == null || mopidyTrackDictionary.Count() <= 0)
                    return result;

                var hasNewTracks = false;
                foreach (var pair in mopidyTrackDictionary)
                {
                    if (!albumDictionary.ContainsKey(pair.Key))
                        continue;

                    var album = albumDictionary[pair.Key];
                    var artists = album.ArtistAlbums.Select(e => e.Artist).ToList();
                    var tracks = pair.Value
                            .Select(mt => trackStore.CreateTrack(mt))
                            .OrderBy(e => e.TrackNo)
                            .ToList();

                    foreach (var track in tracks)
                    {
                        track.AlbumId = album.Id;
                        this.Dbc.Tracks.Add(track);
                        hasNewTracks = true;
                    }

                    result.Add(new AlbumTracks()
                    {
                        Album = album,
                        Artists = artists,
                        Tracks = tracks
                    });
                }

                if (hasNewTracks)
                    this.Dbc.SaveChanges();

                return result;
            }
        }
    }
}
