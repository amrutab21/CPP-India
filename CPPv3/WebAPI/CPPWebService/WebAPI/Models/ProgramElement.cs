﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using System.Reflection;
using System.Diagnostics;
using System.Data.OleDb;
using WebAPI.Controllers;
using MySql.Data.MySqlClient;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace WebAPI.Models
{
    [Table("program_element")]
    public class ProgramElement : Audit
    {
        [NotMapped]
        public int Operation;
        public bool isModified;
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProgramElementID { get; set; }

        [NotMapped]
        public List<ProjectApproversDetails> ApproversDetails { get; set; }

        //Super project properties - getting from Project.cs - START
        public string ProjectName { get; set; }
        public int ProjectTypeID { get; set; }
        public int ProjectClassID { get; set; }
        public string ProjectNumber { get; set; }
        public string ContractNumber { get; set; }
        public string ProjectStartDate { get; set; }
        public DateTime ProjectNTPDate { get; set; }   //Manasi 23-10-2020
        public string ContractStartDate { get; set; }

		public string ClientProjectManager { get; set; }
		public string ClientPhoneNumber { get; set; }

		public string LocationName { get; set; }
		public string ContractEndDate { get; set; }
		public string ProjectValueContract { get; set; }
		public string ProjectValueTotal { get; set; }
		public int ContractID { get; set; }

		public int ClientID { get; set; }
        public int LocationID { get; set; }
        public int ProjectManagerID { get; set; }
        public int DirectorID { get; set; }
        public int SchedulerID { get; set; }
        public int VicePresidentID { get; set; }
        public int FinancialAnalystID { get; set; }
        public int CapitalProjectAssistantID { get; set; }

        public string CostDescription { get; set; }
        public string ScheduleDescription { get; set; }
        public string ScopeQualityDescription { get; set; }

        [ForeignKey("ProjectTypeID")]
        public virtual ProjectType ProjectType { get; set; }

        [ForeignKey("ProjectClassID")]
        public virtual ProjectClass ProjectClass { get; set; }

        [ForeignKey("ClientID")]
        public virtual Client Client { get; set; }

        [ForeignKey("LocationID")]
        public virtual Location Location { get; set; }

        [ForeignKey("ProjectManagerID")]
        public virtual Employee ProjectManagerObj { get; set; }

        [ForeignKey("DirectorID")]
        public virtual Employee DirectorObj { get; set; }

        [ForeignKey("SchedulerID")]
        public virtual Employee SchedulerObj { get; set; }

        [ForeignKey("VicePresidentID")]
        public virtual Employee VicePresidentObj { get; set; }

        [ForeignKey("FinancialAnalystID")]
        public virtual Employee FinancialAnalystObj { get; set; }

        [ForeignKey("CapitalProjectAssistantID")]
        public virtual Employee CapitalProjectAssistantObj { get; set; }

        public DateTime? ProjectPStartDate { get; set; }
        public DateTime? ProjectPODate { get; set; }
        public DateTime? ProjectPEndDate { get; set; }


        //Super project properties - getting from Project.cs - END


        public string ProgramElementName { get; set; }
        public string ProgramElementManager { get; set; }
        public string ProgramElementSponsor { get; set; }
        public DateTime? CurrentStartDate { get; set; }
        public DateTime? CurrentEndDate { get; set; }
        public DateTime? ForecastStartDate { get; set; }
        public DateTime? ForecastEndDate { get; set; }
        public string CurrentCost { get; set; }
        
        public string ForecastCost { get; set; }
        public string OrganizationID { get; set; }

        public int ProgramID { get; set; }

        public int ProgramElementManagerID { get; set; }
        public int ProgramElementSponsorID { get; set; }

        [ForeignKey("ProgramElementManagerID")]
        public virtual Employee ProgramElementManagerObj { get; set; }

        [ForeignKey("ProgramElementSponsorID")]
        public virtual Employee ProgramElementSponsorObj { get; set; }

        [ForeignKey("ProgramID")]
        //[IgnoreDataMember]
        public virtual Program Program { get; set; }


        //From RequestProgramElementController
        public static List<ProgramElement> getProgramElement(String ProgramID, String ProgramElementID, String KeyStroke)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<ProgramElement> MatchedProgramElementList = new List<ProgramElement>();

            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ctx.Database.Log = msg => Trace.WriteLine(msg);
                    if (ProgramID != "null" && ProgramID != null){
                        int pgmId = int.Parse(ProgramID);
                        IQueryable<ProgramElement> programElements = ctx.ProgramElement.Include("Program").Where(p => p.ProgramID == pgmId);
                        MatchedProgramElementList = programElements.ToList<ProgramElement>();


                    }   
                    else if (ProgramElementID != "null" && ProgramElementID != null)
                    {
                        int pgmEltId = int.Parse(ProgramElementID);
                        IQueryable<ProgramElement> programElements = ctx.ProgramElement.Include("Program").Where(p => p.ProgramElementID == pgmEltId);
                        MatchedProgramElementList = programElements.ToList<ProgramElement>();
                        for (int i = 0; i < MatchedProgramElementList.Count; i++)
                        {
                            ProgramElement ele = MatchedProgramElementList[i];
                            ele.ApproversDetails = ctx.ProjectApproversDetails.Where(p => p.ProjectId == pgmEltId).ToList<ProjectApproversDetails>();
                        }
                    }
                    else if (KeyStroke != "null" && KeyStroke != null)
                    {
                        IQueryable<ProgramElement> programElements = ctx.ProgramElement.Include("Program").Where(p => p.ProgramElementName.Contains(KeyStroke));
                        MatchedProgramElementList = programElements.ToList<ProgramElement>();
                    }
                    else 
                    {
                        IQueryable<ProgramElement> programs = ctx.ProgramElement.Include("Program");
                        MatchedProgramElementList = programs.ToList<ProgramElement>();
                    }
                    
                }



            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return MatchedProgramElementList;

        }


        public static String registerProgramElement(ProgramElement pgmElt)
        {

            String result = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    IQueryable<ProgramElement> programElements = ctx.ProgramElement.Where(p => p.ProgramID == pgmElt.ProgramID && p.ProgramElementName == pgmElt.ProgramElementName);

                    //ProgramElement retreivedPrgramElement = ctx.ProgramElement.Where(f => f.ProjectNumber == pgmElt.ProjectNumber).FirstOrDefault();

                    //if (retreivedPrgramElement != null)   //duplicate project number found - luan here
                    //{
                    //    result = "Duplicate";
                    //}
                    //else if (programElements.ToList().Count == 0)
                    if (programElements.ToList().Count == 0)
                    {
                        //Adding Project number to project_number table
                        string maxProjectNumber = "000";
                        //int count = ctx.ProgramElement.Where(b => b.ProgramID == pgmElt.ProgramID).Count();
                        //int count = ctx.ProgramElement.Where(b => b.ProjectClassID == pgmElt.ProjectClassID && b.ProgramID == pgmElt.ProgramID).Count();
                        int count = ctx.ProgramElement.Where(b => b.ProjectClassID == pgmElt.ProjectClassID).Count();
                        if (count > 0)
                        {
                            //var ProjectNTPDate = ctx.ProgramElement.Max(a => a.ProjectNTPDate);
                            var ProjectNTPDate = ctx.ProgramElement.Max(a => a.ProjectNTPDate);   //Manasi 01-03-2021
                            DateTime maxDate = ProjectNTPDate == null ? DateTime.Now : ProjectNTPDate;
                            //String maxStartdate = Convert.ToDateTime(ctx.ProgramElement.Max(a => a.ProjectNTPDate)).ToShortDateString();
                            String maxStartdate = maxDate.ToShortDateString();
                            maxStartdate = maxStartdate.Replace('-','/'); // Jignesh
                            int maxYear = Convert.ToInt32(maxStartdate.Split('/')[2].ToString());

                            int currentYear = Convert.ToInt32(pgmElt.ProjectStartDate.ToString().Split('/')[2].ToString());

                            if (maxYear == currentYear)
                            {
                                //String maxProjectNumber =ctx.ProjectNumber.Where(b=>b.project).Max(a => a.projectNumber);
                                //maxProjectNumber = ctx.ProgramElement.Where(a => a.ProjectNTPDate.Year == maxYear && a.ProgramID == pgmElt.ProgramID && a.ProjectClassID == pgmElt.ProjectClassID).Max(b => b.ProjectNumber);
                                //maxProjectNumber = ctx.ProgramElement.Where(a => a.ProjectNTPDate.Year == maxYear && a.ProjectClassID == pgmElt.ProjectClassID && a.ProgramID == pgmElt.ProgramID).Max(b => b.ProjectNumber);
                                maxProjectNumber = ctx.ProgramElement.Where(a => a.ProjectNTPDate.Year == maxYear && a.ProjectClassID == pgmElt.ProjectClassID).Max(b => b.ProjectNumber);
                                maxProjectNumber = (Convert.ToInt32(maxProjectNumber) + 1).ToString();

                            }
                            else
                            {
                                //maxProjectNumber = ctx.ProgramElement.Where(a => a.ProjectNTPDate.Year == currentYear && a.ProgramID == pgmElt.ProgramID && a.ProjectClassID == pgmElt.ProjectClassID).Max(b => b.ProjectNumber);
                                //maxProjectNumber = ctx.ProgramElement.Where(a => a.ProjectNTPDate.Year == currentYear && a.ProjectClassID == pgmElt.ProjectClassID && a.ProgramID == pgmElt.ProgramID).Max(b => b.ProjectNumber);
                                maxProjectNumber = ctx.ProgramElement.Where(a => a.ProjectNTPDate.Year == currentYear && a.ProjectClassID == pgmElt.ProjectClassID).Max(b => b.ProjectNumber);
                                if (maxProjectNumber != null && maxProjectNumber != "")
                                {
                                    maxProjectNumber = (Convert.ToInt32(maxProjectNumber) + 1).ToString();
                                }
                                else
                                    maxProjectNumber = "001";
                            }
                        }
                        
                        else
                        {
                            maxProjectNumber = "001";
                        }
                        if (maxProjectNumber.Length < 3)
                        {
                            int diff = 3 - maxProjectNumber.Length;
                            for (int i = 0; i < diff; i++)
                            {
                                maxProjectNumber = "0" + maxProjectNumber;
                            }
                        }
                        pgmElt.ProjectNumber = maxProjectNumber.ToString();

                        ProjectNumber projectNumber = new ProjectNumber();
                        projectNumber.projectNumber = pgmElt.ProjectNumber;
                        projectNumber.projectElementNumber = "0";
                        projectNumber.isUSed = true;
                        projectNumber.CreatedDate = DateTime.Now;
                        projectNumber.UpdatedDate = DateTime.Now;
                        projectNumber.OrganizationID = pgmElt.OrganizationID;
                        ctx.ProjectNumber.Add(projectNumber);
                        ctx.SaveChanges();

                        ctx.Database.Log = msg => Trace.WriteLine(msg);
                        int pgmId = pgmElt.ProgramID;
                        Program pgm = ctx.Program.First(p => p.ProgramID == pgmId);
                        pgmElt.Program = pgm;
                        //pgmElt.ProjectNTPDate = Convert.ToDateTime(pgmElt.ProjectStartDate);   //Manasi 23-10-2020
                        pgmElt.ProjectNTPDate = DateTime.ParseExact(Convert.ToString(pgmElt.ProjectStartDate), "MM/dd/yyyy", CultureInfo.InvariantCulture);   //Jignesh 20-11-2020
                        ctx.ProgramElement.Add(pgmElt);
                        ctx.SaveChanges();
                        ProgramElement pm = ctx.ProgramElement.OrderByDescending(progElm => progElm.ProgramElementID).FirstOrDefault();

                        for (int i = 0; i < pgmElt.ApproversDetails.Count; i++)
                        {
                            pgmElt.ApproversDetails[i].ProjectId = pm.ProgramElementID;
                        }

                        ctx.ProjectApproversDetails.AddRange(pgmElt.ApproversDetails);
                        ctx.SaveChanges();

                        //For Project Access Control changes
                        User user = ctx.User.Where(u => u.UserID == pgmElt.CreatedBy).FirstOrDefault();
                        ProjectAccessControl projectAccessControl = new ProjectAccessControl();
                        projectAccessControl.UserId = user.Id;


                        ProjectAccessControl checkDataExist1 = ctx.ProjectAccessControl.
                           Where(p => projectAccessControl.UserId == p.UserId &&
                           pgmElt.ProgramElementID == p.ProgramElementID
                           && pgmElt.ProgramID == p.ProgramId)
                           .FirstOrDefault();

                        if (checkDataExist1 != null)
                        {

                            checkDataExist1.IsProgramEleCreator = true;
                            projectAccessControl.Id = checkDataExist1.Id;

                            ctx.SaveChanges();

                        }
                        else
                        {
                            projectAccessControl.ProgramElementID = pgmElt.ProgramElementID;
                            projectAccessControl.IsProgramEleCreator = true;
                            projectAccessControl.ProgramId = pgmElt.ProgramID;
                            ctx.ProjectAccessControl.Add(projectAccessControl);
                            ctx.SaveChanges();
                        }

                        result = "Success" + "," + pm.ProgramElementID + "," + pm.ProgramID + "," + pm.ProjectNumber;  // Jignesh-19-03-2021
                    }
                    else
                    {
                        result = "Failed to add new project. Project " + pgmElt.ProgramElementName + " already exists.";   //Manasi 13-07-2020
                    }
                  
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                //Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.StackTrace.ToString(), line.ToString(), Logger.logLevel.Exception);
            }
            return result;
        }

        
        public static String updateProgramElement(ProgramElement program_element)
        {

            String result = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ctx.Database.Log = msg => Trace.WriteLine(msg);
                    int pgmEltId = program_element.ProgramElementID;
                    if (program_element.isModified == true)
                    {
                        IQueryable<ProgramElement> programElements = ctx.ProgramElement.Where(p => p.ProgramID == program_element.ProgramID && p.ProgramElementName == program_element.ProgramElementName);

                        if (programElements.ToList().Count == 0)
                        {
                            ProgramElement pgmElt = ctx.ProgramElement.First(p => p.ProgramElementID == pgmEltId);
                            List<ProjectApproversDetails> ApproversDetails = ctx.ProjectApproversDetails.Where(p => p.ProjectId == pgmEltId).ToList<ProjectApproversDetails>();
                            if (pgmElt != null)
                            {
                                //Adding Project number to project_number table
                                ProjectNumber projectNumber = new ProjectNumber();
                                projectNumber.projectNumber = pgmElt.ProjectNumber;
                                projectNumber.projectNumber = "0";
                                projectNumber.isUSed = true;
                                projectNumber.CreatedDate = DateTime.Now;
                                projectNumber.UpdatedDate = DateTime.Now;
                                projectNumber.OrganizationID = pgmElt.OrganizationID;
                                ctx.ProjectNumber.Add(projectNumber);
                                ctx.SaveChanges();

                                pgmElt.ProgramElementName = program_element.ProgramElementName;
                                pgmElt.ProjectName = program_element.ProjectName;

                                pgmElt.ProjectClassID = program_element.ProjectClassID;
                                pgmElt.ProjectTypeID = program_element.ProjectTypeID;
                                pgmElt.ProjectNumber = program_element.ProjectNumber;
                                pgmElt.ContractNumber = program_element.ContractNumber;

								pgmElt.ClientProjectManager = program_element.ClientProjectManager;
								pgmElt.ClientPhoneNumber = program_element.ClientPhoneNumber;

								pgmElt.ClientID = program_element.ClientID;
                                pgmElt.LocationID = program_element.LocationID;
                                pgmElt.ProjectManagerID = program_element.ProjectManagerID;
                                pgmElt.DirectorID = program_element.DirectorID;
                                pgmElt.SchedulerID = program_element.SchedulerID;
                                pgmElt.VicePresidentID = program_element.VicePresidentID;
                                pgmElt.FinancialAnalystID = program_element.FinancialAnalystID;
                                pgmElt.CapitalProjectAssistantID = program_element.CapitalProjectAssistantID;

                                pgmElt.ProjectStartDate = program_element.ProjectStartDate;
                                //pgmElt.ProjectNTPDate = Convert.ToDateTime(pgmElt.ProjectStartDate);   //Manasi 23-10-2020
                                pgmElt.ProjectNTPDate = DateTime.ParseExact(Convert.ToString(pgmElt.ProjectStartDate), "MM/dd/yyyy", CultureInfo.InvariantCulture); // Jignesh 20-11-2020


                                // ------------------ Add start date end date po date 21-01-2021 -----------------------------

                                pgmElt.ProjectPODate = program_element.ProjectPODate;
                                pgmElt.ProjectPStartDate = program_element.ProjectPStartDate;
                                pgmElt.ProjectPEndDate = program_element.ProjectPEndDate;

                                //--------------------------------------------------------------------------------------------------------------


                                pgmElt.ContractStartDate = program_element.ContractStartDate;

								pgmElt.LocationName = program_element.LocationName;
								pgmElt.ContractEndDate = program_element.ContractEndDate;
								pgmElt.ContractID = program_element.ContractID;
								pgmElt.ProjectValueContract = program_element.ProjectValueContract;
								pgmElt.ProjectValueTotal = program_element.ProjectValueTotal;

								pgmElt.CostDescription = program_element.CostDescription;
                                pgmElt.ScheduleDescription = program_element.ScheduleDescription;
                                pgmElt.ScopeQualityDescription = program_element.ScopeQualityDescription;

                                pgmElt.ProgramElementName = program_element.ProgramElementName;
                                pgmElt.ProgramElementManager = program_element.ProgramElementManager;
                                pgmElt.ProgramElementSponsor = program_element.ProgramElementSponsor;
                                pgmElt.ProgramElementManagerID = program_element.ProgramElementManagerID;
                                pgmElt.ProgramElementSponsorID = program_element.ProgramElementSponsorID;

                                
                                ctx.SaveChanges();
                                
                                ctx.ProjectApproversDetails.RemoveRange(ApproversDetails);
                                ctx.ProjectApproversDetails.AddRange(program_element.ApproversDetails);
                                ctx.SaveChanges();
                                result = "Success";
                            }
                            else
                            {
                                result = "Update failed because Program Element " + program_element.ProgramElementName + " is not exist!";
                            }
                        }
                        else
                        {
                            result = "Update failed because Program Element " + program_element.ProgramElementName + " already exist. Please make sure that Program Element name is unique!";
                        }

                    }
                    else
                    {
                        ProgramElement pgmElt = ctx.ProgramElement.First(p => p.ProgramElementID == pgmEltId);
                        if (pgmElt != null)
                        {
                            pgmElt.ProgramElementName = program_element.ProgramElementName;
                            pgmElt.ProjectName = program_element.ProjectName;

                            pgmElt.ProjectClassID = program_element.ProjectClassID;
                            pgmElt.ProjectTypeID = program_element.ProjectTypeID;
                            pgmElt.ProjectNumber = program_element.ProjectNumber;
                            pgmElt.ContractNumber = program_element.ContractNumber;

                            pgmElt.ClientID = program_element.ClientID;
                            pgmElt.LocationID = program_element.LocationID;
                            pgmElt.ProjectManagerID = program_element.ProjectManagerID;
                            pgmElt.DirectorID = program_element.DirectorID;
                            pgmElt.SchedulerID = program_element.SchedulerID;
                            pgmElt.VicePresidentID = program_element.VicePresidentID;
                            pgmElt.FinancialAnalystID = program_element.FinancialAnalystID;
                            pgmElt.CapitalProjectAssistantID = program_element.CapitalProjectAssistantID;

                            pgmElt.ProjectStartDate = program_element.ProjectStartDate;
                            pgmElt.ContractStartDate = program_element.ContractStartDate;

							pgmElt.ClientProjectManager = program_element.ClientProjectManager;
							pgmElt.ClientPhoneNumber = program_element.ClientPhoneNumber;

							pgmElt.LocationName = program_element.ProjectStartDate;
							pgmElt.ContractEndDate = program_element.ContractEndDate;
							pgmElt.ContractID = program_element.ContractID;
							pgmElt.ProjectValueContract = program_element.ProjectValueContract;
							pgmElt.ProjectValueTotal = program_element.ProjectValueTotal;

							pgmElt.ProgramElementName = program_element.ProgramElementName;
                            pgmElt.ProgramElementManager = program_element.ProgramElementManager;
                            pgmElt.ProgramElementSponsor = program_element.ProgramElementSponsor;
                            pgmElt.ProgramElementManagerID = program_element.ProgramElementManagerID;
                            pgmElt.ProgramElementSponsorID = program_element.ProgramElementSponsorID;
                            ctx.SaveChanges();
                            result = "Success";
                        }
                        else
                        {
                            result = "Update failed because Program Element " + program_element.ProgramElementName + " is not exist!";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            return result;
        }
        public static void deleteCost(List<Activity> activityList)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            foreach (var act in activityList)
            {
                List<CostFTE> costFTEList = new List<CostFTE>();
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
                conn = null;
                reader = null;

                try
                {
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    var query = "Select * from cost_fte where ActivityID = " + act.ActivityID;
                    MySqlCommand command = new MySqlCommand(query, conn);
                    using (reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CostFTE RetreivedCostFTE = new CostFTE();
                            //RetreivedCostFTE.FTECostID = reader.GetValue(0).ToString().Trim();
                            //RetreivedCostFTE.ActivityID = reader.GetValue(1).ToString().Trim();
                            //RetreivedCostFTE.FTEStartDate = (reader.GetValue(2).ToString().Trim()).ToString("yyyy-MM-DD");

                            //RetreivedCostFTE.FTEEndDate = reader.GetValue(3).ToString().Trim();
                            //RetreivedCostFTE.FTEPosition = reader.GetValue(4).ToString().Trim();
                            //RetreivedCostFTE.FTEValue = reader.GetValue(5).ToString().Trim();

                            //RetreivedCostFTE.FTEHourlyRate = reader.GetValue(6).ToString().Trim();
                            //RetreivedCostFTE.FTEHours = reader.GetValue(7).ToString().Trim();
                            //RetreivedCostFTE.FTECost = reader.GetValue(8).ToString().Trim();
                            //RetreivedCostFTE.Granularity = reader.GetValue(9).ToString().Trim();

                            costFTEList.Add(RetreivedCostFTE);
                        }
                    }
                }
                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }

                List<CostLumpsum> costLumpsumList = new List<CostLumpsum>();
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
                conn = null;
                reader = null;
                try
                {
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    var query = "Select * from cost_lumpsum where ActivityID = " + act.ActivityID;
                    MySqlCommand command = new MySqlCommand(query, conn);
                    using (reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CostLumpsum RetreivedCostLumpsum = new CostLumpsum();
                            //RetreivedCostLumpsum.LumpsumCostID = reader.GetValue(0).ToString().Trim();
                            //RetreivedCostLumpsum.ActivityID = reader.GetValue(1).ToString().Trim();
                            //RetreivedCostLumpsum.LumpsumCostStartDate = reader.GetValue(2).ToString().Trim();
                            //RetreivedCostLumpsum.LumpsumCostEndDate = reader.GetValue(3).ToString().Trim();

                            //RetreivedCostLumpsum.LumpsumDescription = reader.GetValue(4).ToString().Trim();
                            //RetreivedCostLumpsum.LumpsumCost = reader.GetValue(5).ToString().Trim();
                            //RetreivedCostLumpsum.Granularity = reader.GetValue(6).ToString().Trim();


                            costLumpsumList.Add(RetreivedCostLumpsum);
                        }
                    }
                }
                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }

                List<CostUnit> costUnitList = new List<CostUnit>();
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
                conn = null;
                reader = null;

                try
                {
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    var query = "Select * from cost_unitcost where ActivityID = " + act.ActivityID;
                    MySqlCommand command = new MySqlCommand(query, conn);
                    using (reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            CostUnit RetreivedCostUnit = new CostUnit();
                            //RetreivedCostUnit.UnitCostID = reader.GetValue(0).ToString().Trim();
                            //RetreivedCostUnit.ActivityID = reader.GetValue(1).ToString().Trim();
                            //RetreivedCostUnit.UnitCostStartDate = reader.GetValue(2).ToString().Trim();
                            //RetreivedCostUnit.UnitCostEndDate = reader.GetValue(3).ToString().Trim();
                            //RetreivedCostUnit.UnitDescription = reader.GetValue(4).ToString().Trim();

                            //RetreivedCostUnit.UnitQuantity = reader.GetValue(5).ToString().Trim();
                            //RetreivedCostUnit.UnitPrice = reader.GetValue(6).ToString().Trim();
                            //RetreivedCostUnit.UnitCost = reader.GetValue(7).ToString().Trim();
                            //RetreivedCostUnit.Granularity = reader.GetValue(8).ToString().Trim();
                            //RetreivedCostUnit.UnitType = reader.GetValue(9).ToString().Trim();



                            costUnitList.Add(RetreivedCostUnit);
                        }
                    }
                }
                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }

                if (costFTEList.Count > 0)
                {
                    foreach (var fte in costFTEList)
                    {
                        var query = "delete from cost_fte where 1=1 and FTECostID = '" + fte.FTECostID + "'";
                        MySqlCommand command = new MySqlCommand(query, conn);
                        command.ExecuteNonQuery();
                        // WebAPI.Models.CostFTE.updateCostFTE(fte.Operation, fte.ProgramID, fte.ProgramElementID, fte.ProjectID, fte.TrendNumber, fte.ActivityID, fte.CostID, fte.StartDate, fte.EndDate, fte.Description, fte.TextBoxValue, fte.Base, fte.FTEHours, fte.FTECost, fte.Scale);
                    }
                }
                if (costLumpsumList.Count > 0)
                {
                    foreach (var lumpsum in costLumpsumList)
                    {
                        var query = "delete from cost_lumpsum where 1=1 and LumpsumCostID = '" + lumpsum.LumpsumCostID + "'";
                        MySqlCommand command = new MySqlCommand(query, conn);
                        command.ExecuteNonQuery();
                        // WebAPI.Models.CostFTE.updateCostFTE(fte.Operation, fte.ProgramID, fte.ProgramElementID, fte.ProjectID, fte.TrendNumber, fte.ActivityID, fte.CostID, fte.StartDate, fte.EndDate, fte.Description, fte.TextBoxValue, fte.Base, fte.FTEHours, fte.FTECost, fte.Scale);
                    }
                }
                if (costUnitList.Count > 0)
                {
                    foreach (var unitcost in costUnitList)
                    {
                        var query = "delete from cost_unitcost where 1=1 and UnitCostID = '" + unitcost.UnitCostID + "'";
                        MySqlCommand command = new MySqlCommand(query, conn);
                        command.ExecuteNonQuery();
                        // WebAPI.Models.CostFTE.updateCostFTE(fte.Operation, fte.ProgramID, fte.ProgramElementID, fte.ProjectID, fte.TrendNumber, fte.ActivityID, fte.CostID, fte.StartDate, fte.EndDate, fte.Description, fte.TextBoxValue, fte.Base, fte.FTEHours, fte.FTECost, fte.Scale);
                    }
                }

            }
        }
        public static String deleteProgramElement(int ProgramElementID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String result = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ctx.Database.Log = msg => Trace.WriteLine(msg);
                    int pgmEltId = ProgramElementID;
                    ProgramElement pgmElt = ctx.ProgramElement.First(p => p.ProgramElementID == pgmEltId);

                    List<Project> projectList = ctx.Project.Where(p => p.ProgramElementID == ProgramElementID).Select(proj => proj).ToList();
                    foreach (var project in projectList)
                    {

                        List<Trend> trendList = ctx.Trend.Where(tr => tr.ProjectID == project.ProjectID).Select(trendItem => trendItem).ToList();
                        foreach (var trend in trendList)
                        {
                            List<Activity> activityList = new List<Activity>();

                            String delete_result = "";
                            try
                            {
                                if (conn == null)
                                {
                                    conn = ConnectionManager.getConnection();
                                    conn.Open();
                                }
                                var query = "Select * from activity where TrendNumber = " + trend.TrendNumber + " and ProjectID = " + trend.ProjectID;
                                MySqlCommand command = new MySqlCommand(query, conn);
                                using (reader = command.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        //Activity RetreivedActivity = new Activity();
                                        //RetreivedActivity.ActivityID = reader.GetValue(0).ToString().Trim();
                                        //RetreivedActivity.ProjectID = reader.GetValue(1).ToString().Trim();
                                        //RetreivedActivity.TrendNumber = reader.GetValue(2).ToString().Trim();
                                        //RetreivedActivity.PhaseCode = reader.GetValue(3).ToString().Trim();
                                        //RetreivedActivity.BudgetCategory = reader.GetValue(4).ToString().Trim();
                                        //RetreivedActivity.BudgetSubCategory = reader.GetValue(5).ToString().Trim();
                                        //RetreivedActivity.ActivityStartDate = reader.GetValue(6).ToString().Trim();
                                        //RetreivedActivity.ActivityEndDate = reader.GetValue(7).ToString().Trim();
                                        //RetreivedActivity.FTECost = reader.GetValue(8).ToString().Trim();
                                        //RetreivedActivity.UnitCost = reader.GetValue(9).ToString().Trim();
                                        //RetreivedActivity.PercentageBasisCost = reader.GetValue(10).ToString().Trim();
                                        //activityList.Add(RetreivedActivity);
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                var stackTrace = new StackTrace(ex, true);
                                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                            }

                            deleteCost(activityList);
                            if (activityList.Count > 0)
                            {
                                foreach (var act in activityList)
                                {
                                    if (conn == null)
                                    {
                                        conn = ConnectionManager.getConnection();
                                        conn.Open();
                                    }
                                    var query = "delete from activity where 1=1 and ActivityID = " + act.ActivityID;
                                    MySqlCommand command = new MySqlCommand(query, conn);
                                    command.ExecuteNonQuery();

                                }
                            }
                        }
                        if (trendList.Count > 0)
                        {
                            foreach (var tr in trendList)
                            {
                                Trend.deleteTrend(tr);
                            }
                        }
                    }
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    if (projectList.Count > 0)
                    {
                        foreach (var p in projectList)
                        {
                            Project.deleteProject(p.ProjectID);
                        }
                    }

                    var query1 = "delete from program_element where 1=1 and ProgramElementID = " + ProgramElementID;
                    MySqlCommand command1 = new MySqlCommand(query1, conn);
                    command1.ExecuteNonQuery();
                    updateCostOnProgramElementDelete(pgmElt.ProgramID);
                  //  ctx.ProgramElement.Remove(pgmElt);
                    //ctx.SaveChanges();
                    result = "Success";
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            return result;
        }


        public static void updateCostOnProgramElementDelete(int programID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            using (var ctx = new CPPDbContext())
            {

                Program program = ctx.Program.Where(p => p.ProgramID == programID).FirstOrDefault();
       
                var pID = program.ProgramID;

                MySqlCommand command = null;
                MySqlConnection conn = null;
                MySqlDataReader reader = null;

                try
                {
                    var query = "update_cost_on_program_element_delete"; //Stored Procedure
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    command = new MySqlCommand(query, conn);
                    command.CommandType = CommandType.StoredProcedure;

                    //For Create New

                    //command.Parameters.Add(new MySqlParameter("_ProjectID", ProjectID));
                    //command.Parameters.Add(new MySqlParameter("_ProgramElementID", pmID));
                    command.Parameters.Add(new MySqlParameter("_ProgramID", pID));
                    //command.Parameters.Add(new MySqlParameter("_TrendID", 0));

                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);

                }
                finally
                {
                    if (conn != null)
                    {
                        conn.Close();
                    }
                    if (reader != null)
                    {
                        reader.Close();
                    }
                }

            }
        }
    }
}