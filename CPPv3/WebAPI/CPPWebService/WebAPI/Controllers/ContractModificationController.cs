using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class ContractModificationController : ApiController
    {
        public HttpResponseMessage Post([FromBody] ContractModification contractModification)
        {
            ContractModification.SaveModificationData(contractModification);
            List<ContractModification> contractModificationList = ContractModification.GetContractModificationList(contractModification.ProgramID);
            var jsonNew = new
            {
                result = "success",
                data = contractModificationList
            };
            return Request.CreateResponse(HttpStatusCode.OK, jsonNew);
        }
        public HttpResponseMessage Get(int programId)
        {
            List<ContractModification> contractModificationList = ContractModification.GetContractModificationList(programId);
            var jsonNew = new
            {
                result = "success",
                data = contractModificationList
            };
            return Request.CreateResponse(HttpStatusCode.OK, jsonNew);
        }
    }
}
