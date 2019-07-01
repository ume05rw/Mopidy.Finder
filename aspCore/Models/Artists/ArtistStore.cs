using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicFront.Models.Albums;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.Mopidies.Methods;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MusicFront.Models.Artists
{
    public class ArtistStore : StoreBase<Artist>
    {
        private const string QueryString = "local:directory?type=artist";

        public ArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Artist Get(int artistId)
            => this.Dbc.GetArtistQuery().FirstOrDefault(e => e.Id == artistId);

        public List<Artist> GetList(string[] names, int[] ids)
        {
            var query = this.Dbc.GetArtistQuery();
            if (names != null && 0 < names.Length)
                query = query.Where(e => names.All(name => e.LowerName.Contains(name.ToLower())));
            if (ids != null && 0 < ids.Length)
                query = query.Where(e => ids.Contains(e.Id));

            return query.ToList();
        }

        public List<Artist> GetListByGenre(Genre genre)
            => this.Dbc.GetArtistQuery()
                .Where(e => e.GenreArtists.Select(e2 => e2.GenreId).Contains(genre.Id))
                .OrderBy(e => e.Name)
                .ToList();

        public List<Artist> GetListByAlbum(Album album)
            => this.Dbc.GetArtistQuery()
                .Where(e => e.ArtistAlbums.Select(e2 => e2.AlbumId).Contains(album.Id))
                .OrderBy(e => e.Name)
                .ToList();

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
