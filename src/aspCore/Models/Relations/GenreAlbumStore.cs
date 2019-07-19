using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class GenreAlbumStore : StoreBase<GenreAlbum>, IRefreshable
    {
        public GenreAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
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

            var genres = this.Dbc.Genres.ToList();
            var albumDictionary = this.Dbc.Albums
                .ToDictionary(e => e.Uri);

            this._refreshLength = genres.Count();

            foreach (var genre in genres)
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

                this._refreshed++;
            }

            return true;
        }
    }
}
