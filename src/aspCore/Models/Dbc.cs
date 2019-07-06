using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Albums;
using MusicFront.Models.Artists;
using MusicFront.Models.Genres;
using MusicFront.Models.Relations;
using MusicFront.Models.Tracks;
using System.Linq;
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
        public DbSet<Track> Tracks { get; set; }
        public DbSet<ArtistAlbum> ArtistAlbums { get; set; }
        public DbSet<GenreAlbum> GenreAlbums { get; set; }
        public DbSet<GenreArtist> GenreArtists { get; set; }
        public DbSet<TrackArtist> TrackArtists { get; set; }
        public DbSet<TrackComposer> TrackComposers { get; set; }
        public DbSet<TrackPerformer> TrackPerformers { get; set; }

        public IQueryable<Genre> GetGenreQuery()
            => this.Genres
                .Include(e => e.GenreAlbums)
                .Include(e => e.GenreArtists);

        public IQueryable<Album> GetAlbumQuery()
            => this.Albums
                .Include(e => e.GenreAlbums)
                .Include(e => e.ArtistAlbums);

        public IQueryable<Artist> GetArtistQuery()
            => this.Artists
                .Include(e => e.GenreArtists)
                .Include(e => e.ArtistAlbums);

        public IQueryable<Track> GetTrackQuery()
            => this.Tracks
                .Include(e => e.Genre)
                .Include(e => e.Album)
                .Include(e => e.TrackArtists)
                    .ThenInclude(e2 => e2.Artist)
                .Include(e => e.TrackComposers)
                    .ThenInclude(e2 => e2.Composer)
                .Include(e => e.TrackPerformers)
                    .ThenInclude(e2 => e2.Performer);

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
            modelBuilder.Entity<Track>()
                .HasIndex(e => e.Uri);
            modelBuilder.Entity<Track>()
                .HasIndex(e => e.AlbumId);
            modelBuilder.Entity<Track>()
                .HasIndex(e => e.Uri);
            modelBuilder.Entity<ArtistAlbum>()
                .HasKey(e => new { e.ArtistId, e.AlbumId });
            modelBuilder.Entity<ArtistAlbum>()
                .HasIndex(e => e.ArtistId);
            modelBuilder.Entity<ArtistAlbum>()
                .HasIndex(e => e.AlbumId);
            modelBuilder.Entity<GenreAlbum>()
                .HasKey(e => new { e.GenreId, e.AlbumId });
            modelBuilder.Entity<GenreAlbum>()
                .HasIndex(e => e.GenreId);
            modelBuilder.Entity<GenreAlbum>()
                .HasIndex(e => e.AlbumId);
            modelBuilder.Entity<GenreArtist>()
                .HasKey(e => new { e.GenreId, e.ArtistId });
            modelBuilder.Entity<GenreArtist>()
                .HasIndex(e => e.GenreId);
            modelBuilder.Entity<GenreArtist>()
                .HasIndex(e => e.ArtistId);
            modelBuilder.Entity<TrackArtist>()
                .HasKey(e => new { e.TrackId, e.ArtistId });
            modelBuilder.Entity<TrackArtist>()
                .HasIndex(e => e.TrackId);
            modelBuilder.Entity<TrackComposer>()
                .HasKey(e => new { e.TrackId, e.ComposerId });
            modelBuilder.Entity<TrackComposer>()
                .HasIndex(e => e.TrackId);
            modelBuilder.Entity<TrackPerformer>()
                .HasKey(e => new { e.TrackId, e.PerformerId });
            modelBuilder.Entity<TrackPerformer>()
                .HasIndex(e => e.TrackId);
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
        public async override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
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

        public override void Dispose()
        {
            Xb.Util.Out("Dbc.Dispose");
            base.Dispose();
        }
    }
}
