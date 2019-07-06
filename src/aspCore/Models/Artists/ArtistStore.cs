using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
using System;
using System.Linq;

namespace MusicFront.Models.Artists
{
    public class ArtistStore : PagenagedStoreBase<Artist>
    {
        private const string QueryString = "local:directory?type=artist";

        public ArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Artist Get(int artistId)
            => this.Dbc.GetArtistQuery().FirstOrDefault(e => e.Id == artistId);

        public PagenatedResult GetPagenatedList(int[] genreIds, int? page)
        {
            var query = this.Dbc.GetArtistQuery();

            if (genreIds != null && 0 < genreIds.Length)
                query = query
                    .Where(e => e.GenreArtists.Any(e2 => genreIds.Contains(e2.GenreId)));

            var totalLength = query.Count();

            query = query.OrderBy(e => e.LowerName);

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
            this.Dbc.Artists.RemoveRange(this.Dbc.Artists);
            this.Dbc.SaveChanges();

            var result = Library.Browse(ArtistStore.QueryString)
                .GetAwaiter()
                .GetResult();

            var artists = result.Select(e => new Artist()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this.Dbc.Artists.AddRange(artists);
            this.Dbc.SaveChanges();
        }
    }
}
