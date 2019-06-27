using System.ComponentModel.DataAnnotations.Schema;

namespace MusicFront.Models.JsonRpcs
{
    [NotMapped]
    public class JsonRpcFactory
    {
        private static int _idForService = 90001;

        public static JsonRpcQuery CreateQuery(JsonRpcParamsQuery values)
        {
            var hasId = (values.id != null);
            var hasParams = (values.@params != null);
            JsonRpcQuery query;

            if (hasId)
            {
                // id付き=リクエスト
                query = (hasParams)
                    ? new JsonRpcQueryRequestWithParams((int)values.id, values.method, values.@params)
                    : new JsonRpcQueryRequest((int)values.id, values.method);
            }
            else
            {
                // id無し=通知
                query = (hasParams)
                    ? new JsonRpcQueryNoticeWithParams(values.method, values.@params)
                    : new JsonRpcQueryNotice(values.method);
            }

            return query;
        }

        public static JsonRpcQuery CreateRequest(string method, object @params)
        {
            JsonRpcQuery query;
            if (@params != null)
                query = new JsonRpcQueryRequestWithParams(JsonRpcFactory._idForService, method, @params);
            else
                query = new JsonRpcQueryRequest(JsonRpcFactory._idForService, method);

            JsonRpcFactory._idForService++;

            return query;
        }

        public static JsonRpcResult CreateResult(JsonRpcParamsResponse values)
        {
            JsonRpcResult result;

            if (values.error != null)
                result = new JsonRpcResultError((int)values.id, values.error);
            else
                result = new JsonRpcResultSucceeded((int)values.id, values.result);

            return result;
        }

        public static JsonRpcResult CreateErrorResult(int id, string message)
        {
            return new JsonRpcResultError(id, message);
        }
    }
}
