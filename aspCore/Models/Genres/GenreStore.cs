using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Bases;
using MusicFront.Models.Mopidies.Methods.Libraries;
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

        public List<Genre> FindAll(string[] names, int[] ids)
        {
            var query = this.Dbc.GetGenreQuery();
            if (names != null && 0 < names.Length)
                query = query.Where(e => names.All(name => e.LowerName.Contains(name.ToLower())));
            if (ids != null && 0 < ids.Length)
                query = query.Where(e => ids.Contains(e.Id));

            return query.ToList();
        }

        public List<Artists.Artist> GetArtistsByGenre(Genre genre)
            =>  this.Dbc.GetArtistQuery()
                .Where(e => e.GenreArtists.Select(e2 => e2.GenreId).Contains(genre.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public List<Albums.Album> GetAlbumsByGenre(Genre genre)
            =>  this.Dbc.GetAlbumQuery()
                .Where(e => e.GenreAlbums.Select(e2 => e2.GenreId).Contains(genre.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public void Refresh()
        {
            this.Dbc.Genres.RemoveRange(this.Dbc.Genres);
            this.Dbc.SaveChanges();

            var result = Browse.Request(GenreStore.QueryString)
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
