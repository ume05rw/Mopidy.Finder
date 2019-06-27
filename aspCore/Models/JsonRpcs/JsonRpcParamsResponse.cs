namespace MusicFront.Models.JsonRpcs
{
    public class JsonRpcParamsResponse : JsonRpcBase
    {
        public int? id;
        public object result;
        public object error;
    }

    public class JsonRpcParamsResponse<T> : JsonRpcBase
    {
        public int? id;
        public T result;
        public object error;
    }
}
