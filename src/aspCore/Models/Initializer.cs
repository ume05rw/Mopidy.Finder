using Microsoft.Extensions.DependencyInjection;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Relations;
using System;
using System.Linq;

namespace MusicFront.Models
{
    public static class Initializer
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


        public static void Exec(bool force = false)
        {
            using (var serviceScope = Initializer.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
            using (var albumStore = serviceScope.ServiceProvider.GetService<AlbumStore>())
            using (var artistStore = serviceScope.ServiceProvider.GetService<ArtistStore>())
            using (var genreStore = serviceScope.ServiceProvider.GetService<GenreStore>())
            using (var artistAlbumStore = serviceScope.ServiceProvider.GetService<ArtistAlbumStore>())
            using (var genreAlbumStore = serviceScope.ServiceProvider.GetService<GenreAlbumStore>())
            using (var genreArtistStore = serviceScope.ServiceProvider.GetService<GenreArtistStore>())
            {
                try
                {
                    // 一つずつ順次実行する。並行するとDB書き込みが落ちる。
                    if (force || dbc.Albums.FirstOrDefault() == null)
                        albumStore.Refresh();
                    if (force || dbc.Artists.FirstOrDefault() == null)
                        artistStore.Refresh();
                    if (force || dbc.Genres.FirstOrDefault() == null)
                        genreStore.Refresh();

                    if (force || dbc.ArtistAlbums.FirstOrDefault() == null)
                        artistAlbumStore.Refresh();
                    if (force || dbc.GenreAlbums.FirstOrDefault() == null)
                        genreAlbumStore.Refresh();

                    if (force || dbc.GenreArtists.FirstOrDefault() == null)
                        genreArtistStore.Refresh();

                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }
}
