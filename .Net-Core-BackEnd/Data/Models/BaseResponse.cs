using IdentityServerTokenAuth.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace IdentityServerTokenAuth.Data.ViewModels
{
    public class BaseResponse<T> where T : class
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public AuthResultVM authResult { get; set; }
        public string role { get; set; }
        public List<string> userRoles { get; set; }
        public BaseResponse()
        {
            userRoles = new List<string>();
        }
        public static BaseResponse<T> returnSuccess(T data,string message)
        {
            return new BaseResponse<T>
            {
                Data = data,
                StatusCode = HttpStatusCode.OK,
                Message = message
            };
        }
        public static BaseResponse<T> returnError(T data, string message)
        {
            return new BaseResponse<T>
            {
                Data = data,
                StatusCode = HttpStatusCode.BadRequest,
                Message = message
            };
        }

        public static BaseResponse<T> returnUnauthorized()
        {
            return new BaseResponse<T>
            {
                StatusCode = HttpStatusCode.Unauthorized,
                Message = "Unauthorized"
            };
        }

        internal static BaseResponse<ApplicationUser> returnSuccess(BaseResponse<AuthResultVM> tokenValue, string v)
        {
            throw new NotImplementedException();
        }
    }
}
