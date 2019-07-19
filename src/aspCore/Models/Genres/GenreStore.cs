using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Genres
{
    public class GenreStore : PagenagedStoreBase<Genre>, IRefreshable
    {
        public class PagenagedQueryArgs
        {
            public string FilterText { get; set; }
            public int? Page { get; set; }
        }

        private const string QueryString = "local:directory?type=genre";

        public GenreStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Genre Get(int genreId)
            => this.Dbc.GetGenreQuery().FirstOrDefault(e => e.Id == genreId);

        public PagenatedResult GetPagenatedList(PagenagedQueryArgs args)
        {
            var query = this.Dbc.GetGenreQuery();

            if (!string.IsNullOrEmpty(args.FilterText))
                query = query
                    .Where(e => e.LowerName.Contains(args.FilterText.ToLower()));

            var totalLength = query.Count();

            query = query.OrderBy(e => e.LowerName);

            if (args.Page != null)
                query = query
                    .Skip(((int)args.Page - 1) * this.PageLength)
                    .Take(this.PageLength);


            var array = query.ToArray();

            var result = new PagenatedResult()
            {
                TotalLength = totalLength,
                ResultLength = array.Length,
                ResultPage = args.Page,
                ResultList = array
            };

            return result;
        }


        private decimal _refreshLength = 0;
        private decimal _refreshed = 0;
        public decimal RefreshProgress
        {
            get
            {
                return (this._refreshLength <= 0)
                    ? 0
                    : (this._refreshLength <= this._refreshed)
                        ? 1
                        : (this._refreshed / this._refreshLength);
            }
        }

        public async Task<bool> Refresh()
        {
            this._refreshLength = 0;
            this._refreshed = 0;

            var result = await Library.Browse(GenreStore.QueryString);

            var genres = result.Select(e => new Genre()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this._refreshLength = genres.Length;

            this.Dbc.Genres.AddRange(genres);

            this._refreshed = this._refreshLength;

            return true;
        }
    }
}
