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
    public class RegisterLookupActivityCategoryController : System.Web.Http.ApiController
    {
        //
        // GET: /RegisterLookupActivityCategory/
        //public HttpResponseMessage Get(int Operation, String CategoryID, String CategoryDescription, String SubCategoryID, String SubCategoryDescription)
        public HttpResponseMessage Post([FromBody] List<ActivityCategory> act_category_list)
        {
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    int? orgId = act_category_list[0].OrganizationID;

                    Versionmaster oldVersion = ctx.VersionMaster.Where(s => s.OrganizationID == orgId)
                                                    .OrderByDescending(a => a.CreatedDate).FirstOrDefault();

                    Versionmaster CreatedNewVersion = new Versionmaster();
                    CreatedNewVersion.CreatedDate = DateTime.Now;
                    CreatedNewVersion.UpdatedDate = DateTime.Now;
                    int count = ctx.VersionMaster.Where(a => a.OrganizationID == orgId).ToList().Count();
                    CreatedNewVersion.description = "V" + (count + 1).ToString();
                    CreatedNewVersion.OrganizationID = orgId == null ? 0 : orgId;
                    ctx.VersionMaster.Add(CreatedNewVersion);
                    ctx.SaveChanges();

                    Versionmaster latestVersion = ctx.VersionMaster.Where(s => s.OrganizationID == orgId)
                                                    .OrderByDescending(a => a.CreatedDate).FirstOrDefault();

                    ctx.Database.ExecuteSqlCommand("call SpCreateNewWBSWithExistingData(@OrganizationID, @OldVesrionID, @NewVersionID)",
                                                    new MySql.Data.MySqlClient.MySqlParameter("@OrganizationID", orgId),
                                                    new MySql.Data.MySqlClient.MySqlParameter("@OldVesrionID", oldVersion.Id),
                                                    new MySql.Data.MySqlClient.MySqlParameter("@NewVersionID", latestVersion.Id));

                

                String status = "";

                    act_category_list = act_category_list.Where(s => s.Operation != 4).ToList();

                foreach (var act_category in act_category_list)
                {
                    if (act_category.Operation == 1)
                        status += WebAPI.Models.ActivityCategory.registerActivityCategory(act_category, latestVersion);

                    if (act_category.Operation == 2)
                    {
                        if (act_category.CategoryID == "null" && act_category.SubCategoryID == "null")  //CategoryID and SubcategoryID cannot be null
                            status += "Must pass CategoryID and SubcategoryID";
                        else //Update both category and subcategory
                             status += WebAPI.Models.ActivityCategory.updateActivityCategorySubCategory(act_category, latestVersion);
                            //status += WebAPI.Models.ActivityCategory.registerActivityCategory(act_category);

                    }

                    if (act_category.Operation == 3)
                        status += WebAPI.Models.ActivityCategory.deleteActivityCategory(act_category, latestVersion);

                    if (act_category.Operation == 4)
                        status += "";
                }
               
                var jsonNew = new
                {
                    result = status
                    //result = "New WBS has been saved successfully."
                };

                return Request.CreateResponse(HttpStatusCode.OK, jsonNew);
                }
            }
            catch (Exception ex)
            {

                throw ex;
                
            }
            
            

        
        }
	}
}