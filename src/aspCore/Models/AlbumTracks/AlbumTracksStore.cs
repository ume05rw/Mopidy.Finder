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
    public class AlbumTracksStore : PagenagedStoreBase<AlbumTracks>
    {
        public class PagenagedQueryArgs
        {
            public int[] GenreIds { get; set; }
            public int[] ArtistIds { get; set; }
            public string FilterText { get; set; }
            public int? Page { get; set; }
        }


        public AlbumTracksStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        protected new int PageLength = 10;

        public async Task<PagenatedResult> GetPagenatedList(PagenagedQueryArgs args)
        {
            var query = (IQueryable<Album>)this.Dbc.Albums
                .Include(e => e.GenreAlbums)
                .Include(e => e.ArtistAlbums)
                .ThenInclude(e2 => e2.Artist);

            if (args.GenreIds != null && 0 < args.GenreIds.Length)
                query = query
                    .Where(e => e.GenreAlbums.Any(e2 => args.GenreIds.Contains(e2.GenreId)));

            if (args.ArtistIds != null && 0 < args.ArtistIds.Length)
                query = query
                    .Where(e => e.ArtistAlbums.Any(e2 => args.ArtistIds.Contains(e2.ArtistId)));

            if (!string.IsNullOrEmpty(args.FilterText))
                query = query
                    .Where(e => e.LowerName.Contains(args.FilterText.ToLower()));

            var ordered = query
                .OrderBy(e => e.ArtistAlbums.Min(e2 => e2.Artist.LowerName))
                .ThenBy(e => e.Year)
                .ThenBy(e => e.LowerName);

            var totalLength = ordered.Count();

            var albums = (args.Page != null)
                ? ordered
                    .Skip(((int)args.Page - 1) * this.PageLength)
                    .Take(this.PageLength)
                    .ToList()
                : ordered
                    .ToList();

            var albumTracksList = await this.GetList(albums);

            var result = new PagenatedResult()
            {
                TotalLength = totalLength,
                ResultLength = albums.Count(),
                ResultPage = args.Page,
                ResultList = albumTracksList.ToArray()
            };

            return result;
        }

        private async Task<List<AlbumTracks>> GetList(List<Album> albums)
        {
            var result = new List<AlbumTracks>();
            using (var albumStore = new AlbumStore(this.Dbc))
            {
                var tmpList = this.GetListFromCache(albums);

                var cached = tmpList.Select(e => e.Album.Id).ToArray();
                var remainings = albums
                    .Where(e => !cached.Contains(e.Id))
                    .Select(e => e.Id)
                    .ToArray();

                if (0 < remainings.Length)
                    tmpList.AddRange(await this.GetListFromMopidy(remainings, albums));

                // 渡し値アルバムID順に並べ替え
                foreach (var album in albums)
                {
                    var at = tmpList.FirstOrDefault(e => e.Album.Id == album.Id);
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

        public async Task<AlbumTracks> PlayAlbum(Track track)
        {
            using (var trackStore = new TrackStore(this.Dbc))
            {
                var targetTrack = this.Dbc.Tracks
                    .Include(e => e.Album)
                    .ThenInclude(e2 => e2.ArtistAlbums)
                    .ThenInclude(e3 => e3.Artist)
                    .First(e => e.Id == track.Id);

                var tracks = this.Dbc.Tracks
                    .Where(e => e.AlbumId == targetTrack.AlbumId)
                    .OrderBy(e => e.DiscNo)
                    .ThenBy(e => e.TrackNo)
                    .ToArray();

                var exists = await trackStore.GetList();

                var remainingUris = tracks
                    .Where(e => exists.All(e2 => e2.Uri != e.Uri))
                    .Select(e => e.Uri)
                    .ToArray();

                if (0 < remainingUris.Length)
                {
                    var added = await trackStore.SetListByUris(remainingUris);
                    exists.AddRange(added);
                }

                foreach (var t in tracks)
                    t.TlId = exists.First(e => e.Uri == t.Uri).TlId;

                var targetTlId = tracks.First(e => e.Id == track.Id).TlId;
                await Playback.Play((int)targetTlId);

                var result = new AlbumTracks()
                {
                    Album = targetTrack.Album,
                    Artists = targetTrack.Album.ArtistAlbums.Select(e => e.Artist).ToList(),
                    Tracks = tracks.ToList()
                };

                return result;
            }
        }
    }
}
