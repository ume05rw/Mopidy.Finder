using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Relations
{
    public class GenreArtistStore : MopidyStoreBase<GenreArtist>
    {
        public GenreArtistStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            this.Dbc.GenreArtists.RemoveRange(this.Dbc.GenreArtists);
            await this.Dbc.SaveChangesAsync();



            return true;
        }
    }
}
