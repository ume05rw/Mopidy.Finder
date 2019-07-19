using Microsoft.Extensions.DependencyInjection;
using MopidyFinder.Models.Albums;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Genres;
using MopidyFinder.Models.Relations;
using MopidyFinder.Models.Tracks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace MopidyFinder.Models
{
    public class Initializer
    {
        private static IServiceProvider Provider = null;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            Initializer.Provider = provider;
        }

        public static void ReleaseServiceProvider()
        {
            Initializer.Provider = null;
        }

        private decimal _progress = 0;
        private string _process = "";

        public async Task<bool> Exec(bool force = false)
        {
            using (var serviceScope = Initializer.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var albumStore = new AlbumStore(dbc))
            using (var artistStore = new ArtistStore(dbc))
            using (var genreStore = new GenreStore(dbc))
            using (var artistAlbumStore = new ArtistAlbumStore(dbc))
            using (var genreAlbumStore = new GenreAlbumStore(dbc))
            using (var genreArtistStore = new GenreArtistStore(dbc))
            {
                try
                {
                    if (
                        force == false
                        &&dbc.Albums.FirstOrDefault() != null
                        && dbc.Artists.FirstOrDefault() != null
                        && dbc.Genres.FirstOrDefault() != null
                        && dbc.ArtistAlbums.FirstOrDefault() != null
                        && dbc.GenreArtists.FirstOrDefault() != null
                        && dbc.GenreAlbums.FirstOrDefault() != null
                    )
                    {
                        return true;
                    }

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

                    // 一つずつ順次実行する。並行するとDB書き込みが落ちる。
                    await albumStore.Refresh();
                    await artistStore.Refresh();
                    await genreStore.Refresh();
                    dbc.SaveChanges();

                    await artistAlbumStore.Refresh();
                    await genreAlbumStore.Refresh();
                    dbc.SaveChanges();

                    genreArtistStore.Refresh();
                    dbc.SaveChanges();

                    // 投げっぱなしにする。
                    this.UpdateAlbumImage();
                }
                catch (Exception ex)
                {
                    throw;
                }

                return true;
            }
        }

        public async Task<bool> UpdateAlbumImage()
        {
            using (var serviceScope = Initializer.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var albumStore = new AlbumStore(dbc))
            {
                await albumStore.UpdateAlbumImages();
            }

            return true;
        }
    }
}
