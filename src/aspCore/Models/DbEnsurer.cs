using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MopidyFinder;
using System.IO;

namespace MopidyFinder.Models
{
    public class DbEnsurer: IDisposable
    {
        public DbEnsurer()
        {
        }

        public void Ensure()
        {
            if (!File.Exists(Program.DbPath))
            {
                var templatePath = Path.Combine(Program.CurrentPath, "database.template.db");
                if (!File.Exists(templatePath))
                    throw new FileNotFoundException("Database Template File Not Found.");

                File.Copy(templatePath, Program.DbPath);
                if (!File.Exists(Program.DbPath))
                    throw new ApplicationException("Database Template File Copy Failed.");
            }
        }

        #region IDisposable Support
        private bool disposedValue = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // 特に破棄するものはない。
                }
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            this.Dispose(true);
        }
        #endregion


    }
}
