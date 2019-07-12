//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using MopidyFinder.Models.Albums;
//using MopidyFinder.Models.Bases;
//using MopidyFinder.Models.Genres;
//using MopidyFinder.Models.Mopidies;
//using MopidyFinder.Models.Mopidies.Methods;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace MopidyFinder.Models.Tracks
//{
//    public class TrackStore : StoreBase<Track>
//    {
//        public TrackStore([FromServices] Dbc dbc) : base(dbc)
//        {
//        }

//        private Dictionary<string, Albums.Album> AlbumCache
//            = new Dictionary<string, Albums.Album>();
//        private Dictionary<string, Genre> GenreCache
//            = new Dictionary<string, Genre>();
//        private Dictionary<string, Artists.Artist> ArtistCache
//            = new Dictionary<string, Artists.Artist>();

//        private Track Create(Mopidies.Track mopidyTrack)
//        {
//            var album = this.GetAlbumByUri(mopidyTrack.Album.Uri);
//            var genre = this.GetGenreByName(mopidyTrack.Genre);
//            var artists = (mopidyTrack.Artists == null)
//                ? new List<Artists.Artist>()
//                : this.GetArtistListByMopidyList(mopidyTrack.Artists);
//            var composers = (mopidyTrack.Composers == null)
//                ? new List<Artists.Artist>()
//                : this.GetArtistListByMopidyList(mopidyTrack.Composers);
//            var performers = (mopidyTrack.Performers == null)
//                ? new List<Artists.Artist>()
//                : this.GetArtistListByMopidyList(mopidyTrack.Performers);

//            var track = this.Dbc.Tracks.FirstOrDefault(e => e.Uri == mopidyTrack.Uri);
//            if (track != null)
//            {
//                track.Album = album;
//                track.Genre = genre;
//                track.Artists = artists;
//                track.Composers = composers;
//                track.Performers = performers;
//            }
//            else
//            {
//                track = new Track()
//                {
//                    Name = mopidyTrack.Name,
//                    LowerName = mopidyTrack.Name.ToLower(),
//                    Uri = mopidyTrack.Uri,
//                    TrackNo = mopidyTrack.TrackNo,
//                    DiscNo = mopidyTrack.DiscNo,
//                    Length = mopidyTrack.Length,
//                    Date = mopidyTrack.Date,
//                    Comment = mopidyTrack.Comment,
//                    BitRate = mopidyTrack.BitRate,
//                    LastModified = mopidyTrack.LastModified,
//                    AlbumId = album.Id,
//                    GenreId = genre.Id,
//                    Album = album,
//                    Genre = genre,
//                    Artists = artists,
//                    Composers = composers,
//                    Performers = performers
//                };

//                track.TrackArtists = (0 < artists.Count())
//                    ? artists.Select(e => new Relations.TrackArtist()
//                    {
//                        TrackId = track.Id,
//                        ArtistId = e.Id
//                    }).ToList()
//                    : new List<Relations.TrackArtist>();
//                track.TrackComposers = (0 < composers.Count())
//                    ? composers.Select(e => new Relations.TrackComposer()
//                    {
//                        TrackId = track.Id,
//                        ComposerId = e.Id
//                    }).ToList()
//                    : new List<Relations.TrackComposer>();
//                track.TrackPerformers = (0 < performers.Count())
//                    ? performers.Select(e => new Relations.TrackPerformer()
//                    {
//                        TrackId = track.Id,
//                        PerformerId = e.Id
//                    }).ToList()
//                    : new List<Relations.TrackPerformer>();

//                foreach (var tr in track.TrackArtists)
//                    this.Dbc.TrackArtists.Add(tr);
//                foreach (var tc in track.TrackComposers)
//                    this.Dbc.TrackComposers.Add(tc);
//                foreach (var tp in track.TrackPerformers)
//                    this.Dbc.TrackPerformers.Add(tp);

//                this.Dbc.Tracks.Add(track);
//                this.Dbc.SaveChanges();
//            }

//            return track;
//        }

//        private Albums.Album GetAlbumByUri(string uri)
//        {
//            if (string.IsNullOrEmpty(uri))
//                return null;

