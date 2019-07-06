using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods;
using System.Collections.Generic;
using System.Linq;

namespace MusicFront.Models.Genres
{
    public class GenreStore : StoreBase<Genre>
    {
        private const string QueryString = "local:directory?type=genre";

        public GenreStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Genre Get(int genreId)
            => this.Dbc.GetGenreQuery().FirstOrDefault(e => e.Id == genreId);

        public List<Genre> GetList()
            => this.Dbc.GetGenreQuery()
                .OrderBy(e => e.LowerName)
                .ToList();

        public void Refresh()
        {
            this.Dbc.Genres.RemoveRange(this.Dbc.Genres);
            this.Dbc.SaveChanges();

            var result = Library.Browse(GenreStore.QueryString)
                .GetAwaiter()
                .GetResult();

            var genres = result.Select(e => new Genre()
            {
                Name = e.Name,
                LowerName = e.Name.ToLower(),
                Uri = e.Uri
            }).ToArray();

            this.Dbc.Genres.AddRange(genres);
            this.Dbc.SaveChanges();
        }
    }
}
