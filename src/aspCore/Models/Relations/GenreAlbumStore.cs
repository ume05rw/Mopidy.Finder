using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.Genres;
using MusicFront.Models.Mopidies;
using MusicFront.Models.Mopidies.Methods;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Relations
{
    public class GenreAlbumStore : StoreBase<GenreAlbum>
    {
        public GenreAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            var genres = this.Dbc.Genres.ToList();
            var albumDictionary = this.Dbc.Albums
                .ToDictionary(e => e.Uri);

            foreach (var genre in this.Dbc.Genres.ToArray())
            {
                var refs = await Library.Browse(genre.Uri);

                foreach (var row in refs)
                {
                    var albumUri = row.GetAlbumUri();
                    if (albumUri == null)
                        continue; // アルバムURIが取得出来ないことは無いはず。

                    if (!albumDictionary.ContainsKey(albumUri))
                        continue; // 合致するアルバムが取得出来ないことは無いはず

                    this.Dbc.GenreAlbums.Add(new GenreAlbum()
                    {
                        GenreId = genre.Id,
                        AlbumId = albumDictionary[albumUri].Id
                    });
                }
            }

            return true;
        }
    }
}
