using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Genres;
using MopidyFinder.Models.Relations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Specialized;

namespace MopidyFinder.Models
{
    public class DbMaintainer
    {
        private static bool _isUpdateAlbumRunning = false;
        public static void RunUpdateAlbumTask()
        {
            if (DbMaintainer._isUpdateAlbumRunning)
                return;

            DbMaintainer._isUpdateAlbumRunning = true;
            var task = Task.Run(async() => {
                while(true)
                {
                    await DbMaintainer.ScanAlbum();
                    await Task.Delay(10000);
                }
            });
        }

        private async static Task<bool> ScanAlbum()
        {
            using (var serviceScope = DbMaintainer._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var albumStore = new AlbumStore(dbc))
            {
                await albumStore.ScanAlbumDetail();
            }

            return true;
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

        public class ProgressStatus
        {
            public bool Finished { get; set; } = false;
            public bool Succeeded { get; set; } = false;
            public decimal Progress { get; set; } = 0;
            public string Message { get; set; } = "No-Status";
        }

        private static IServiceProvider _provider = null;
        private static DbMaintainer _instance = new DbMaintainer();
        public static DbMaintainer Instance => DbMaintainer._instance;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            DbMaintainer._provider = provider;
        }

        public static void ReleaseServiceProvider()
        {
            DbMaintainer._provider = null;
        }


        private Phase _currentPhase = Phase.None;
        private bool _finished = false;
        private bool _succeeded = false;
        private string _message = "";
        private List<Updater> _updaters = new List<Updater>();

        public bool IsActive
            => !(this._updaters == null || this._updaters.Count() <= 0);

        public ProgressStatus GetStatus()
        {
            var result = new ProgressStatus();
            if (this._updaters == null || this._updaters.Count() <= 0)
                return result;

            result.Message = this._message;
            result.Finished = this._finished;
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

        public async Task<bool> Refresh(bool deleteExists = false)
        {
            // 即座に_refreshersに値をセットしておく。
            // 値の存在を基準に動作中か否かを判定しているため。
            this._updaters.Clear();

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
                        Rate = 10
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.ArtistAlbums,
                        Store = artistAlbumStore,
                        Rate = 30
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.GenreAlbums,
                        Store = genreAlbumStore,
                        Rate = 30
                    });
                    this._updaters.Add(new Updater()
                    {
                        Phase = Phase.GenreArtists,
                        Store = genreArtistStore,
                        Rate = 10
                    });

                    if (deleteExists == true)
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
                    this._message = "Database Cleaned up. Go Registering Genres...";
                    var genreCount = await genreStore.Scan();
                    dbc.SaveChanges();

                    this._currentPhase = Phase.Albums;
                    this._message = $"{genreCount} Genres Added. Now Scaning Albums...";
                    var albumCount = await albumStore.Scan();
                    dbc.SaveChanges();

                    this._currentPhase = Phase.Artists;
                    this._message = $"{albumCount} Albums Added. Now Scaning Artists.";
                    var artistCount = await artistStore.Scan();
                    dbc.SaveChanges();

                    this._currentPhase = Phase.ArtistAlbums;
                    this._message = $"{artistCount} Artists Added. Now Scaning Artist-Album Relations.";
                    var artistAlbumCount = await artistAlbumStore.Scan();
                    dbc.SaveChanges();

                    this._currentPhase = Phase.GenreAlbums;
                    this._message = $"{artistAlbumCount} Artist-Album Relations Added. Now Scaning Genre-Album Relations.";
                    var genreAlbumCount = await genreAlbumStore.Scan();
                    dbc.SaveChanges();

                    this._currentPhase = Phase.GenreArtists;
                    this._message = $"{genreAlbumCount} Genre-Album Relations Added. Now Scaning Genre-Artist Relations.";
                    var genreArtistCount = await genreArtistStore.Scan();
                    dbc.SaveChanges();
                    this._message = $"{genreArtistCount} Genre-Artist Relations Added. Process Completed.";

                    this._finished = true;
                    this._succeeded = true;

                    // 完了状態を60秒維持したあと、状態を初期化する。
                    await Task.Delay(60000);

                    this._updaters.Clear();
                    this._currentPhase = Phase.None;
                    this._message = "";
                    this._finished = false;
                    this._succeeded = false;

                }
                catch (Exception ex)
                {
                    this._finished = true;
                    this._succeeded = false;

                    await Task.Delay(60000);

                    this._updaters.Clear();
                    this._currentPhase = Phase.None;
                    this._message = "";
                    this._finished = false;
                    this._succeeded = false;

                    throw;
                }

                return true;
            }
        }
    }
}
