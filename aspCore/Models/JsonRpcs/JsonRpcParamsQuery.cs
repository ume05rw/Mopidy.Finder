namespace MusicFront.Models.JsonRpcs
{
    public class JsonRpcParamsQuery : JsonRpcBase
    {
        public int? id;
        public string method;
        public object @params;
    }
}
