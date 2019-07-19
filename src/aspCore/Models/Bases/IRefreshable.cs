using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Bases
{
    interface IRefreshable
    {
        Task<bool> Refresh();
        decimal RefreshProgress { get; }
    }
}
