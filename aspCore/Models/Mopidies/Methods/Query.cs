using MusicFront.Models.JsonRpcs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace MusicFront.Models.Mopidies.Methods
{
    public static class Query
    {
        public static async Task<object> Exec(JsonRpcQuery request)
        {
            var url = "http://192.168.254.251:6680/mopidy/rpc";
            HttpResponseMessage message;
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json")
            );
            client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

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
            var response = JsonConvert.DeserializeObject<JsonRpcParamsResponse>(json);

            if (response.Error != null)
                throw new Exception($"Mopidy Query Error: {response.Error}");

            return response.Result;
        }
    }
}
