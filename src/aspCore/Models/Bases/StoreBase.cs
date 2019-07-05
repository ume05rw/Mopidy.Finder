using System;
using System.Collections.Generic;

namespace MusicFront.Models.Bases
{
    public abstract class StoreBase<T> : IDisposable
    {
        protected Dbc Dbc;

        protected StoreBase(Dbc dbc)
        {
            this.Dbc = dbc;
        }

        #region IDisposable Support
        protected bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!this.IsDisposed)
            {
                if (disposing)
                {
                    this.Dbc = null;
                }

                this.IsDisposed = true;
            }
        }

        public void Dispose()
        {
            this.Dispose(true);
        }
        #endregion
    }
}
