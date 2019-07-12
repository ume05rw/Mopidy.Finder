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
using MopidyFinder.Models.Relations;
using MopidyFinder.Models.Tracks;
using MopidyFinder.Models.WebSockets;
using Newtonsoft.Json.Serialization;
using System.Linq;

namespace MopidyFinder
{
    public class Startup
    {
        private static WebSocketStore _webSocketStore;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 追加済みのサービスの中から、ILoggerFactoryのインスタンスを取得する。
            ILoggerFactory loggerFactory = null;
            var logServiceDescripter = services
                .FirstOrDefault(s => s.ServiceType == typeof(ILoggerFactory));

            var hasLoggerFactory = (logServiceDescripter != null && logServiceDescripter.ImplementationInstance != null);
            if (logServiceDescripter != null && logServiceDescripter.ImplementationInstance != null)
                loggerFactory = (ILoggerFactory)logServiceDescripter.ImplementationInstance;

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

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
                .AddTransient<TrackStore, TrackStore>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(
            IApplicationBuilder app,
            IHostingEnvironment env
        )
        {
            Initializer.SetServiceProvider(app.ApplicationServices);

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

            // WebSocketお試し実装、ダメだった。--->
            if (Startup._webSocketStore == null)
                Startup._webSocketStore = new WebSocketStore();

            var options = new WebSocketOptions { ReceiveBufferSize = 8192 };
            app.UseWebSockets(options);
            app.Use(async (context, next) =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    var socket = await context.WebSockets.AcceptWebSocketAsync();
                    Startup._webSocketStore.Add(socket);
                }
                else
                {
                    await next();
                }
            });
            // <---

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
