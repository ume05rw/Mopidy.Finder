using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Jobs
{
    [Table("jobs")]
    public class Job
    {
        [Key]
        public int Id { get; set; }

        public string Target { get; set; }

        public int? TargetId { get; set; }

        public string Remarks { get; set; }
    }
}
