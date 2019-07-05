using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
using System.Linq;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : PagenagedStoreBase<Album>
    {
        private const string QueryString = "local:directory?type=album";

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

            var totalLength = query.Count();

            query = query.OrderBy(e => e.Name);

            if (page != null)
            {
                query = query
                    .Skip(((int)page - 1) * this.PageLength)
                    .Take(this.PageLength);
            }

            var list = query.ToArray();

            var result = new PagenatedResult()
            {
                TotalLength = totalLength,
                ResultLength = list.Length,
                ResultPage = page,
                ResultList = list
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
