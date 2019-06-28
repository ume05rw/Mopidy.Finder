using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.Bases;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidies;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Genres
{
    public class GenreStore : MopidyStoreBase<Genre>
    {
        private const string QueryString = "local:directory?type=genre";

        public GenreStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public void Refresh()
        {
            this.Dbc.Genres.RemoveRange(this.Dbc.Genres);
            this.Dbc.SaveChanges();

            var args = new MethodArgs(QueryString);
            var request = JsonRpcFactory.CreateRequest(Methods.LibraryBrowse, args);

            var resultObject = this.QueryMopidy(request)
                .GetAwaiter()
                .GetResult();

            // 戻り値の型は、[ JObject | JArray | JValue | null ] のどれか。
            // 型が違うとパースエラーになる。
            var result = JArray.FromObject(resultObject).ToObject<List<Ref>>();

            var genres = result.Select(e => new Genre()
            {
                Name = e.name,
                Uri = e.uri
            }).ToArray();

            this.Dbc.Genres.AddRange(genres);
            this.Dbc.SaveChanges();
        }
    }
}
