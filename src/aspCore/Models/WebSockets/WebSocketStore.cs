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
    public class WebSocketStore
    {
        private const int MessageBufferSize = 8192;
        private List<WebSocket> _accepts = new List<WebSocket>();
        private ClientWebSocket _client;

        public WebSocketStore()
        {
            this.Connect();
        }

        private async Task<bool> Connect()
        {
            this._client = new ClientWebSocket();

            try
            {
                await this._client.ConnectAsync(
                    new Uri("ws://192.168.254.251/mopidy/ws/"),
                    CancellationToken.None
                );
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
