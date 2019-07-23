using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        //private bool _isAlbumScannerRunning = false;
        private CancellationTokenSource _albumScannerCanceler = null;
        public bool IsAlbumScannerRunning => (this._albumScannerCanceler != null);

        public void RunAlbumScanner()
        {
            if (this._albumScannerCanceler != null)
                throw new InvalidOperationException("AlbumScanner Already Running.");

            this._albumScannerCanceler = new CancellationTokenSource();
            var cancelToken = this._albumScannerCanceler.Token;

            var task = Task.Run(async() => {
                while(true)
                {
                    try
                    {
                        var scaned = await this._albumStore.ScanAlbumDetail(cancelToken);
                        if (scaned <= 0)
                            break;

                        if (cancelToken.IsCancellationRequested)
                            break;

                        await Task.Delay(10000, cancelToken);

                        if (cancelToken.IsCancellationRequested)
                            break;
                    }
                    catch (Exception)
                    {
                        break;
                    }
                }

                this._albumScannerCanceler.Dispose();
                this._albumScannerCanceler = null;

            }, this._albumScannerCanceler.Token);
        }

        public AlbumStore.AlbumScanProgress GetAlbumScanProgress()
        {
            return this._albumStore.GetAlbumScanProgress();
        }

        public async Task<bool> StopAlbumScanner()
        {
            if (this._albumScannerCanceler == null)
                return true;

            this._albumScannerCanceler.Cancel();

            while(this._albumScannerCanceler != null)
            {
                await Task.Delay(1000);
            }

            return true;
        }

        public async Task<bool> StopAllTasks()
        {
            if (this._albumScannerCanceler != null)
                this._albumScannerCanceler.Cancel();
            if (this._dbUpdaterCanceler != null)
                this._dbUpdaterCanceler.Cancel();

            while (
                this._albumScannerCanceler != null
                || this._dbUpdaterCanceler != null
            )
            {
                await Task.Delay(1000);
            }

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
        private bool _succeeded = false;
        private string _message = "";
        private List<Updater> _updaters = new List<Updater>();

        public bool IsDbUpdateRunning => (this._dbUpdaterCanceler != null);

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
            result.IsRunning = this.IsDbUpdateRunning;
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

            if (this._dbUpdaterCanceler != null)
                throw new InvalidOperationException("Update Already Running.");

            this._dbUpdaterCanceler = new CancellationTokenSource();
            var cancelToken = this._dbUpdaterCanceler.Token;

            // 実行中フラグは先行して同期的に変更しておく。
            this._updateType = updateType;
            this._updaters.Clear();
            // ↑ここまでは同期的に実行する。

            return await Task.Run(async () => {
                if (this.IsAlbumScannerRunning)
                    await this.StopAlbumScanner();

                try
                {
                    this.CreateUpdater();
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    if (updateType == UpdateType.Cleanup)
                    {
                        this._currentPhase = Phase.Cleanup;
                        this._message = "Database Cleaning.";
                        this.Cleanup();
                    }
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    string postMessage = (updateType == UpdateType.Cleanup)
                        ? "Database Cleaned up."
                        : "Scan Start.";
                    postMessage = await this.Scan<Genre>(postMessage, cancelToken);
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    postMessage = await this.Scan<Album>(postMessage, cancelToken);
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    postMessage = await this.Scan<Artist>(postMessage, cancelToken);
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    postMessage = await this.Scan<ArtistAlbum>(postMessage, cancelToken);
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    postMessage = await this.Scan<GenreAlbum>(postMessage, cancelToken);
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    postMessage = await this.Scan<GenreArtist>(postMessage, cancelToken);
                    if (cancelToken.IsCancellationRequested)
                        return false;

                    this._message = $"{postMessage} Process Completed.";
                    this._succeeded = true;
                    this._dbUpdaterCanceler.Dispose();
                    this._dbUpdaterCanceler = null;

                    if (!this.IsAlbumScannerRunning)
                        this.RunAlbumScanner();

                    // 完了状態を60秒維持したあと、状態を初期化する。
                    await Task.Delay(60000);

                    this._updaters.Clear();
                    this._updateType = UpdateType.None;
                    this._currentPhase = Phase.None;
                    this._message = "";
                    this._succeeded = false;

                    return true;
                }
                catch (Exception ex)
                {
                    this._dbUpdaterCanceler?.Dispose();
                    this._dbUpdaterCanceler = null;
                    this._succeeded = false;
                    this._message = $"Unexpected Error: {ex.Message}";

                    await Task.Delay(60000);

                    this._updaters.Clear();
                    this._updateType = UpdateType.None;
                    this._currentPhase = Phase.None;
                    this._message = "";
                    this._succeeded = false;

                    return false;
                }
            }, cancelToken);
        }

        private void CreateUpdater()
        {
            this._updaters.Clear();

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
        }

        private bool Cleanup()
        {
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

            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="preProcMessage"></param>
        /// <param name="cancelToken"></param>
        /// <returns></returns>
        /// <remarks>
        /// エレガントさの欠片も無い...
        /// もっと、こう、あるだろ！感。
        /// </remarks>
        private async Task<string> Scan<TEntity>(string preProcMessage, CancellationToken cancelToken) where TEntity: IEntity
        {
            Phase phase;
            IMopidyScannable store = null;
            string scanTypeMessage = null;
            var entityType = typeof(TEntity);

            if (entityType == typeof(Genre))
            {
                scanTypeMessage = "Genres";
                phase = Phase.Genres;
                store = this._genreStore;
            }
            else if (entityType == typeof(Album))
            {
                scanTypeMessage = "Albums";
                phase = Phase.Albums;
                store = this._albumStore;
            }
            else if (entityType == typeof(Artist))
            {
                scanTypeMessage = "Artists";
                phase = Phase.Artists;
                store = this._artistStore;
            }
            else if (entityType == typeof(ArtistAlbum))
            {
                scanTypeMessage = "Artist-Album Relations";
                phase = Phase.ArtistAlbums;
                store = this._artistAlbumStore;
            }
            else if (entityType == typeof(GenreAlbum))
            {
                scanTypeMessage = "Genre-Album Relations";
                phase = Phase.GenreAlbums;
                store = this._genreAlbumStore;
            }
            else if (entityType == typeof(GenreArtist))
            {
                scanTypeMessage = "Genre-Artist Relations";
                phase = Phase.GenreArtists;
                store = this._genreArtistStore;
            }
            else
            {
                throw new InvalidOperationException("ここには来ないはず");
            }

            if (cancelToken.IsCancellationRequested)
                return "Process Canceled.";

            this._currentPhase = phase;
            this._message = $"{preProcMessage} Now Scanning {scanTypeMessage}...";
            var newEntities = await store.Scan(this._dbc);

            if (cancelToken.IsCancellationRequested)
                return "Process Canceled.";

            this._message = $"{newEntities.Length} {scanTypeMessage} Found. Now Adding...";
            if (0 < newEntities.Length)
                this._dbc.SaveChanges();

            return $"{newEntities.Length} {scanTypeMessage} Added.";
        }

        #endregion
    }
}
