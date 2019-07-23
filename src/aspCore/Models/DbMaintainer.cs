using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Genres;
using MopidyFinder.Models.Relations;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace MopidyFinder.Models
{
    public class DbMaintainer
    {
        private Dbc _dbc;
        private GenreStore _genreStore;
        private ArtistStore _artistStore;
        private AlbumStore _albumStore;
        private ArtistAlbumStore _artistAlbumStore;
        private GenreAlbumStore _genreAlbumStore;
        private GenreArtistStore _genreArtistStore;

        public DbMaintainer(
            [FromServices] Dbc dbc,
            [FromServices] GenreStore genreStore,
            [FromServices] ArtistStore artistStore,
            [FromServices] AlbumStore albumStore,
            [FromServices] ArtistAlbumStore artistAlbumStore,
            [FromServices] GenreAlbumStore genreAlbumStore,
            [FromServices] GenreArtistStore genreArtistStore
        )
        {
            this._dbc = dbc;
            this._genreStore = genreStore;
            this._artistStore = artistStore;
            this._albumStore = albumStore;
            this._artistAlbumStore = artistAlbumStore;
            this._genreAlbumStore = genreAlbumStore;
            this._genreArtistStore = genreArtistStore;
        }

        #region "Resident Task"
        private bool _isAlbumScannerRunning = false;
        private CancellationTokenSource _albumScannerCanceler = null;

        public bool IsAlbumScannerRunning => this._isAlbumScannerRunning;


        public void RunAlbumScanner()
        {
            if (this._isAlbumScannerRunning)
                return;

            this._isAlbumScannerRunning = true;
            this._albumScannerCanceler = new CancellationTokenSource();
            
            var task = Task.Run(async() => {
                while(true)
                {
                    try
                    {
                        var scaned = await this._albumStore.ScanAlbumDetail(this._albumScannerCanceler.Token);
                        if (scaned <= 0)
                            break;

                        if (this._albumScannerCanceler.Token.IsCancellationRequested)
                            break;

                        await Task.Delay(10000, this._albumScannerCanceler.Token);

                        if (this._albumScannerCanceler.Token.IsCancellationRequested)
                            break;
                    }
                    catch (Exception ex)
                    {
                        break;
                    }

                }

                this._isAlbumScannerRunning = false;
                this._albumScannerCanceler = null;

            }, this._albumScannerCanceler.Token);
        }

        public AlbumStore.AlbumScanProgress GetAlbumScanProgress()
        {
            return this._albumStore.GetAlbumScanProgress();
        }

        public async Task<bool> StopAlbumScanner()
        {
            this._albumScannerCanceler?.Cancel();

            while(this._isAlbumScannerRunning)
            {
                await Task.Delay(1000);
            }

            this._albumScannerCanceler = null;

            return true;
        }

        public async Task<bool> StopAllTasks()
        {
            this._albumScannerCanceler?.Cancel();
            this._dbUpdaterCanceler?.Cancel();

            while (
                this._isAlbumScannerRunning
                || !this.GetDbUpdateProgress().IsRunning
            )
            {
                await Task.Delay(1000);
            }

            this._albumScannerCanceler = null;
            this._dbUpdaterCanceler = null;

            return true;
        }
        #endregion


        #region "Db Refresh"
        public enum UpdateType
        {
            None,
            Cleanup,
            ScanNew
        }

        private enum Phase
        {
            None,
            Cleanup,
            Genres,
            Albums,
            Artists,
            ArtistAlbums,
            GenreAlbums,
            GenreArtists
        }

        private class Updater
        {
            public Phase Phase { get; set; }
            public IMopidyScannable Store { get; set; }
            public decimal Rate { get; set; }
        }

        public class UpdateProgress
        {
            public string UpdateType { get; set; } = "None";
            public bool IsRunning { get; set; } = false;
            public bool Succeeded { get; set; } = false;
            public decimal Progress { get; set; } = 0;
            public string Message { get; set; } = "No-Status";
        }

        private CancellationTokenSource _dbUpdaterCanceler = null;
        private UpdateType _updateType = UpdateType.None;
        private Phase _currentPhase = Phase.None;
        private bool _isDbUpdateRunning = false;
        private bool _succeeded = false;
        private string _message = "";
        private List<Updater> _updaters = new List<Updater>();

        public bool IsDbUpdateRunning => this._isDbUpdateRunning;

        public UpdateProgress GetDbUpdateProgress()
        {
            var result = new UpdateProgress();
            if (this._updateType == UpdateType.None)
                return result;

            switch (this._updateType)
            {
                case UpdateType.Cleanup:
                    result.UpdateType = "Cleanup";
                    break;
                case UpdateType.ScanNew:
                    result.UpdateType = "ScanNew";
                    break;
                default:
                    throw new Exception("Unexpected UpdateType: " + this._updateType);
            }
            
            result.Message = this._message;
            result.IsRunning = this._isDbUpdateRunning;
            result.Succeeded = this._succeeded;

            Updater currentUpdater = null;
            foreach (var updater in this._updaters)
            {
                if (updater.Phase == this._currentPhase)
                {
                    currentUpdater = updater;
                    break;
                }
                result.Progress += updater.Rate;
            }

            if (currentUpdater != null && currentUpdater.Store != null)
                result.Progress += currentUpdater.Rate * currentUpdater.Store.ScanProgress;

            return result;
        }

        public async Task<bool> Update(UpdateType updateType)
        {
            if (updateType == UpdateType.None)
                throw new ArgumentException("Invalid UpdateType: None");

            this._dbUpdaterCanceler = new CancellationTokenSource();
            var cancelToken = this._dbUpdaterCanceler.Token;

            // 実行中フラグは先行して同期的に変更しておく。
            this._isDbUpdateRunning = true;
            this._updateType = updateType;
            this._updaters.Clear();
            // ↑ここまでは同期的に実行する。

            return await Task.Run(async () => {
                if (this.IsAlbumScannerRunning)
                    await this.StopAlbumScanner();

                try
                {
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.Cleanup,
                        Store = null,
                        Rate = 5
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.Genres,
                        Store = this._genreStore,
                        Rate = 5
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.Albums,
                        Store = this._albumStore,
                        Rate = 10
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.Artists,
                        Store = this._artistStore,
                        Rate = 5
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.ArtistAlbums,
                        Store = this._artistAlbumStore,
                        Rate = 45
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.GenreAlbums,
                        Store = this._genreAlbumStore,
                        Rate = 20
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.GenreArtists,
                        Store = this._genreArtistStore,
                        Rate = 5
                    });

                    if (cancelToken.IsCancellationRequested)
                        return false;

                    if (updateType == UpdateType.Cleanup)
                    {
                        this._currentPhase = Phase.Cleanup;
                        this._message = "Database Cleaning.";
                        this._dbc.GenreArtists.RemoveRange(this._dbc.GenreArtists);
                        this._dbc.GenreAlbums.RemoveRange(this._dbc.GenreAlbums);
                        this._dbc.ArtistAlbums.RemoveRange(this._dbc.ArtistAlbums);
                        this._dbc.Genres.RemoveRange(this._dbc.Genres);
                        this._dbc.Artists.RemoveRange(this._dbc.Artists);
                        this._dbc.Albums.RemoveRange(this._dbc.Albums);
                        this._dbc.Tracks.RemoveRange(this._dbc.Tracks);
                        this._dbc.SaveChanges();

                        var res1 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genres';");
                        var res2 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='artists';");
                        var res3 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='albums';");
                        var res4 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='artist_albums';");
                        var res5 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genre_albums';");
                        var res6 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genre_artists';");
                        var res7 = this._dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='tracks';");
                    }

                    this._currentPhase = Phase.Genres;
                    this._message = "Database Cleaned up. Now Scanning Genres...";
                    var genreCount = await this._genreStore.Scan();
                    this._message = $"{genreCount} Genres Found. Now Adding...";
                    if (cancelToken.IsCancellationRequested)
                        return false;
                    this._dbc.SaveChanges();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._currentPhase = Phase.Albums;
                    this._message = $"{genreCount} Genres Added. Now Scanning Albums...";
                    var albumCount = await this._albumStore.Scan();
                    this._message = $"{albumCount} Album Found. Now Adding...";
                    if (cancelToken.IsCancellationRequested)
                        return false;
                    this._dbc.SaveChanges();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._currentPhase = Phase.Artists;
                    this._message = $"{albumCount} Albums Added. Now Scanning Artists...";
                    var artistCount = await this._artistStore.Scan();
                    this._message = $"{artistCount} Artists Found. Now Adding...";
                    if (cancelToken.IsCancellationRequested)
                        return false;
                    this._dbc.SaveChanges();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._currentPhase = Phase.ArtistAlbums;
                    this._message = $"{artistCount} Artists Added. Now Scanning Artist-Album Relations...";
                    var artistAlbumCount = await this._artistAlbumStore.Scan();
                    this._message = $"{artistAlbumCount} Artist-Album Relation Found. Now Adding...";
                    if (cancelToken.IsCancellationRequested)
                        return false;
                    this._dbc.SaveChanges();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._currentPhase = Phase.GenreAlbums;
                    this._message = $"{artistAlbumCount} Artist-Album Relations Added. Now Scanning Genre-Album Relations...";
                    var genreAlbumCount = await this._genreAlbumStore.Scan();
                    this._message = $"{genreAlbumCount} Genre-Album Relations Found. Now Adding...";
                    if (cancelToken.IsCancellationRequested)
                        return false;
                    this._dbc.SaveChanges();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._currentPhase = Phase.GenreArtists;
                    this._message = $"{genreAlbumCount} Genre-Album Relations Added. Now Scanning Genre-Artist Relations...";
                    var genreArtistCount = await this._genreArtistStore.Scan();
                    this._message = $"{genreArtistCount} Genre-Artist Relations Found. Now Adding...";
                    if (cancelToken.IsCancellationRequested)
                        return false;
                    this._dbc.SaveChanges();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._message = $"{genreArtistCount} Genre-Artist Relations Added. Process Completed.";
                    this._isDbUpdateRunning = false;
                    this._succeeded = true;

                    if (!this.IsAlbumScannerRunning)
                        this.RunAlbumScanner();

                    // 完了状態を60秒維持したあと、状態を初期化する。
                    await Task.Delay(60000);

                    this._updaters.Clear();
                    this._updateType = UpdateType.None;
                    this._currentPhase = Phase.None;
                    this._message = "";
                    this._isDbUpdateRunning = false;
                    this._succeeded = false;

                    return true;
                }
                catch (Exception ex)
                {
                    this._isDbUpdateRunning = false;
                    this._succeeded = false;
                    this._message = $"Unexpected Error: {ex.Message}";

                    await Task.Delay(60000);

                    this._updaters.Clear();
                    this._updateType = UpdateType.None;
                    this._currentPhase = Phase.None;
                    this._message = "";
                    this._isDbUpdateRunning = false;
                    this._succeeded = false;

                    return false;
                }
            }, cancelToken);
        }
        #endregion
    }
}
