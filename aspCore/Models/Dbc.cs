using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Relations;
using System.Threading;
using System.Threading.Tasks;

namespace MusicFront.Models
{
    public class Dbc: DbContext
    {
        private class LockerObject
        {
            public bool IsLocked { get; set; }
        }

        private static LockerObject Locker = new LockerObject();


        public DbSet<Album> Albums { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Artist> Artists { get; set; }
        public DbSet<ArtistAlbum> ArtistAlbums { get; set; }
        public DbSet<GenreAlbum> GenreAlbums { get; set; }
        public DbSet<GenreArtist> GenreArtists { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="options"></param>
        public Dbc(DbContextOptions<Dbc> options)
            : base(options)
        {
            Xb.Util.Out("Dbc.Constructor");
        }

        #region "EfDefinitions"

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Album>()
                .HasIndex(e => e.Uri);
            modelBuilder.Entity<Genre>()
                .HasIndex(e => e.Uri);
            modelBuilder.Entity<Artist>()
                .HasIndex(e => e.Uri);
            modelBuilder.Entity<ArtistAlbum>()
                .HasIndex(e => e.ArtistId);
            modelBuilder.Entity<ArtistAlbum>()
                .HasIndex(e => e.AlbumId);
            modelBuilder.Entity<ArtistAlbum>()
                .HasIndex(e => new { e.ArtistId, e.AlbumId })
                .IsUnique();
            modelBuilder.Entity<GenreAlbum>()
                .HasIndex(e => e.GenreId);
            modelBuilder.Entity<GenreAlbum>()
                .HasIndex(e => e.AlbumId);
            modelBuilder.Entity<GenreAlbum>()
                .HasIndex(e => new { e.GenreId, e.AlbumId })
                .IsUnique();
            modelBuilder.Entity<GenreArtist>()
                .HasIndex(e => e.GenreId);
            modelBuilder.Entity<GenreArtist>()
                .HasIndex(e => e.ArtistId);
            modelBuilder.Entity<GenreArtist>()
                .HasIndex(e => new { e.GenreId, e.ArtistId })
                .IsUnique();
        }

        #endregion

        /// <summary>
        /// SaveChanges
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// SQLiteのとき、マルチスレッドでDBファイル取得に失敗する現象への対応。
        /// </remarks>
        public override int SaveChanges()
        {
            var result = default(int);

            lock (Dbc.Locker)
            {
                Dbc.Locker.IsLocked = true;

                result = base.SaveChanges();

                Dbc.Locker.IsLocked = false;
            }

            return result;
        }

        /// <summary>
        /// SaveChangesAsync
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        /// <remarks>
        /// SQLiteのとき、マルチスレッドでDBファイル取得に失敗する現象への対応。
        /// </remarks>
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            var result = default(Task<int>);

            lock (Dbc.Locker)
            {
                Dbc.Locker.IsLocked = true;

                result = base.SaveChangesAsync(cancellationToken);

                Dbc.Locker.IsLocked = false;
            }

            return result;
        }

        public override void Dispose()
        {
            Xb.Util.Out("Dbc.Dispose");
            base.Dispose();
        }
    }
}