//            if (this.AlbumCache.ContainsKey(uri))
//            {
//                return this.AlbumCache[uri];
//            }
//            else
//            {
//                var album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == uri);
//                this.AlbumCache.Add(uri, album);

//                return album;
//            }
//        }

//        private Genre GetGenreByName(string name)
//        {
//            if (string.IsNullOrEmpty(name))
//                return null;

//            if (this.GenreCache.ContainsKey(name))
//            {
//                return this.GenreCache[name];
//            }
//            else
//            {
//                var genre = this.Dbc.Genres.FirstOrDefault(e => e.Name == name);
//                this.GenreCache.Add(name, genre);

//                return genre;
//            }
//        }

//        private Artists.Artist GetArtistByUri(string uri)
//        {
//            if (string.IsNullOrEmpty(uri))
//                return null;

//            if (this.ArtistCache.ContainsKey(uri))
//            {
//                return this.ArtistCache[uri];
//            }
//            else
//            {
//                var artist = this.Dbc.Artists.FirstOrDefault(e => e.Uri == uri);
//                if (artist != null)
//                    this.ArtistCache.Add(uri, artist);

//                return artist;
//            }
//        }

//        private List<Artists.Artist> GetArtistListByMopidyList(List<Mopidies.Artist> mpArtists)
//        {
//            var result = new List<Artists.Artist>();
//            foreach (var mpArtist in mpArtists)
//            {
//                var artist = this.GetArtistByUri(mpArtist.Uri);
//                if (artist != null)
//                    result.Add(artist);
//            }

//            return result;
//        }

//        private Track Create(TlTrack mopidyTlTrack)
//        {
//            var result = this.Create(mopidyTlTrack.Track);
//            result.TlId = mopidyTlTrack.TlId;

//            return result;
//        }

//        public async Task<List<Track>> GetTracksByAlbum(Albums.Album album)
//        {
//            var tracks = this.Dbc.GetTrackQuery()
//                .Where(e => e.AlbumId == album.Id)
//                .OrderBy(e => e.DiscNo)
//                .ThenBy(e => e.TrackNo)
//                .ToList();

//            if (0 < tracks.Count())
//            {
//                foreach (var track in tracks)
//                {
//                    track.Artists = track.TrackArtists.Select(e => e.Artist).ToList();
//                    track.Composers = track.TrackComposers.Select(e => e.Composer).ToList();
//                    track.Performers = track.TrackPerformers.Select(e => e.Performer).ToList();
//                }

//                return tracks;
//            }
//            else
//            {
//                var refs = await Library.Browse(album.Uri);
//                var trackUris = refs
//                    .Where(e => e.Type == Ref.TypeTrack)
//                    .Select(e => e.Uri)
//                    .ToArray();

//                if (trackUris.Length <= 0)
//                    return new List<Track>();

//                var mopidyTracks = await Library.Lookup(trackUris);

//                if (mopidyTracks == null || mopidyTracks.Count() <= 0)
//                    return new List<Track>();

//                var result = mopidyTracks
//                    .Select(mt => this.Create(mt))
//                    .OrderBy(e => e.TrackNo)
//                    .ToList();

//                return result;
//            }
//        }

        

//        public Task<bool> ClearList()
//            => Tracklist.Clear();

//        public async Task<List<Track>> SetListByUris(string[] uris)
//        {
//            var tlTracks = await Tracklist.Add(uris);
//            var result = tlTracks
//                .Select(mtt => this.Create(mtt))
//                .ToList();

//            return result;
//        }

//        public async Task<List<Track>> GetList()
//        {
//            var tlTracks = await Tracklist.GetTlTracks();
//            var result = tlTracks
//                .Select(mtt => this.Create(mtt))
//                .ToList();

//            return result;
//        }

//        public async Task<Track> GetCurrentTrack()
//        {
//            var tlTrack = await Playback.GetCurrentTlTrack();
//            return (tlTrack == null)
//                ? null
//                : this.Create(tlTrack);
//        }

//        public void Refresh()
//        {
//            var albums = this.Dbc.Albums.ToArray();
//            foreach (var album in albums)
//            {
//                var refs = Library.Browse(album.Uri)
//                    .GetAwaiter()
//                    .GetResult();

