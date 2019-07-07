using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
using MusicFront.Models.Tracks;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : PagenagedStoreBase<Album>
    {
        private const string AlbumQueryString = "local:directory?type=album";
        private const string YearQueryString = "local:directory?type=date&format=%25Y";

        private readonly int AlbumPageLength = 10;

        public AlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Album Get(int genreId)
            => this.Dbc.GetAlbumQuery().FirstOrDefault(e => e.Id == genreId);

        public PagenatedResult GetPagenatedList(int[] genreIds, int[] artistIds, int? page)
        {
            var query = this.Dbc.GetArtistQuery();

            if (genreIds != null && 0 < genreIds.Length)
                query = query
                    .Where(e => e.GenreArtists.Any(e2 => genreIds.Contains(e2.GenreId)));

            if (artistIds != null && 0 < artistIds.Length)
                query = query
                    .Where(e => e.ArtistAlbums.Any(e2 => artistIds.Contains(e2.ArtistId)));

            var joinedAll = query
                .Join(
                    this.Dbc.ArtistAlbums,
                    artist => artist.Id,
                    artistAlbum => artistAlbum.ArtistId,
                    (artist, artistAlbum) => new
                    {
                        Artist = artist,
                        ArtistAlbum = artistAlbum
                    }
                )
                .Join(
                    this.Dbc.Albums,
                    entity => entity.ArtistAlbum.AlbumId,
                    album => album.Id,
                    (entity, album) => new
                    {
                        Artist = entity.Artist,
                        Album = album
                    }
                )
                //.GroupBy(e => e.Album.Id)
                //.Select(e => new
                //{
                //    Album = e.First().Album,
                //    ArtistName = e.Min(e2 => e2.Artist.LowerName)
                //})
                //.OrderBy(e => e.ArtistName)
                //.ThenBy(e => e.Album.Year)
                //.ThenBy(e => e.Album.LowerName)
                .OrderBy(e => e.Artist.LowerName)
                .ThenBy(e => e.Album.Year)
                .ThenBy(e => e.Album.LowerName);

            var totalLength = joinedAll.Count();

            var array = (page != null)
                ? joinedAll
                    .Skip(((int)page - 1) * this.PageLength)
                    .Take(this.PageLength)
                    .Select(e => e.Album)
                    .ToArray()
                : joinedAll
                    .Select(e => e.Album)
                    .ToArray();

            var result = new PagenatedResult()
            {
                TotalLength = totalLength,
                ResultLength = array.Length,
                ResultPage = page,
                ResultList = array
            };

            return result;
        }

        public async Task<bool> CompleteAlbumInfo(List<AlbumTracks.AlbumTracks> albumTracksList)
        {
            var isImageUpdated = await this.CompleteImages(albumTracksList);
            var isYearUpdated = this.CompleteYears(albumTracksList);

            if (isImageUpdated || isYearUpdated)
                this.Dbc.SaveChanges();

            return true;
        }

        private async Task<bool> CompleteImages(List<AlbumTracks.AlbumTracks> albumTracksList)
        {
            var targetDictionary = albumTracksList
                .Where(e => string.IsNullOrEmpty(e.Album.ImageUri))
                .Select(e => e.Album)
                .ToDictionary(e => e.Uri);

            if (targetDictionary.Count() <= 0)
                return false;

            var hasUpdated = false;
            var imageDictionary = await Library.GetImages(targetDictionary.Keys.ToArray());

            foreach (var pair in imageDictionary)
            {
                if (!targetDictionary.ContainsKey(pair.Key))
                    continue;

                var album = targetDictionary[pair.Key];
                album.ImageUri = pair.Value.Uri;
                this.Dbc.Entry(album).State = EntityState.Modified;
                hasUpdated = true;
            }

            return hasUpdated;
        }

        private bool CompleteYears(List<AlbumTracks.AlbumTracks> albumTracksList)
        {
            var hasUpdated = false;
            foreach (var at in albumTracksList)
            {
                if (at.Album.Year != null)
                    continue;

                var date = at.Tracks.Max(e => e.Date);
                if (date != null && 4 < date.Length)
                    date = date.Substring(0, 4);

                if (date != null && int.TryParse(date, out var year))
                {
                    at.Album.Year = year;
                    this.Dbc.Entry(at.Album).State = EntityState.Modified;
                    hasUpdated = true;
                }
            }

            return hasUpdated;
        }

        public async Task<bool> Refresh()
        {
            var albumResults = await Library.Browse(AlbumStore.AlbumQueryString);

            var albumDictionary = albumResults.Select(e => new Album()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToDictionary(e => e.Uri);

            var yearResults = await Library.Browse(AlbumStore.YearQueryString);

            foreach (var row in yearResults)
            {
                var year = default(int);
                if (!int.TryParse(row.Name, out year))
                    continue;

                var yearAlbums = await Library.Browse(row.Uri);

                foreach (var ya in yearAlbums)
                {
                    var albumUri = ya.GetAlbumUri();
                    if (albumDictionary.ContainsKey(albumUri))
                        albumDictionary[albumUri].Year = year;
                }
            }

            this.Dbc.Albums.AddRange(albumDictionary.Select(e => e.Value));

            return true;
        }

        public async Task<bool> UpdateAlbumImages()
        {
            var albumAllUris = this.Dbc.Albums
                .Where(e => e.ImageUri == null)
                .Select(e => e.Uri)
                .ToArray();

            for (var i = 0; i < albumAllUris.Length; i += 10)
            {
                var albumUris = albumAllUris
                    .Skip(i)
                    .Take(10)
                    .ToArray();

                Debug.WriteLine($"AlbumImage Progress: {i + albumUris.Length } / {albumAllUris.Length}");

                var imageDictionary = await Library.GetImages(albumUris);

                foreach (var pair in imageDictionary)
                {
                    var album = this.Dbc.Albums.FirstOrDefault(e => e.Uri == pair.Key);
                    if (album == null || !string.IsNullOrEmpty(album.ImageUri))
                        continue;

                    album.ImageUri = pair.Value.Uri;
                    this.Dbc.Entry(album).State = EntityState.Modified;
                }

                // 待機時間を挟む。
                await Task.Delay(1000);
            }
            this.Dbc.SaveChanges();

            return true;
        }
    }
}
