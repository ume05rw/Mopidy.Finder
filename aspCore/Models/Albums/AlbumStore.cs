using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : MopidyStoreBase<Album>
    {
        private const string QueryString = "local:directory?type=album";

        public AlbumStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public async Task<bool> Refresh()
        {
            this.Dbc.Albums.RemoveRange(this.Dbc.Albums);
            await this.Dbc.SaveChangesAsync();

            var args = new MethodArgs(QueryString);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = await this.QueryMopidy(request);

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            var albums = result.Select(e => new Album()
            {
                Name = e.name,
                Uri = e.uri
            }).ToArray();

            this.Dbc.Albums.AddRange(albums);
            await this.Dbc.SaveChangesAsync();

            return true;
        }
    }
}