//                var trackUris = refs
//                    .Where(e => e.Type == Ref.TypeTrack)
//                    .Select(e => e.Uri)
//                    .ToArray();

//                if (trackUris.Length <= 0)
//                    continue;

//                var mopidyTracks = Library.Lookup(trackUris)
//                    .GetAwaiter()
//                    .GetResult();

//                if (mopidyTracks == null || mopidyTracks.Count() <= 0)
//                    continue;

//                var tracks = mopidyTracks
//                    .Select(mt => this.CreateTrack(mt))
//                    .OrderBy(e => e.TrackNo)
//                    .ToArray();

//                foreach (var track in tracks)
//                {
//                    foreach (var tr in track.TrackArtists)
//                        this.Dbc.TrackArtists.Add(tr);
//                    foreach (var tc in track.TrackComposers)
//                        this.Dbc.TrackComposers.Add(tc);
//                    foreach (var tp in track.TrackPerformers)
//                        this.Dbc.TrackPerformers.Add(tp);

//                    this.Dbc.Tracks.Add(track);
//                }
//            }

//            this.Dbc.SaveChanges();
//        }


//        private Track CreateTrack(Mopidies.Track mopidyTrack)
//        {
//            var album = this.GetAlbumByUri(mopidyTrack.Album.Uri);
//            var genre = this.GetGenreByName(mopidyTrack.Genre);
//            if (genre == null)
//            {
//                var genreAlbum = this.Dbc.GenreAlbums
//                    .Include(e => e.Genre)
//                    .FirstOrDefault(e => e.AlbumId == album.Id);
//                if (genreAlbum != null)
//                    genre = genreAlbum.Genre;
//            }
//            var artists = (mopidyTrack.Artists == null)
//                ? new List<Artists.Artist>()
//                : this.GetArtistListByMopidyList(mopidyTrack.Artists);
//            var composers = (mopidyTrack.Composers == null)
//                ? new List<Artists.Artist>()
//                : this.GetArtistListByMopidyList(mopidyTrack.Composers);
//            var performers = (mopidyTrack.Performers == null)
//                ? new List<Artists.Artist>()
//                : this.GetArtistListByMopidyList(mopidyTrack.Performers);

//            var track = new Track()
//            {
//                Name = mopidyTrack.Name,
//                LowerName = mopidyTrack.Name.ToLower(),
//                Uri = mopidyTrack.Uri,
//                TrackNo = mopidyTrack.TrackNo,
//                DiscNo = mopidyTrack.DiscNo,
//                Length = mopidyTrack.Length,
//                Date = mopidyTrack.Date,
//                Comment = mopidyTrack.Comment,
//                BitRate = mopidyTrack.BitRate,
//                LastModified = mopidyTrack.LastModified,
//                AlbumId = album.Id,
//                GenreId = (genre != null)
//                    ? (int?)genre.Id
//                    : null,
//                Album = album,
//                Genre = genre,
//                Artists = artists,
//                Composers = composers,
//                Performers = performers
//            };

//            track.TrackArtists = (0 < artists.Count())
//                ? artists.Select(e => new Relations.TrackArtist()
//                {
//                    TrackId = track.Id,
//                    ArtistId = e.Id
//                }).ToList()
//                : new List<Relations.TrackArtist>();
//            track.TrackComposers = (0 < composers.Count())
//                ? composers.Select(e => new Relations.TrackComposer()
//                {
//                    TrackId = track.Id,
//                    ComposerId = e.Id
//                }).ToList()
//                : new List<Relations.TrackComposer>();
//            track.TrackPerformers = (0 < performers.Count())
//                ? performers.Select(e => new Relations.TrackPerformer()
//                {
//                    TrackId = track.Id,
//                    PerformerId = e.Id
//                }).ToList()
//                : new List<Relations.TrackPerformer>();

//            return track;
//        }


//        protected override void Dispose(bool disposing)
//        {
//            if (!this.IsDisposed)
//            {
//                if (disposing)
//                {
//                    this.AlbumCache.Clear();
//                    this.AlbumCache = null;
//                    this.GenreCache.Clear();
//                    this.GenreCache = null;
//                }

//                this.IsDisposed = true;
//            }

//            base.Dispose(disposing);
//        }
//    }
//}
