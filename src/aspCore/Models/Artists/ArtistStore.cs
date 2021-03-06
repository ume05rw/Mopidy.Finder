using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Artists
{
    public class ArtistStore : PagenagedStoreBase<Artist>, IMopidyScannable
    {
        public class PagenagedQueryArgs
        {
            public int[] GenreIds { get; set; }
            public string FilterText { get; set; }
            public int? Page { get; set; }
        }

        private const string QueryString = "local:directory?type=artist";

        private Library _library;

        public ArtistStore(
            [FromServices] Dbc dbc,
            [FromServices] Library library
        ) : base(dbc)
        {
            this._library = library;
        }

        public Artist Get(int artistId)
            => this.Dbc.GetArtistQuery().FirstOrDefault(e => e.Id == artistId);

        public PagenatedResult GetPagenatedList(PagenagedQueryArgs args)
        {
            var query = this.Dbc.GetArtistQuery();

            if (args.GenreIds != null && 0 < args.GenreIds.Length)
                query = query
                    .Where(e => e.GenreArtists.Any(e2 => args.GenreIds.Contains(e2.GenreId)));

            if (!string.IsNullOrEmpty(args.FilterText))
                query = query
                    .Where(e => e.LowerName.Contains(args.FilterText.ToLower()));

            var totalLength = query.Count();

            query = query.OrderBy(e => e.LowerName);

            if (args.Page != null)
            {
                query = query
                    .Skip(((int)args.Page - 1) * this.PageLength)
                    .Take(this.PageLength);
            }

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

        public async Task<IEntity[]> Scan(Dbc dbc)
        {
            this._processLength = 0;
            this._processed = 0;

            var allRefs = await this._library.Browse(ArtistStore.QueryString);
            var existsUris = dbc.Artists.Select(e => e.Uri).ToArray();
            var newEntities = allRefs.Where(e => !existsUris.Contains(e.Uri))
                .Select(e => new Artist()
                {
                    Name = e.Name,
                    LowerName = e.Name.ToLower(),
                    Uri = e.Uri
                }).ToArray();

            this._processLength = newEntities.Length;
            this._processed = this._processLength;

            if (0 < newEntities.Length)
                dbc.Artists.AddRange(newEntities);

            return newEntities;
        }

        protected override void Dispose(bool disposing)
        {
            if (!this.IsDisposed && disposing)
            {
                this._library = null;
            }
            base.Dispose(disposing);
        }
    }
}
