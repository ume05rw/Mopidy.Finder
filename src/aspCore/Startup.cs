using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MopidyFinder.Models;
using MopidyFinder.Models.Albums;
using MopidyFinder.Models.AlbumTracks;
using MopidyFinder.Models.Artists;
using MopidyFinder.Models.Genres;
using MopidyFinder.Models.Jobs;
using MopidyFinder.Models.Mopidies.Methods;
using MopidyFinder.Models.Relations;
using MopidyFinder.Models.Settings;
using MopidyFinder.Models.Tracks;
using Newtonsoft.Json.Serialization;
using System.Linq;

namespace MopidyFinder
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            // 追加済みのサービスの中から、ILoggerFactoryのインスタンスを取得する。
            ILoggerFactory loggerFactory = null;
            var logServiceDescripter = services
                .FirstOrDefault(s => s.ServiceType == typeof(ILoggerFactory));

            var hasLoggerFactory = (logServiceDescripter != null && logServiceDescripter.ImplementationInstance != null);
            if (logServiceDescripter != null && logServiceDescripter.ImplementationInstance != null)
                loggerFactory = (ILoggerFactory)logServiceDescripter.ImplementationInstance;

            services.AddDbContext<Dbc>(options =>
            {
                // ILoggerFactoryが取得出来ていれば、追加しておく。
                // DBのクエリログが各種ロガーに通知されるようになる。
                if (loggerFactory != null)
                    options.UseLoggerFactory(loggerFactory);

                // フルパス指定が出来ない？要検証。
                //options.UseSqlite($"Data Source=\"{Program.DbPath}\"");
                options.UseSqlite($"Data Source=database.db");

                // MySQL接続のとき
                //options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql"));
            },
                ServiceLifetime.Transient, // 呼び出し都度インスタンシエイトする。
                ServiceLifetime.Transient
            );

            services
                .AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(options =>
                {
                    // JSON生成時、キャメル先頭を大文字で返す。
                    options.SerializerSettings.ContractResolver
                        // アッパーキャメルの場合
                        // = new DefaultContractResolver();
                        // ロウアーキャメルの場合
                        //= new CamelCasePropertyNamesContractResolver();
                        = new DefaultContractResolver();

                    // 無限ループ検出時の動作。
                    // シリアライズエラー時、デフォルトでは途中状態の文字列を返してしまう。
                    options.SerializerSettings.ReferenceLoopHandling
                        = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });
            services
                .AddTransient<AlbumStore, AlbumStore>()
                .AddTransient<GenreStore, GenreStore>()
                .AddTransient<ArtistStore, ArtistStore>()
                .AddTransient<ArtistAlbumStore, ArtistAlbumStore>()
                .AddTransient<GenreAlbumStore, GenreAlbumStore>()
                .AddTransient<GenreArtistStore, GenreArtistStore>()
                .AddTransient<AlbumTracksStore, AlbumTracksStore>()
                .AddTransient<TrackStore, TrackStore>()
                .AddTransient<SettingsStore, SettingsStore>()
                .AddTransient<JobStore, JobStore>()
                .AddTransient<DbEnsurer, DbEnsurer>()
                .AddSingleton<Query, Query>()
                .AddSingleton<Playback, Playback>()
                .AddSingleton<Library, Library>()
                .AddSingleton<Tracklist, Tracklist>()
                .AddSingleton<DbMaintainer, DbMaintainer>();
        }

        private DbMaintainer _dbMaintainer;

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IApplicationLifetime applicationLifetime,
            IHostingEnvironment env
        )
        {
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            using (var dbEnsurer = serviceScope.ServiceProvider.GetService<DbEnsurer>())
            {
                dbEnsurer.Ensure();
                this._dbMaintainer = serviceScope.ServiceProvider.GetService<DbMaintainer>();
            }

            // アプリケーション起動／終了をハンドルする。
            // https://stackoverflow.com/questions/41675577/where-can-i-log-an-asp-net-core-apps-start-stop-error-events
            applicationLifetime.ApplicationStarted.Register(this.OnStarted);
            applicationLifetime.ApplicationStopping.Register(this.OnShutdown);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        private void OnStarted()
        {
            if (!this._dbMaintainer.IsAlbumScannerRunning)
                this._dbMaintainer.RunAlbumScanner();
        }

        private void OnShutdown()
        {
            if (this._dbMaintainer.IsAlbumScannerRunning
                || this._dbMaintainer.IsDbUpdateRunning)
            {
                this._dbMaintainer.StopAllTasks()
                    .GetAwaiter()
                    .GetResult();
            }
        }
    }
}
