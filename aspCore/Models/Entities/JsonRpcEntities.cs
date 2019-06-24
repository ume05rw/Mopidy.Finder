using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Entities
{
    [JsonObject]
    public abstract class JsonRpcBase
    {
        [JsonProperty("jsonrpc")]
        public string jsonrpc = "2.0";
    }

    [JsonObject]
    public abstract class JsonRpcWithIdBase : JsonRpcBase
    {
        [JsonProperty("id")]
        public int id;

        public JsonRpcWithIdBase(int id)
        {
            this.id = id;
        }
    }

    public class JsonRpcFullParams : JsonRpcBase
    {
        public int? id;
        public string method;
        public object @params;
        public object result;
        public object error;
    }

    [JsonObject]
    public class JsonRpcRequest: JsonRpcWithIdBase
    {
        [JsonProperty("method")]
        public string method;

        public JsonRpcRequest(int id, string method): base(id)
        {
            this.method = method;
        }
    }

    [JsonObject]
    public class JsonRpcRequestWithParams : JsonRpcRequest
    {
        [JsonProperty("params")]
        public object @params;

        public JsonRpcRequestWithParams(int id, string method, object @params): base(id, method)
        {
            this.@params = @params;
        }
    }

    [JsonObject]
    public class JsonRpcNotice: JsonRpcBase
    {
        [JsonProperty("method")]
        public string method;

        public JsonRpcNotice(string method): base()
        {
            this.method = method;
        }
    }

    [JsonObject]
    public class JsonRpcNoticeWithParams : JsonRpcNotice
    {
        [JsonProperty("params")]
        public object @params;

        public JsonRpcNoticeWithParams(string method, object @params): base(method)
        {
            this.@params = @params;
        }
    }


    [JsonObject]
    public class JsonRpcSucceededResult : JsonRpcWithIdBase
    {
        [JsonProperty("result")]
        public object result;

        public JsonRpcSucceededResult(int id, object result): base(id)
        {
            this.result = result;
        }
    }

    [JsonObject]
    public class JsonRpcErrorResult : JsonRpcWithIdBase
    {
        [JsonProperty("error")]
        public object error;

        public JsonRpcErrorResult(int id, object error): base(id)
        {
            this.error = error;
        }
    }
}
