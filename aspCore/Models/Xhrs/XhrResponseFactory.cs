using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicFront.Models.Xhrs
{
    public static class XhrResponseFactory
    {
        public static XhrResponse CreateSucceeded(object result = null)
        {
            return (result == null)
                ? new XhrResponse(true)
                : new XhrResponseWithResult(result);
        }

        public static XhrResponse CreateError(Error[] errors)
            => new XhrResponseWithErrors(errors);

        public static XhrResponse CreateError(string message, int code = -1, string fieldName = null)
            => new XhrResponseWithErrors(new Error[] {
                new Error() {
                    Message = message,
                    Code = code,
                    FieldName = fieldName
                }
            });
    }
}
