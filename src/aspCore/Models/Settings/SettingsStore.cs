using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MopidyFinder.Models.Bases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Settings
{
    public class SettingsStore: StoreBase<Settings>
    {
        private static Locker Locker = new Locker();
        private static Settings _entity;

        public Settings Entity
        {
            get
            {
                this.Ensure();

                return SettingsStore._entity;
            }
        }

        public SettingsStore([FromServices] Dbc dbc) : base(dbc)
        {
        }

        private void Ensure()
        {
            lock (SettingsStore.Locker)
            {
                SettingsStore.Locker.IsLocked = true;

                if (SettingsStore._entity == null)
                    SettingsStore._entity = this.Dbc.Settings.FirstOrDefault();

                if (SettingsStore._entity == null)
                {
                    SettingsStore._entity = new Settings()
                    {
                        ServerAddress = "localhost",
                        ServerPort = 6680
                    };
                    this.Dbc.Settings.Add(SettingsStore._entity);
                    this.Dbc.SaveChanges();
                }

                SettingsStore.Locker.IsLocked = false;
            }
        }

        public void Update()
        {
            this.Ensure();
            this.Dbc.Entry(SettingsStore._entity).State = EntityState.Modified;
            this.Dbc.SaveChanges();
        }
    }
}
