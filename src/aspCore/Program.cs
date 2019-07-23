using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using MopidyFinder.Extensions;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;

namespace MopidyFinder
{
    public class Program
    {
        public static int Port { get; private set; } = 8080;
        public static string CurrentPath { get; private set; } = string.Empty;
        public static string SrcPath { get; private set; } = string.Empty;
        public static string DistPath { get; private set; } = string.Empty;
        public static string DbPath { get; private set; } = string.Empty;
        public static bool IsWindowsService { get; private set; } = false;

        public static void Main(string[] args)
        {
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
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseKestrel()
                // ↓これは入れたらダメ。VSでステップデバッグできなくなる。
                //.UseContentRoot(Path.Combine(Program.CurrentPath, "aspCore"))
                .UseWebRoot(Program.DistPath)
                .UseStartup<Startup>()
                .UseUrls($"http://*:{Program.Port}")
                .Build();
    }
}
