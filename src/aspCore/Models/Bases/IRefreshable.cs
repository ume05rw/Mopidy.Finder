using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Bases
{
    public interface IMopidyScannable
    {
        Task<IEntity[]> Scan(Dbc dbc);
        decimal ScanProgress { get; }
    }
}
