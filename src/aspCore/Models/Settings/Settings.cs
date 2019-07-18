using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Settings
{
    [Table("settings")]
    [JsonObject(MemberSerialization.OptIn)]
    public class Settings
    {
        [Key]
        [JsonProperty("Id")]
        public int Id { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <remarks>
        /// ex) "localhost", "192.168.1.1"
        /// </remarks>
        [JsonProperty("ServerAddress")]
        public string ServerAddress { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <remarks>
        /// ex) 6680
        /// </remarks>
        [JsonProperty("ServerPort")]
        public int ServerPort { get; set; }


        [NotMapped]
        public string RpcUri
        {
            get
            {
                return $"http://{this.ServerAddress}:{this.ServerPort}/mopidy/rpc";
            }
        }

        [NotMapped]
        public string ImageUri
        {
            get
            {
                return $"http://{this.ServerAddress}:{this.ServerPort}/images";
            }
        }

        [NotMapped]
        public string WebSocketUri
        {
            get
            {
                return $"ws://{this.ServerAddress}:{this.ServerPort}/mopidy/ws";
            }
        }
    }
}
