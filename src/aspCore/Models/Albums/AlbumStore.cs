using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            var query = this.Dbc.GetAlbumQuery();

            if (genreIds != null && 0 < genreIds.Length)
                query = query
                    .Where(e => e.GenreAlbums.Any(e2 => genreIds.Contains(e2.GenreId)));

            if (artistIds != null && 0 < artistIds.Length)
                query = query
                    .Where(e => e.ArtistAlbums.Any(e2 => artistIds.Contains(e2.ArtistId)));

            // アーティスト名順にしようとしたが、クエリが重い上に
            // Artists.Orderby(e => e.Name)と順序が異なるため、とりやめ。
            //var joinedAll = query
            //    .Join(
            //        this.Dbc.ArtistAlbums,
            //        al => al.Id,
            //        aa => aa.AlbumId,
            //        (al, aa) => new {
            //            Album = al,
            //            ArtistAlbum = aa
            //        }
            //    )
            //    .Join(
            //        this.Dbc.Artists,
            //        al => al.ArtistAlbum.ArtistId,
            //        at => at.Id,
            //        (al, at) => new {
            //            Album = al.Album,
            //            Artist = at
            //        }
            //    )
            //    .GroupBy(e => e.Album.Id)
            //    .Select(e => new {
            //        Album = e.First().Album,
            //        ArtistName = e.Min(e3 => e3.Artist.Name)
            //    })
            //    .OrderBy(e => e.ArtistName)
            //    .ThenBy(e => e.Album.Year)
            //    .ThenBy(e => e.Album.Name)
            //    .ToArray();

            //var totalLength = joinedAll.Length;

            //var array = (page != null)
            //    ? joinedAll
            //        .Skip(((int)page - 1) * this.PageLength)
            //        .Take(this.PageLength)
            //        .Select(e => e.Album)
            //        .ToArray()
            //    : joinedAll
            //        .Select(e => e.Album)
            //        .ToArray();

            var totalLength = query.Count();

            query = query
                .OrderBy(e => e.Year)
                .ThenBy(e => e.Name);

            if (page != null)
            {
                query = query
                    .Skip(((int)page - 1) * this.PageLength)
                    .Take(this.PageLength);
            }

            var array = query.ToArray();

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
