using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebAPI.Models.Api;

namespace WebAPI.CustomHandler
{
    public class MessageLogging
    {
        public void IncomingMessageAsync(ApiLog apiLog)
        {
            apiLog.RequestType = "Request";

            using(var ctx = new CPPDbContext())
            {
                ctx.ApiLog.Add(apiLog);
                ctx.SaveChanges();
            }
        }

        public void OutgoingMessageAsync(ApiLog apiLog)
        {
            apiLog.RequestType = "Response";
            using (var ctx = new CPPDbContext())
            {
                ctx.ApiLog.Add(apiLog);
                ctx.SaveChanges();
            }
        }
    }
}