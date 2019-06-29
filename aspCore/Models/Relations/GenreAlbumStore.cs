using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods.Libraries;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Relations
{
    public class GenreAlbumStore : MopidyStoreBase<GenreAlbum>
    {
        public GenreAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public void Refresh()
        {
            this.Dbc.GenreAlbums.RemoveRange(this.Dbc.GenreAlbums);
            this.Dbc.SaveChanges();

            var genres = this.Dbc.Genres.ToList();

            foreach (var genre in this.Dbc.Genres.ToArray())
                this.AddAlbumsByGenre(genre);

            this.Dbc.SaveChanges();
        }

        private void AddAlbumsByGenre(Genre genre)
        {
            var request = Browse.CreateRequest(genre.Uri);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            foreach (var row in result)
            {
                var albumUri = row.GetAlbumUri();
                if (albumUri == null)
                    throw new Exception($"Album-Uri Not Found: uri={row.Uri}"); // アルバムURIが取得出来ないことは無いはず。

                try
                {
                    var albumId = this.Dbc.Albums
                        .Where(e => e.Uri == albumUri)
                        .Select(e => e.Id)
                        .First();

                    this.Dbc.GenreAlbums.Add(new GenreAlbum()
                    {
                        GenreId = genre.Id,
                        AlbumId = albumId
                    });
                }
                catch (Exception ex)
                {
                    // 合致アルバムが取得出来ないことは無いはず。
                    throw new Exception($"Album Not Matched: uri={albumUri}");
                }
            }
        }
    }
}
