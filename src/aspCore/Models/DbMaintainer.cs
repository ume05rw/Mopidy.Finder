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
        #region "Resident Task"
        private static IServiceProvider _provider = null;
        private static bool _isAlbumScannerRunning = false;
        private static CancellationTokenSource _albumScannerCanceler = null;
        private static CancellationTokenSource _dbUpdateCanceler = null;

        public static bool IsAlbumScannerRunning => DbMaintainer._isAlbumScannerRunning;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            DbMaintainer._provider = provider;
        }

        public static void RunAlbumScanner()
        {
            if (DbMaintainer._isAlbumScannerRunning)
                return;

            DbMaintainer._isAlbumScannerRunning = true;
            DbMaintainer._albumScannerCanceler = new CancellationTokenSource();
            
            var task = Task.Run(async() => {
                while(true)
                {
                    try
                    {
                        var scaned = await DbMaintainer.ScanAlbum(DbMaintainer._albumScannerCanceler.Token);
                        if (scaned <= 0)
                            break;

                        if (DbMaintainer._albumScannerCanceler.Token.IsCancellationRequested)
                            break;

                        await Task.Delay(10000, DbMaintainer._albumScannerCanceler.Token);

                        if (DbMaintainer._albumScannerCanceler.Token.IsCancellationRequested)
                            break;
                    }
                    catch (Exception ex)
                    {
                        break;
                    }

                }

                DbMaintainer._isAlbumScannerRunning = false;
                DbMaintainer._albumScannerCanceler = null;

            }, DbMaintainer._albumScannerCanceler.Token);
        }

        private async static Task<int> ScanAlbum(CancellationToken cancelToken)
        {
            using (var serviceScope = DbMaintainer._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var logger = serviceScope.ServiceProvider.GetService<ILoggerFactory>())
            using (var albumStore = new AlbumStore(dbc))
            {
                
                return await albumStore.ScanAlbumDetail(cancelToken);
            }
        }


        public static AlbumStore.AlbumScanProgress GetAlbumScanProgress()
        {
            using (var serviceScope = DbMaintainer._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var albumStore = new AlbumStore(dbc))
            {
                return albumStore.GetAlbumScanProgress();
            }
        }


        public static void ReleaseServiceProvider()
        {
            DbMaintainer._provider = null;
        }

        public static async Task<bool> StopAlbumScanner()
        {
            DbMaintainer._albumScannerCanceler?.Cancel();

            while(DbMaintainer._isAlbumScannerRunning)
            {
                await Task.Delay(1000);
            }

            DbMaintainer._albumScannerCanceler = null;

            return true;
        }

        public static async Task<bool> StopAllTasks()
        {
            DbMaintainer._albumScannerCanceler?.Cancel();
            DbMaintainer._dbUpdateCanceler?.Cancel();

            while (
                DbMaintainer._isAlbumScannerRunning
                || !DbMaintainer.Instance.GetProgress().IsRunning
            )
            {
                await Task.Delay(1000);
            }

            DbMaintainer._albumScannerCanceler = null;
            DbMaintainer._dbUpdateCanceler = null;

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
        
        private static DbMaintainer _instance = new DbMaintainer();
        public static DbMaintainer Instance => DbMaintainer._instance;

        private UpdateType _updateType = UpdateType.None;
        private Phase _currentPhase = Phase.None;
        private bool _isRunning = false;
        private bool _succeeded = false;
        private string _message = "";
        private List<Updater> _updaters = new List<Updater>();

        public bool IsRunning => this._isRunning;

        public UpdateProgress GetProgress()
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
            result.IsRunning = this._isRunning;
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

            DbMaintainer._dbUpdateCanceler = new CancellationTokenSource();
            var cancelToken = DbMaintainer._dbUpdateCanceler.Token;

            // 実行中フラグは先行して同期的に変更しておく。
            this._isRunning = true;
            this._updateType = updateType;
            this._updaters.Clear();
            // ↑ここまでは同期的に実行する。

            return await Task.Run(async () => {
                if (DbMaintainer.IsAlbumScannerRunning)
                    await DbMaintainer.StopAlbumScanner();

                using (var serviceScope = DbMaintainer._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
                using (var genreStore = new GenreStore(dbc))
                using (var albumStore = new AlbumStore(dbc))
                using (var artistStore = new ArtistStore(dbc))
                using (var artistAlbumStore = new ArtistAlbumStore(dbc))
                using (var genreAlbumStore = new GenreAlbumStore(dbc))
                using (var genreArtistStore = new GenreArtistStore(dbc))
                {
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
                            Store = genreStore,
                            Rate = 5
                        });
                        this._updaters.Add(new Updater()
                        {
                            Phase = Phase.Albums,
                            Store = albumStore,
                            Rate = 10
                        });
                        this._updaters.Add(new Updater()
                        {
                            Phase = Phase.Artists,
                            Store = artistStore,
                            Rate = 5
                        });
                        this._updaters.Add(new Updater()
                        {
                            Phase = Phase.ArtistAlbums,
                            Store = artistAlbumStore,
                            Rate = 45
                        });
                        this._updaters.Add(new Updater()
                        {
                            Phase = Phase.GenreAlbums,
                            Store = genreAlbumStore,
                            Rate = 20
                        });
                        this._updaters.Add(new Updater()
                        {
                            Phase = Phase.GenreArtists,
                            Store = genreArtistStore,
                            Rate = 5
                        });

                        if (cancelToken.IsCancellationRequested)
                            return false;

                        if (updateType == UpdateType.Cleanup)
                        {
                            this._currentPhase = Phase.Cleanup;
                            this._message = "Database Cleaning.";
                            dbc.GenreArtists.RemoveRange(dbc.GenreArtists);
                            dbc.GenreAlbums.RemoveRange(dbc.GenreAlbums);
                            dbc.ArtistAlbums.RemoveRange(dbc.ArtistAlbums);
                            dbc.Genres.RemoveRange(dbc.Genres);
                            dbc.Artists.RemoveRange(dbc.Artists);
                            dbc.Albums.RemoveRange(dbc.Albums);
                            dbc.Tracks.RemoveRange(dbc.Tracks);
                            dbc.SaveChanges();

                            var res1 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genres';");
                            var res2 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='artists';");
                            var res3 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='albums';");
                            var res4 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='artist_albums';");
                            var res5 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genre_albums';");
                            var res6 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genre_artists';");
                            var res7 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='tracks';");
                        }

                        this._currentPhase = Phase.Genres;
                        this._message = "Database Cleaned up. Now Scanning Genres...";
                        var genreCount = await genreStore.Scan();
                        this._message = $"{genreCount} Genres Found. Now Adding...";
                        if (cancelToken.IsCancellationRequested)
                            return false;
                        dbc.SaveChanges();
                        if (cancelToken.IsCancellationRequested)
                            return false;

                        this._currentPhase = Phase.Albums;
                        this._message = $"{genreCount} Genres Added. Now Scanning Albums...";
                        var albumCount = await albumStore.Scan();
                        this._message = $"{albumCount} Album Found. Now Adding...";
                        if (cancelToken.IsCancellationRequested)
                            return false;
                        dbc.SaveChanges();
                        if (cancelToken.IsCancellationRequested)
                            return false;

                        this._currentPhase = Phase.Artists;
                        this._message = $"{albumCount} Albums Added. Now Scanning Artists...";
                        var artistCount = await artistStore.Scan();
                        this._message = $"{artistCount} Artists Found. Now Adding...";
                        if (cancelToken.IsCancellationRequested)
                            return false;
                        dbc.SaveChanges();
                        if (cancelToken.IsCancellationRequested)
                            return false;

                        this._currentPhase = Phase.ArtistAlbums;
                        this._message = $"{artistCount} Artists Added. Now Scanning Artist-Album Relations...";
                        var artistAlbumCount = await artistAlbumStore.Scan();
                        this._message = $"{artistAlbumCount} Artist-Album Relation Found. Now Adding...";
                        if (cancelToken.IsCancellationRequested)
                            return false;
                        dbc.SaveChanges();
                        if (cancelToken.IsCancellationRequested)
                            return false;

                        this._currentPhase = Phase.GenreAlbums;
                        this._message = $"{artistAlbumCount} Artist-Album Relations Added. Now Scanning Genre-Album Relations...";
                        var genreAlbumCount = await genreAlbumStore.Scan();
                        this._message = $"{genreAlbumCount} Genre-Album Relations Found. Now Adding...";
                        if (cancelToken.IsCancellationRequested)
                            return false;
                        dbc.SaveChanges();
                        if (cancelToken.IsCancellationRequested)
                            return false;

                        this._currentPhase = Phase.GenreArtists;
                        this._message = $"{genreAlbumCount} Genre-Album Relations Added. Now Scanning Genre-Artist Relations...";
                        var genreArtistCount = await genreArtistStore.Scan();
                        this._message = $"{genreArtistCount} Genre-Artist Relations Found. Now Adding...";
                        if (cancelToken.IsCancellationRequested)
                            return false;
                        dbc.SaveChanges();
                        if (cancelToken.IsCancellationRequested)
                            return false;

                        this._message = $"{genreArtistCount} Genre-Artist Relations Added. Process Completed.";
                        this._isRunning = false;
                        this._succeeded = true;

                        if (!DbMaintainer.IsAlbumScannerRunning)
                            DbMaintainer.RunAlbumScanner();

                        // 完了状態を60秒維持したあと、状態を初期化する。
                        await Task.Delay(60000);

                        this._updaters.Clear();
                        this._updateType = UpdateType.None;
                        this._currentPhase = Phase.None;
                        this._message = "";
                        this._isRunning = false;
                        this._succeeded = false;

                        return true;
                    }
                    catch (Exception ex)
                    {
                        this._isRunning = false;
                        this._succeeded = false;
                        this._message = $"Unexpected Error: {ex.Message}";

                        await Task.Delay(60000);

                        this._updaters.Clear();
                        this._updateType = UpdateType.None;
                        this._currentPhase = Phase.None;
                        this._message = "";
                        this._isRunning = false;
                        this._succeeded = false;

                        return false;
                    }
                }
            }, cancelToken);
        }
        #endregion
    }
}
