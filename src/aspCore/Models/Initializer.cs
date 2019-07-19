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

namespace MopidyFinder.Models
{
    public class Initializer
    {
        private enum Phazes
        {
            Cleanup = 0,
            Genres = 1,
            Albums = 2,
            Artists = 3,
            ArtistAlbums = 4,
            GenreAlbums = 5,
            GenreArtists = 6
        }

        private class Refresher
        {
            public IRefreshable Store { get; set; }
            public decimal Rate { get; set; }
        }

        public class ProgressStatus
        {
            public bool Finished { get; set; } = false;
            public bool Succeeded { get; set; } = false;
            public decimal Progress { get; set; } = 0;
            public string Process { get; set; } = "No-Status";
        }


        private static IServiceProvider _provider = null;
        private static Initializer _instance = new Initializer();
        public static Initializer Instance => Initializer._instance;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            Initializer._provider = provider;
        }

        public static void ReleaseServiceProvider()
        {
            Initializer._provider = null;
        }


        private Phazes _phaze = Phazes.Genres;
        private bool _finished = false;
        private bool _succeeded = false;
        private string _process = "";
        private Dictionary<Phazes, Refresher> _refreshers
            = new Dictionary<Phazes, Refresher>();

        public bool IsActive
            => !(this._refreshers == null || this._refreshers.Count() <= 0);

        public ProgressStatus GetStatus()
        {
            var result = new ProgressStatus();
            if (this._refreshers == null || this._refreshers.Count() <= 0)
                return result;

            result.Process = this._process;
            result.Finished = this._finished;
            result.Succeeded = this._succeeded;

            var phazeNum = (int)this._phaze;
            for (var i = 0; i < phazeNum; i++)
                result.Progress += this._refreshers[(Phazes)i].Rate;

            var refresher = this._refreshers[this._phaze];
            if (refresher.Store != null)
                result.Progress += refresher.Rate * refresher.Store.RefreshProgress;

            return result;
        }


        public async Task<bool> Exec()
        {
            // 即座に_refreshersに値をセットしておく。
            // 値の存在を基準に動作中か否かを判定しているため。
            this._refreshers.Clear();
            this._refreshers.Add(Phazes.Cleanup, new Refresher()
            {
                Store = null,
                Rate = 5
            });
            this._phaze = Phazes.Cleanup;
            this._process = "Refresh Start.";

            using (var serviceScope = Initializer._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
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
                    this._refreshers.Add(Phazes.Genres, new Refresher()
                    {
                        Store = genreStore,
                        Rate = 5
                    });
                    this._refreshers.Add(Phazes.Albums, new Refresher()
                    {
                        Store = albumStore,
                        Rate = 10
                    });
                    this._refreshers.Add(Phazes.Artists, new Refresher()
                    {
                        Store = artistStore,
                        Rate = 10
                    });
                    this._refreshers.Add(Phazes.ArtistAlbums, new Refresher()
                    {
                        Store = artistAlbumStore,
                        Rate = 30
                    });
                    this._refreshers.Add(Phazes.GenreAlbums, new Refresher()
                    {
                        Store = genreAlbumStore,
                        Rate = 30
                    });
                    this._refreshers.Add(Phazes.GenreArtists, new Refresher()
                    {
                        Store = genreArtistStore,
                        Rate = 10
                    });

                    this._phaze = Phazes.Cleanup;
                    this._process = "Database Cleaning.";
                    dbc.GenreArtists.RemoveRange(dbc.GenreArtists);
                    dbc.GenreAlbums.RemoveRange(dbc.GenreAlbums);
                    dbc.ArtistAlbums.RemoveRange(dbc.ArtistAlbums);
                    dbc.Genres.RemoveRange(dbc.Genres);
                    dbc.Artists.RemoveRange(dbc.Artists);
                    dbc.Albums.RemoveRange(dbc.Albums);
                    dbc.SaveChanges();

                    var res1 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genres';");
                    var res2 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='artists';");
                    var res3 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='albums';");
                    var res4 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='artist_albums';");
                    var res5 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genre_albums';");
                    var res6 = dbc.Database.ExecuteSqlCommand($"DELETE from sqlite_sequence where name='genre_artists';");

                    this._phaze = Phazes.Genres;
                    this._process = "Database Cleaned up. Go Registering Genres.";

                    // 一つずつ順次実行する。進捗が分かるように。
                    await genreStore.Refresh();
                    dbc.SaveChanges();
                    var genreCount = dbc.Genres.Count();

                    this._phaze = Phazes.Albums;
                    this._process = $"{genreCount} Genres Registered. Go Registering Albums.";
                    await albumStore.Refresh();
                    dbc.SaveChanges();
                    var albumCount = dbc.Albums.Count();

                    this._phaze = Phazes.Artists;
                    this._process = $"{albumCount} Albums Registered. Go Registering Artists.";
                    await artistStore.Refresh();
                    dbc.SaveChanges();
                    var artistCount = dbc.Artists.Count();

                    this._phaze = Phazes.ArtistAlbums;
                    this._process = $"{artistCount} Artists Registered. Go Registering Artist-Album Relations.";
                    await artistAlbumStore.Refresh();
                    dbc.SaveChanges();
                    var artistAlbumCount = dbc.ArtistAlbums.Count();

                    this._phaze = Phazes.GenreAlbums;
                    this._process = $"{artistAlbumCount} Artist-Album Relations Registered. Go Registering Genre-Album Relations.";
                    await genreAlbumStore.Refresh();
                    dbc.SaveChanges();
                    var genreAlbumCount = dbc.GenreAlbums.Count();

                    this._phaze = Phazes.GenreArtists;
                    this._process = $"{genreAlbumCount} Genre-Album Relations Registered. Go Registering Genre-Artist Relations.";
                    await genreArtistStore.Refresh();
                    dbc.SaveChanges();
                    var genreArtistCount = dbc.GenreArtists.Count();
                    this._process = $"{genreArtistCount} All Relations Registered. Process Completed.";

                    // 投げっぱなしにする。
                    this.UpdateAlbumImage();

                    this._finished = true;
                    this._succeeded = true;


                    // 完了状態を60秒維持したあと、状態を初期化する。
                    await Task.Delay(60000);

                    this._refreshers.Clear();
                    this._phaze = Phazes.Cleanup;
                    this._process = "";
                    this._finished = false;
                    this._succeeded = false;

                }
                catch (Exception ex)
                {
                    this._finished = true;
                    this._succeeded = false;

                    await Task.Delay(60000);

                    this._refreshers.Clear();
                    this._phaze = Phazes.Cleanup;
                    this._process = "";
                    this._finished = false;
                    this._succeeded = false;

                    throw;
                }

                return true;
            }
        }

        public async Task<bool> UpdateAlbumImage()
        {
            using (var serviceScope = Initializer._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var albumStore = new AlbumStore(dbc))
            {
                await albumStore.UpdateAlbumImages();
            }

            return true;
        }
    }
}
