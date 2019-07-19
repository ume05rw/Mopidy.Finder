using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using MopidyFinder.Models.Tracks;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Albums
{
    public class AlbumStore : PagenagedStoreBase<Album>, IMopidyScannable
    {
        private const string AlbumQueryString = "local:directory?type=album";
        private const string YearQueryString = "local:directory?type=date&format=%25Y";

        //private readonly int AlbumPageLength = 10;

        public AlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Album Get(int genreId)
            => this.Dbc.GetAlbumQuery().FirstOrDefault(e => e.Id == genreId);

        public async Task<bool> CompleteAlbumInfo(List<AlbumTracks.AlbumTracks> albumTracksList)
        {
            var isImageUpdated = await this.CompleteImages(albumTracksList);
            var isYearUpdated = this.CompleteYears(albumTracksList);

            if (isImageUpdated || isYearUpdated)
                this.Dbc.SaveChanges();

            return true;
        }

        private async Task<bool> CompleteImages(List<AlbumTracks.AlbumTracks> albumTracksList)
        {
            var targetDictionary = albumTracksList
                .Where(e => string.IsNullOrEmpty(e.Album.ImageUri))
                .Select(e => e.Album)
                .ToDictionary(e => e.Uri);

            if (targetDictionary.Count() <= 0)
                return false;

            var hasUpdated = false;
            var imageDictionary = await Library.GetImages(targetDictionary.Keys.ToArray());

            foreach (var pair in imageDictionary)
            {
                if (!targetDictionary.ContainsKey(pair.Key))
                    continue;

                var album = targetDictionary[pair.Key];
                album.ImageUri = pair.Value.Uri;
                this.Dbc.Entry(album).State = EntityState.Modified;
                hasUpdated = true;
            }

            return hasUpdated;
        }

        private bool CompleteYears(List<AlbumTracks.AlbumTracks> albumTracksList)
        {
            var hasUpdated = false;
            foreach (var at in albumTracksList)
            {
                if (at.Album.Year != null)
                    continue;

                var date = at.Tracks.Max(e => e.Date);
                if (date != null && 4 < date.Length)
                    date = date.Substring(0, 4);

                if (date != null && int.TryParse(date, out var year))
                {
                    at.Album.Year = year;
                    this.Dbc.Entry(at.Album).State = EntityState.Modified;
                    hasUpdated = true;
                }
            }

            return hasUpdated;
        }


        private decimal _processLength = 0;
        private decimal _processed = 0;
        public decimal ScanProgress
        {
            get
            {
                return (this._processLength <= 0)
                    ? 0
                    : (this._processLength <= this._processed)
                        ? 1
                        : (this._processed / this._processLength);
            }
        }

        public async Task<int> Scan()
        {
            this._processLength = 0;
            this._processed = 0;

            // アルバム取得
            var albumResults = await Library.Browse(AlbumStore.AlbumQueryString);
            var existsUris = this.Dbc.Albums.Select(e => e.Uri).ToArray();
            var newRefs = albumResults.Where(e => !existsUris.Contains(e.Uri)).ToArray();

            var newEntityDictionary = newRefs.Select(e => new Album()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToDictionary(e => e.Uri);

            this._processLength = newEntityDictionary.Count();

            // 年度別アルバムを取得して割り当て
            var yearResults = await Library.Browse(AlbumStore.YearQueryString);
            foreach (var row in yearResults)
            {
                var year = default(int);
                if (!int.TryParse(row.Name, out year))
                    continue;

                var yearAlbums = await Library.Browse(row.Uri);

                foreach (var ya in yearAlbums)
                {
                    var albumUri = ya.GetAlbumUri();
                    if (newEntityDictionary.ContainsKey(albumUri))
                    {
                        newEntityDictionary[albumUri].Year = year;
                        this._processed++;
                    }
                }
            }

            this.Dbc.Albums.AddRange(newEntityDictionary.Select(e => e.Value));

            return newEntityDictionary.Count();
        }

        public async Task<bool> ScanAlbumDetail()
        {
            var albums = this.Dbc.Albums
                .GroupJoin(
                    this.Dbc.Tracks,
                    al => al.Id,
                    tr => tr.AlbumId,
                    (al, tr) => new
                    {
                        Album = al,
                        Track = tr
                    }
                )
                .Where(e => !e.Track.Any())
                .Select(e => e.Album)
                .Take(10);

            if (!albums.Any())
                return true;

            // 画像を取得
            var noImageAlbumUris = albums
                .Where(e => string.IsNullOrEmpty(e.ImageUri))
                .Select(e => e.Uri)
                .ToArray();

            var imageDictionary = await Library.GetImages(noImageAlbumUris);
            if (imageDictionary != null)
            {
                foreach (var pair in imageDictionary)
                {
                    var album = albums.FirstOrDefault(e => e.Uri == pair.Key);
                    if (album == null || !string.IsNullOrEmpty(album.ImageUri))
                        continue;

                    album.ImageUri = pair.Value.Uri;
                    this.Dbc.Entry(album).State = EntityState.Modified;
                }
            }

            // トラックを取得
            var albumUris = albums.Select(e => e.Uri).ToArray();
            var mopidyTrackDictionary = await Library.Lookup(albumUris);
            if (mopidyTrackDictionary != null)
            {
                using (var trackStore = new TrackStore(this.Dbc))
                {
                    foreach (var pair in mopidyTrackDictionary)
                    {
                        var album = albums
                            .FirstOrDefault(e => e.Uri == pair.Key);
                        if (album == null)
                            continue;

                        var tracks = pair.Value
                            .Select(mt => trackStore.CreateTrack(mt))
                            .OrderBy(e => e.TrackNo)
                            .ToArray();

                        foreach (var track in tracks)
                        {
                            track.AlbumId = album.Id;
                            this.Dbc.Tracks.Add(track);
                        }
                    }
                }
            }

            this.Dbc.SaveChanges();

            return true;
        }
    }
}
