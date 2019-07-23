using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using MopidyFinder.Models.Tracks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Albums
{
    public class AlbumStore : PagenagedStoreBase<Album>, IMopidyScannable
    {
        private const string AlbumQueryString = "local:directory?type=album";
        private const string YearQueryString = "local:directory?type=date&format=%25Y";

        //private readonly int AlbumPageLength = 10;

        private Library _library;
        private TrackStore _trackStore;

        public AlbumStore(
            [FromServices] Dbc dbc,
            [FromServices] Library library,
            [FromServices] TrackStore trackStore
        ) : base(dbc)
        {
            this._library = library;
            this._trackStore = trackStore;
        }

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
            var imageDictionary = await this._library.GetImages(targetDictionary.Keys.ToArray());

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

        #region "Db Refresh"
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
            var albumResults = await this._library.Browse(AlbumStore.AlbumQueryString);
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
            var yearResults = await this._library.Browse(AlbumStore.YearQueryString);
            foreach (var row in yearResults)
            {
                var year = default(int);
                if (!int.TryParse(row.Name, out year))
                    continue;

                var yearAlbums = await this._library.Browse(row.Uri);

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
        #endregion

        #region "Resident Task"
        public class AlbumScanProgress
        {
            public int TotalAlbumCount { get; set; }
            public int ScannedAlbumCount { get; set; }
        }

        public AlbumScanProgress GetAlbumScanProgress()
        {
            var result = new AlbumScanProgress();
            result.TotalAlbumCount = this.Dbc.Albums.Count();
            result.ScannedAlbumCount
                = this.Dbc.Albums
                    .GroupJoin(
                        this.Dbc.Tracks,
                        al => al.Id,
                        tr => tr.AlbumId,
                        (al, tr) => new
                        {
                            Album = al,
                            Tracks = tr
                        }
                    )
                    .Where(e => e.Tracks.Any())
                    .Count();

            return result;
        }

        public async Task<int> ScanAlbumDetail(CancellationToken cancelToken)
        {
            if (cancelToken.IsCancellationRequested)
                return 0;

            // SELECTはここで完了
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
                .Where(e => e.Track.Count() <= 0)
                .Select(e => e.Album)
                .Take(10)
                .ToArray();

            if (!albums.Any())
                return 0;

            var tmpTracks = this.Dbc.Tracks
                .Join(
                    albums,
                    tr => tr.AlbumId,
                    al => al.Id,
                    (tr, al) => new
                    {
                        Track = tr,
                        Album = al
                    }
                )
                .ToArray();

            if (0 < tmpTracks.Length)
            {
                // クエリ結果取得時点では、アルバムにトラックが存在しないこと。
                var why = albums;
                throw new Exception("Invalid EF-Query.");
            }


            if (cancelToken.IsCancellationRequested)
                return -1;

            // 画像を取得
            var noImageAlbumUris = albums
                .Where(e => string.IsNullOrEmpty(e.ImageUri))
                .Select(e => e.Uri)
                .ToArray();
            var imageDictionary = await this._library.GetImages(noImageAlbumUris);

            if (cancelToken.IsCancellationRequested)
                return -1;

            // トラックを取得
            var albumUris = albums.Select(e => e.Uri).ToArray();
            var mopidyTrackDictionary = await this._library.Lookup(albumUris);

            if (cancelToken.IsCancellationRequested)
                return -1;

            var updatedAlbums = new List<Album>();
            if (imageDictionary != null)
            {
                foreach (var pair in imageDictionary)
                {
                    var album = albums.FirstOrDefault(e => e.Uri == pair.Key);
                    if (album == null || !string.IsNullOrEmpty(album.ImageUri))
                        continue;

                    album.ImageUri = pair.Value.Uri;
                    updatedAlbums.Add(album);

                    //this.Dbc.Entry(album).State = EntityState.Modified;
                }
            }

            var addTargets = new List<Track>();
            if (mopidyTrackDictionary != null)
            {
                // Dbcを渡してTrackStoreを生成しているが、
                // trackStoreのメソッドではDbcを使っていない。
                foreach (var pair in mopidyTrackDictionary)
                {
                    var album = albums
                        .FirstOrDefault(e => e.Uri == pair.Key);
                    if (album == null)
                        continue;


                    var tracks = pair.Value
                        .Select(mt => this._trackStore.CreateTrack(mt))
                        .OrderBy(e => e.TrackNo)
                        .ToArray();

                    var existsAlbumTrack = false;
                    var albumTracks = new List<Track>();
                    foreach (var track in tracks)
                    {
                        // 登録前の最終確認
                        var exists = this.Dbc.Tracks
                            .Where(e => e.Uri == track.Uri && e.AlbumId == album.Id)
                            .Any();

                        if (exists)
                        {
                            // なぜ重複しているか、確認のこと。
                            existsAlbumTrack = true;
                            var tmp = 1;
                        }
                        else
                        {
                            track.AlbumId = album.Id;
                            albumTracks.Add(track);
                        }
                    }

                    // アルバム上の曲がDB上に1件もないときのみ、DBに全件書き込む。
                    if (existsAlbumTrack == false)
                        addTargets.AddRange(albumTracks);
                }
            }

            if (cancelToken.IsCancellationRequested)
                return -1;

            foreach (var album in updatedAlbums)
                this.Dbc.Entry(album).State = EntityState.Modified;

            if (0 < addTargets.Count())
                this.Dbc.Tracks.AddRange(addTargets);

            this.Dbc.SaveChanges();

            return albums.Length;
        }
        #endregion

        protected override void Dispose(bool disposing)
        {
            if (!this.IsDisposed && disposing)
            {
                this._library = null;
                this._trackStore.Dispose();
                this._trackStore = null;
            }

            base.Dispose(disposing);
        }
    }
}
