using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using System.Threading.Tasks;

namespace MusicFront.Models.Relations
{
    public class ArtistAlbumStore : MopidyStoreBase<ArtistAlbum>
    {
        public ArtistAlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            this.Dbc.ArtistAlbums.RemoveRange(this.Dbc.ArtistAlbums);
            await this.Dbc.SaveChangesAsync();



            return true;
        }
    }
}
