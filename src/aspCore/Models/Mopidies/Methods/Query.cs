using Microsoft.Extensions.DependencyInjection;
using MopidyFinder.Models.JsonRpcs;
using MopidyFinder.Models.Settings;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace MopidyFinder.Models.Mopidies.Methods
{
    public static class Query
    {
        private static IServiceProvider Provider = null;
        private static Settings.Settings _settings = null;

        public static void SetServiceProvider(IServiceProvider provider)
        {
            Query.Provider = provider;
        }

        public static void ReleaseServiceProvider()
        {
            Query.Provider = null;
        }

        private static Settings.Settings Settings
        {
            get
            {
                if (Query._settings == null)
                {
                    using (var serviceScope = Query.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                    using (var dbc = serviceScope.ServiceProvider.GetService<Dbc>())
                    using (var store = new SettingsStore(dbc))
                    {
                        Query._settings = store.Entity;
                    }
                }

                return Query._settings;
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        /// <remarks>
        /// ここでの戻り値[JsonRpcParamsResponse]は直接通信で返すものではない。
        /// 通信応答を返す際に、ここの応答をJsonRpcFactory.CreateResultで整形して返す。
        /// </remarks>
        public static async Task<JsonRpcParamsResponse> Exec(JsonRpcQuery request)
        {
            var url = Query.Settings.RpcUri;

            HttpResponseMessage message;
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
            );
            client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");
            client.Timeout = TimeSpan.FromMilliseconds(500000); // 500秒

            try
            {
                var sendJson = JsonConvert.SerializeObject(request);
                var content = new StringContent(sendJson, Encoding.UTF8, "application/json");
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                message = await client.PostAsync(url, content);
            }
            catch (Exception ex)
            {
                var response = new JsonRpcParamsResponse()
                {
                    Error = ex
                };
                var id = default(int?);
                try
                {
                    id = ((JsonRpcQueryRequest)request).Id;
                }
                catch (Exception)
                {
                }

                return response;
            }

            var json = await message.Content.ReadAsStringAsync();

            if (json == null || string.IsNullOrEmpty(json))
            {
                // 通知の時は応答JSON自体が無いことがある。
                return null;
            }
            else
            {
                var response = JsonConvert.DeserializeObject<JsonRpcParamsResponse>(json);
                return response;
            }
        }
    }
}
