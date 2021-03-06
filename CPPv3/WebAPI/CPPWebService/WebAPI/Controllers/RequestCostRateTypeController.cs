using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class RequestCostRateTypeController : ApiController
    {
        public HttpResponseMessage Get()
        {

            List<CostRateType> costRateTypeList = new List<CostRateType>();
            costRateTypeList = WebAPI.Models.CostRateType.GetCostRateType();


            var jsonNew = new
            {
                result = costRateTypeList
            };
            return Request.CreateResponse(HttpStatusCode.OK, jsonNew);
        }
    }
}
