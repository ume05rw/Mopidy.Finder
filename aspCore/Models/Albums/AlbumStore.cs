using Microsoft.AspNetCore.Mvc;
using MusicFront.Models.JsonRpcs;
using MusicFront.Models.Mopidy;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : IDisposable
    {
        private const string QueryString = "local:directory?type=album";

        private Dbc _dbc;

        public AlbumStore([FromServices] Dbc dbc)
        {
            this._dbc = dbc;
        }

        public async Task<bool> Refresh()
        {
            var args = new MethodArgs(AlbumStore.QueryString);
            var query = JsonRpcFactory.CreateRequest("core.library.browse", args);

            var url = "http://192.168.254.251:6680/mopidy/rpc";
            HttpResponseMessage message;
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
            );
            client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

            try
            {
                var sendJson = JsonConvert.SerializeObject(query);
                var content = new StringContent(sendJson, Encoding.UTF8, "application/json");
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                message = await client.PostAsync(url, content);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            var responseJson = await message.Content.ReadAsStringAsync();
            var response = JsonConvert.DeserializeObject<JsonRpcParamsResponse<List<Ref>>>(responseJson);

            var result = response.result;

            

            return true;
        }

        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!this.IsDisposed)
            {
                if (disposing)
                {
                    this._dbc = null;
                }

                this.IsDisposed = true;
            }
        }

        // このコードは、破棄可能なパターンを正しく実装できるように追加されました。
        public void Dispose()
        {
            this.Dispose(true);
        }
        #endregion
    }
}
