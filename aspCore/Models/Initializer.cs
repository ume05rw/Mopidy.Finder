using Microsoft.Extensions.DependencyInjection;
using MusicFront.Models;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Relations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.a.Models
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


        public async Task<bool> Exec()
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
                var tasks = new List<Task<bool>>();
                if (dbc.Albums.FirstOrDefault() == null)
                    tasks.Add(albumStore.Refresh());
                if (dbc.Artists.FirstOrDefault() == null)
                    tasks.Add(artistStore.Refresh());
                if (dbc.Genres.FirstOrDefault() == null)
                    tasks.Add(genreStore.Refresh());

                await Task.WhenAll(tasks);
                tasks.Clear();

                if (dbc.ArtistAlbums.FirstOrDefault() == null)
                    tasks.Add(artistAlbumStore.Refresh());
                if (dbc.GenreAlbums.FirstOrDefault() == null)
                    tasks.Add(genreAlbumStore.Refresh());

                await Task.WhenAll(tasks);
                tasks.Clear();

                if (dbc.ArtistAlbums.FirstOrDefault() == null)
                    tasks.Add(artistAlbumStore.Refresh());

                await Task.WhenAll(tasks);
            }

            return true;
        }
    }
}
