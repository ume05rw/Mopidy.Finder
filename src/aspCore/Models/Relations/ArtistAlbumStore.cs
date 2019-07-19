using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Mopidies.Methods;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Relations
{
    public class ArtistAlbumStore : StoreBase<ArtistAlbum>, IRefreshable
    {
        public ArtistAlbumStore([FromServices] Dbc dbc) : base(dbc)
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

            var albumDictionary = this.Dbc.Albums
                .ToDictionary(e => e.Uri);

            this._refreshLength = albumDictionary.Count();

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

                this._refreshed++;
            }

            return true;
        }
    }
}
