using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Artists;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : PagenagedStoreBase<Album>
    {
        private const string QueryString = "local:directory?type=album";

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
                .GroupBy(e => e.Album.Id)
                .Select(e => new
                {
                    Album = e.First().Album,
                    ArtistName = e.Min(e2 => e2.Artist.LowerName)
                })
                .OrderBy(e => e.ArtistName)
                .ThenBy(e => e.Album.Year)
                .ThenBy(e => e.Album.LowerName)
                .ToArray();

            var totalLength = joinedAll.Length;

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

        public void Refresh()
        {
            this.Dbc.Albums.RemoveRange(this.Dbc.Albums);
            this.Dbc.SaveChanges();

            var result = Library.Browse(AlbumStore.QueryString)
                .GetAwaiter()
                .GetResult();

            var albums = result.Select(e => new Album()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this.Dbc.Albums.AddRange(albums);
            this.Dbc.SaveChanges();
        }
    }
}
