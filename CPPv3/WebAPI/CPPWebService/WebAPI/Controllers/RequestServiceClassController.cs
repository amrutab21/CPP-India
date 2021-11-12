﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class RequestServiceClassController : ApiController
    {
        public HttpResponseMessage Get()
        {

            List<ServiceClass> ServiceClassList = new List<ServiceClass>();
            ServiceClassList = WebAPI.Models.ServiceClass.getServices();


            var jsonNew = new
            {
                result = ServiceClassList
            };
            return Request.CreateResponse(HttpStatusCode.OK, jsonNew);
        }
    }
}
