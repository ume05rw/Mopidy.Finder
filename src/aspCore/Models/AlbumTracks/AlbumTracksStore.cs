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
            using (var trackStore = new TrackStore(this.Dbc))
            using (var albumStore = new AlbumStore(this.Dbc))
            {
                var albumDictionary = this.Dbc.Albums
                    .Include(e => e.GenreAlbums)
                    .Include(e => e.ArtistAlbums)
                    .ThenInclude(e2 => e2.Artist)
                    .Where(e => albumIds.Contains(e.Id))
                    .ToDictionary(e => e.Uri);

                var mopidyTrackDictionary = await Library.Lookup(albumDictionary.Keys.ToArray());

                if (mopidyTrackDictionary == null || mopidyTrackDictionary.Count() <= 0)
                    return result;

                var tmpList = new List<AlbumTracks>();

                foreach (var pair in mopidyTrackDictionary)
                {
                    if (!albumDictionary.ContainsKey(pair.Key))
                        continue;

                    var album = albumDictionary[pair.Key];
                    var artists = album.ArtistAlbums.Select(e => e.Artist).ToList();

                    tmpList.Add(new AlbumTracks()
                    {
                        Album = album,
                        Artists = artists,
                        Tracks = pair.Value
                            .Select(mt => trackStore.CreateTrack(mt))
                            .OrderBy(e => e.TrackNo)
                            .ToList()
                    });
                }

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
    }
}
