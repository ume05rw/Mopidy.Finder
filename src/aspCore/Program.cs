using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using MopidyFinder.Extensions;
using NLog.Web;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace MopidyFinder
{
    public class Program
    {
        public static int Port { get; private set; } = 6690;
        public static string CurrentPath { get; private set; } = string.Empty;
        public static string SrcPath { get; private set; } = string.Empty;
        public static string DistPath { get; private set; } = string.Empty;
        public static string DbPath { get; private set; } = string.Empty;
        public static bool IsWindowsService { get; private set; } = false;

        public static void Main(string[] args)
        {
            // ロガーインスタンスを、Asp.NetCoreと無関係に取得する。
            var logger = NLog.LogManager
                .LoadConfiguration(Path.Combine(Program.CurrentPath, "nlog.config"))
                .GetCurrentClassLogger();

            // サービスとして起動するか否かのフラグ
            // 引数に"--winservice"を付与して起動すると、Windowsサービスとして起動する。
            Program.IsWindowsService = args.Contains("--winservice");

            // カレントパスを取得する。
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            if (pathToExe.EndsWith("dotnet") || pathToExe.EndsWith("dotnet.exe"))
            {
                // dotnetコマンドから起動している。
                // VisualStudio、コマンドライン等から実行している。
                Program.CurrentPath = Directory.GetCurrentDirectory();
            }
            else
            {
                // dotnetコマンド以外から起動している。
                // 実行ファイルのパスを取得してルートとする。
                Program.CurrentPath = Path.GetDirectoryName(pathToExe);
            }

            // Webrootパス
            Program.DistPath = Path.Combine(Program.CurrentPath, "dist");

            // TypeScript-srcパス
            Program.SrcPath = Path.Combine(Program.CurrentPath, "src");

            // SQLiteDBファイルパス
            Program.DbPath = Path.Combine(Program.CurrentPath, "database.db");

            try
            {
                logger.Debug("Start");

                if (Program.IsWindowsService)
                {
                    // Windowsサービスとして起動する。
                    Program.BuildWebHost(new string[] { }).RunAsCustomService();
                }
                else
                {
                    // コマンドライン起動やVSによる起動など、通常こちら。
                    Program.BuildWebHost(new string[] { }).Run();
                }

                logger.Debug("Exit Normally");
            }
            catch (Exception ex)
            {
                logger.Error(ex, "Exit by Exception!!!");
            }
            finally
            {
                NLog.LogManager.Shutdown();
            }
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureLogging(logging =>
                {
                    // NLog 以外で設定された Provider の無効化.
                    logging.ClearProviders();
                    // 最小ログレベルの設定.   //これがないと正常動作しない模様
                    logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
                })
                .UseNLog()
                .UseKestrel()
                // ↓これは入れたらダメ。VSでステップデバッグできなくなる。
                //.UseContentRoot(Path.Combine(Program.CurrentPath, "aspCore"))
                .UseWebRoot(Program.DistPath)
                .UseStartup<Startup>()
                .UseUrls($"http://*:{Program.Port}")
                .Build();
    }
}
