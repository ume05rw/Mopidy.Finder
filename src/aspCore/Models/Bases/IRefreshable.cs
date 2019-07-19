using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Bases
{
    interface IMopidyScannable
    {
        Task<int> Scan();
        decimal ScanProgress { get; }
    }
}
