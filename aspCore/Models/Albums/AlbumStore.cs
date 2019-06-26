using Microsoft.AspNetCore.Mvc;
using MusicFront.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Albums
{
    public class AlbumStore : IDisposable
    {
        private Dbc _dbc;

        public AlbumStore([FromServices] Dbc dbc)
        {
            this._dbc = dbc;
        }

        public async Task<bool> Refresh([FromServices] JsonRpcController controller)
        {


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
