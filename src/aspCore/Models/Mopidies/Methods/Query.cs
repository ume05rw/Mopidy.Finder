using MopidyFinder.Models.JsonRpcs;
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
        public static async Task<JsonRpcParamsResponse> Exec(JsonRpcQuery request)
        {
            var url = "http://192.168.254.251:6680/mopidy/rpc";
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
                throw ex;
            }

            var json = await message.Content.ReadAsStringAsync();

            if (json == null || string.IsNullOrEmpty(json))
            {
                // 通知の時は応答JSONが無い。
                return null;
            }
            else
            {
                var response = JsonConvert.DeserializeObject<JsonRpcParamsResponse>(json);

                if (response.Error != null)
                    throw new Exception($"Mopidy Query Error: {response.Error}");

                return response;
            }
        }
    }
}
