using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Artists
{
    public class ArtistStore : PagenagedStoreBase<Artist>
    {
        public class PagenagedQueryArgs
        {
            public int[] GenreIds { get; set; }
            public string FilterText { get; set; }
            public int? Page { get; set; }
        }

        private const string QueryString = "local:directory?type=artist";

        public ArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
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

        public async Task<bool> Refresh()
        {
            var result = await Library.Browse(ArtistStore.QueryString);

            var artists = result.Select(e => new Artist()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this.Dbc.Artists.AddRange(artists);

            return true;
        }
    }
}
