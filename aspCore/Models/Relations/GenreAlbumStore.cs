using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using System.Threading.Tasks;

namespace MusicFront.Models.Relations
{
    public class GenreAlbumStore : MopidyStoreBase<GenreAlbum>
    {
        public GenreAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            this.Dbc.GenreAlbums.RemoveRange(this.Dbc.GenreAlbums);
            await this.Dbc.SaveChangesAsync();



            return true;
        }
    }
}
