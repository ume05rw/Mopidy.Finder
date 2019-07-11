using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Genres
{
    public class GenreStore : PagenagedStoreBase<Genre>
    {
        private const string QueryString = "local:directory?type=genre";

        public GenreStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Genre Get(int genreId)
            => this.Dbc.GetGenreQuery().FirstOrDefault(e => e.Id == genreId);

        public PagenatedResult GetPagenatedList(int? page)
        {
            var query = this.Dbc.GetGenreQuery();

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

        public async Task<bool> Refresh()
        {
            var result = await Library.Browse(GenreStore.QueryString);

            var genres = result.Select(e => new Genre()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this.Dbc.Genres.AddRange(genres);

            return true;
        }
    }
}
