using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Genres
{
    public class GenreStore : PagenagedStoreBase<Genre>, IMopidyScannable
    {
        public class PagenagedQueryArgs
        {
            public string FilterText { get; set; }
            public int? Page { get; set; }
        }

        private const string QueryString = "local:directory?type=genre";

        private Library _library;

        public GenreStore(
            [FromServices] Dbc dbc,
            [FromServices] Library library
        ) : base(dbc)
        {
            this._library = library;
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


        private decimal _processLength = 0;
        private decimal _processed = 0;
        public decimal ScanProgress
        {
            get
            {
                return (this._processLength <= 0)
                    ? 0
                    : (this._processLength <= this._processed)
                        ? 1
                        : (this._processed / this._processLength);
            }
        }

        public async Task<int> Scan()
        {
            this._processLength = 0;
            this._processed = 0;

            var result = await this._library.Browse(GenreStore.QueryString);
            var existsUris = this.Dbc.Genres.Select(e => e.Uri).ToArray();
            var newRefs = result.Where(e => !existsUris.Contains(e.Uri)).ToArray();
            this._processLength = newRefs.Length;

            var newEntities = newRefs.Select(e => new Genre()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();
            
            this.Dbc.Genres.AddRange(newEntities);
            this._processed = newEntities.Length;

            return newEntities.Length;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this._library = null;
            }

            base.Dispose(disposing);
        }
    }
}
