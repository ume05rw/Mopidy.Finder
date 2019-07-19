using Microsoft.AspNetCore.Mvc;
using MopidyFinder.Models.Bases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Jobs
{
    public class JobStore : StoreBase<Job>
    {
        private static IServiceProvider _provider = null;
        private static Locker Locker = new Locker();
        private static Job _entity;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            JobStore._provider = provider;
        }

        public static void ReleaseServiceProvider()
        {
            JobStore._provider = null;
        }


        public JobStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        public Job Entity
        {
            get
            {
                this.Ensure();

                return JobStore._entity;
            }
        }

        private void Ensure()
        {
            lock (JobStore.Locker)
            {
                JobStore.Locker.IsLocked = true;

                if (JobStore._entity == null)
                    JobStore._entity = this.Dbc.Jobs.FirstOrDefault();

                if (JobStore._entity == null)
                {
                    JobStore._entity = new Job()
                    {
                        TargetId = null,
                        Target = null,
                        
                    };
                    this.Dbc.Jobs.Add(JobStore._entity);
                    this.Dbc.SaveChanges();
                }

                JobStore.Locker.IsLocked = false;
            }
        }
    }
}
