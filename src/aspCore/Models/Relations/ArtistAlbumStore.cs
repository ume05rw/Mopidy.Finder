using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies;
using MopidyFinder.Models.Mopidies.Methods;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class ArtistAlbumStore : StoreBase<ArtistAlbum>
    {
        public ArtistAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            var albumDictionary = this.Dbc.Albums
                .ToDictionary(e => e.Uri);

            foreach (var artist in this.Dbc.Artists.ToArray())
            {
                var refs = await Library.Browse(artist.Uri);

                foreach (var row in refs)
                {
                    var albumUri = row.GetAlbumUri();
                    if (albumUri == null)
                        continue; // アルバムURIが取得出来ないことは無いはず。

                    if (!albumDictionary.ContainsKey(albumUri))
                        continue; // 合致するアルバムが取得出来ないことは無いはず

                    this.Dbc.ArtistAlbums.Add(new ArtistAlbum()
                    {
                        ArtistId = artist.Id,
                        AlbumId = albumDictionary[albumUri].Id
                    });
                }
            }

            return true;
        }
    }
}
