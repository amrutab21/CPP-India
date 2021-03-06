using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Web;
using System.Web.Http;

using WebAPI.Models;
//using System.Web.Script.Serialization;

namespace WebAPI.Controllers
{
    [Authorize]
    public class RequestProjectByOidController : System.Web.Http.ApiController
    {
        //
        // GET: /Project/
        public HttpResponseMessage Get(String OrganizationID)
        {
            List<Project> ProjectList = WebAPI.Models.Project.projectByOid(OrganizationID);
            var jsonNew = new
            {
                result = ProjectList
            };
            return Request.CreateResponse(HttpStatusCode.OK, jsonNew);
        }
    }
}