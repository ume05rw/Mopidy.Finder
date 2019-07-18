using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using MopidyFinder.Models.Settings;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace MopidyFinder.Models.WebSockets
{
    /// <summary>
    /// WebSocketプロキシお試し版
    /// </summary>
    /// <remarks>
    /// 肝心のMopidy側からリモートホスト接続を拒否されるため、断念。
    /// </remarks>
    public class WebSocketStore: StoreBase<bool>
    {
        private const int MessageBufferSize = 8192;
        private static Settings.Settings _settings = null;
        private List<WebSocket> _accepts = new List<WebSocket>();
        private ClientWebSocket _client;

        public WebSocketStore([FromServices] Dbc dbc): base(dbc)
        {
            this.Connect();
        }

        private async Task<bool> Connect()
        {
            this._client = new ClientWebSocket();

            try
            {
                if (WebSocketStore._settings == null)
                {
                    var store = new SettingsStore(this.Dbc);
                    WebSocketStore._settings = store.Entity;
                }

                var uri = new Uri($"{WebSocketStore._settings.WebSocketUri}/");
                await this._client.ConnectAsync(uri, CancellationToken.None);
            }
            catch (Exception ex)
            {
                // 接続が拒否された
                return false;
            }

            while (this._client.State == WebSocketState.Open)
            {
                var buffer = new ArraySegment<byte>(new byte[MessageBufferSize]);
                var recieved = await this._client.ReceiveAsync(buffer, CancellationToken.None);

                foreach (var accepted in this._accepts)
                {
                    if (accepted.State == WebSocketState.Open)
                    {
                        await accepted.SendAsync(
                            buffer,
                            WebSocketMessageType.Binary,
                            true,
                            CancellationToken.None
                        );
                    }
                }
            }

            return true;
        }

        public void Add(WebSocket accepted)
        {
            this._accepts.Add(accepted);
        }
    }
}
