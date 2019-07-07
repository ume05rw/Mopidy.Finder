using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.src.aspCore.Models.Settings
{
    [Table("settings")]
    public class Setting
    {
        /// <summary>
        /// 
        /// </summary>
        /// <remarks>
        /// ex) http://192.168.0.1:6680
        /// </remarks>
        public string Uri { get; set; }



    }
}
