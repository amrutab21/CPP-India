﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Reflection;
using System.Diagnostics;
using System.Data.OleDb;
using WebAPI.Controllers;
using MySql.Data.MySqlClient;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    [Table("program")]
    public class Program : Audit
    {
        readonly static log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        [NotMapped]
        public int Operation;
        public bool isModified;
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProgramID { get; set; }
        public string ProgramName { get; set; }
        public string ProgramManager { get; set; }
        public string ProgramSponsor { get; set; }

        //Added to store client ID
        public int ClientID { get; set; }
        public string ClientPOC { get; set; }
        public string ClientPhone { get; set; }
        public string ClientEmail { get; set; }
        public string ClientAddress { get; set; }
        //====== Jignesh-AddAddressField-21-01-2021 =======
        public string ClientAddressLine1 { get; set; }
        public string ClientAddressLine2 { get; set; }
        public string ClientCity { get; set; }
        public string ClientState { get; set; }
        public string ClientPONo { get; set; }
        //=================================================
        public string ProjectManager { get; set; }
        public string ProjectManagerPhone { get; set; }
        public string ProjectManagerEmail { get; set; }
        public string ContractName { get; set; }
        public string ContractNumber { get; set; }
        public string BillingPOC { get; set; }
        public string BillingPOCPhone1 { get; set; }
        public string BillingPOCPhone2 { get; set; }
        public string BillingPOCAddress { get; set; }
        //====== Jignesh-AddAddressField-21-01-2021 =======
        public string BillingPOCAddressLine1 { get; set; }
        public string BillingPOCAddressLine2 { get; set; }
        public string BillingPOCCity { get; set; }
        public string BillingPOCState { get; set; }
        public string BillingPOCPONo { get; set; }
        //=================================================
        public string BillingPOCEmail { get; set; }
        public string BillingPOCSpecialInstruction { get; set; }
        public byte TMBilling { get; set; }
        public byte SOVBilling { get; set; }
        public byte MonthlyBilling { get; set; }
        public byte CertifiedPayroll { get; set; }
        public byte Lumpsum { get; set; }

        public String ContractValue { get; set; }   //Manasi 14-07-2020
        public String JobNumber { get; set; }    //Manasi 04-08-2020

        public DateTime? CurrentStartDate { get; set; }
        public DateTime? CurrentEndDate { get; set; }
        public DateTime? ForecastStartDate { get; set; }
        public DateTime? ForecastEndDate { get; set; }
        public string CurrentCost { get; set; }
        public string ForecastCost { get; set; }
        public string OrganizationID { get; set; }

        public int ProgramManagerID { get; set; }
        public int ProgramSponsorID { get; set; }

        public int ProjectClassID { get; set; }

        [ForeignKey("ProgramManagerID")]
        public virtual Employee ProgramManagerObj { get; set; }

        [ForeignKey("ProgramSponsorID")]
        public virtual Employee ProgramSponsorObj { get; set; }

        [ForeignKey("ProjectClassID")]
        public virtual ProjectClass ProjectClass { get; set; }


        [NotMapped]
        public virtual ICollection<ProgramCategory> programCategories { get; set; }
        public virtual ICollection<ProgramCategory> categoryToBeDeleted { get; set; }
        [NotMapped]
        public virtual ICollection<ProgramFund> programFunds { get; set; }
        public virtual ICollection<ProgramFund> fundToBeDeleted { get; set; }

        public static List<Program> getProgramLookup(String OrganizationID, String ProgramID, String KeyStroke)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<Program> MatchedProgramList = new List<Program>();

            try
            {
                using (var ctx = new CPPDbContext())
                {
                    var test = ctx.Program.Where(a => a.OrganizationID == OrganizationID)
                         .Select(c => new { c.ProgramID, c.ProgramName })
                        .ToList();
                    MatchedProgramList = test.Select(a => new Program { ProgramID = a.ProgramID, ProgramName = a.ProgramName }).ToList();
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }

            return MatchedProgramList;
        }
        //From RequestProgramController
        public static List<Program> getProgram(String OrganizationID, String ProgramID, String KeyStroke)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<Program> MatchedProgramList = new List<Program>();

            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ctx.Database.Log = msg => Trace.WriteLine(msg);
                    ctx.Configuration.ProxyCreationEnabled = false;
                    if (OrganizationID != "null" && ProgramID != "null")
                    {
                        string orgId = OrganizationID;
                        int pgmId = int.Parse(ProgramID);
                        IQueryable<Program> programs = ctx.Program.Where(p => p.OrganizationID == orgId && p.ProgramID == pgmId);
                        MatchedProgramList = programs.ToList<Program>();
                        for (var i = 0; i < MatchedProgramList.Count; i++)
                        {
                            var proId = MatchedProgramList[i].ProgramID;
                            // List<ProgramFund> programFunds = ProgramFund.getProgramFund(MatchedProgramList[i].ProgramID);
                            //MatchedProgramList[i].programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == MatchedProgramList[i].ProgramID).ToList();
                            //List<ProgramCategory> programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == proId).ToList();
                            //foreach (var category in programCategories)
                            //{

                            //    category.ActivityCategory = ctx.ActivityCategory.Where(a => a.ID == category.ActivityCategoryID).FirstOrDefault();
                            //    category.Program = null;
                            //}
                            //MatchedProgramList[i].programCategories = programCategories;
                            //MatchedProgramList[i].programFunds = programFunds;
                        }
                    }
                    else if (OrganizationID != "null")
                    {
                        string orgId = OrganizationID;
                        IQueryable<Program> programs = ctx.Program.Where(p => p.OrganizationID == orgId);
                        MatchedProgramList = programs.ToList<Program>();
                        for (var i = 0; i < MatchedProgramList.Count; i++)
                        {
                            var proId = MatchedProgramList[i].ProgramID;
                            // List<ProgramFund> programFunds = ProgramFund.getProgramFund(MatchedProgramList[i].ProgramID);
                            //MatchedProgramList[i].programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == MatchedProgramList[i].ProgramID).ToList();
                            // List<ProgramCategory> programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == proId).ToList();
                            //foreach (var category in programCategories)
                            //{

                            //    category.ActivityCategory = ctx.ActivityCategory.Where(a => a.ID == category.ActivityCategoryID).FirstOrDefault();
                            //    category.Program = null;
                            //}
                            //MatchedProgramList[i].programCategories = programCategories;
                            //MatchedProgramList[i].programFunds = programFunds;
                        }
                    }
                    else if (ProgramID != "null")
                    {
                        int pgmId = int.Parse(ProgramID);
                        IQueryable<Program> programs = ctx.Program.Where(p => p.ProgramID == pgmId);
                        MatchedProgramList = programs.ToList<Program>();
                        for (var i = 0; i < MatchedProgramList.Count; i++)
                        {
                            var proId = MatchedProgramList[i].ProgramID;
                            //List<ProgramFund> programFunds = ProgramFund.getProgramFund(MatchedProgramList[i].ProgramID);
                            ////MatchedProgramList[i].programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == MatchedProgramList[i].ProgramID).ToList();
                            //List<ProgramCategory> programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == proId).ToList();
                            //foreach (var category in programCategories)
                            //{

                            //    category.ActivityCategory = ctx.ActivityCategory.Where(a => a.ID == category.ActivityCategoryID).FirstOrDefault();
                            //    category.Program = null;
                            //}
                            //MatchedProgramList[i].programCategories = programCategories;
                            //MatchedProgramList[i].programFunds = programFunds;
                        }
                    }
                    else if (KeyStroke != "null")
                    {
                        IQueryable<Program> programs = ctx.Program.Where(p => p.ProgramName.Contains(KeyStroke));
                        MatchedProgramList = programs.ToList<Program>();
                        for (var i = 0; i < MatchedProgramList.Count; i++)
                        {
                            var proId = MatchedProgramList[i].ProgramID;
                            //List<ProgramFund> programFunds = ProgramFund.getProgramFund(MatchedProgramList[i].ProgramID);
                            ////MatchedProgramList[i].programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == MatchedProgramList[i].ProgramID).ToList();
                            //List<ProgramCategory> programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == proId).ToList();
                            //foreach (var category in programCategories)
                            //{

                            //    category.ActivityCategory = ctx.ActivityCategory.Where(a => a.ID == category.ActivityCategoryID).FirstOrDefault();
                            //    category.Program = null;
                            //}
                            //MatchedProgramList[i].programCategories = programCategories;
                            //MatchedProgramList[i].programFunds = programFunds;
                        }
                    }
                    else
                    {
                        IQueryable<Program> programs = ctx.Program;
                        MatchedProgramList = programs.ToList<Program>();
                        for (var i = 0; i < MatchedProgramList.Count; i++)
                        {
                            var proId = MatchedProgramList[i].ProgramID;
                            //List<ProgramFund> programFunds = ProgramFund.getProgramFund(MatchedProgramList[i].ProgramID);
                            ////MatchedProgramList[i].programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == MatchedProgramList[i].ProgramID).ToList();
                            //List<ProgramCategory> programCategories = ctx.ProgramCategory.Where(a => a.ProgramID == proId).ToList();
                            //foreach (var category in programCategories)
                            //{

                            //    category.ActivityCategory = ctx.ActivityCategory.Where(a => a.ID == category.ActivityCategoryID).FirstOrDefault();
                            //    category.Program = null;
                            //}
                            //MatchedProgramList[i].programCategories = programCategories;
                            //MatchedProgramList[i].programFunds = programFunds;
                        }
                    }

                }


            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                string a = ex.InnerException.ToString();
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return MatchedProgramList;

        }

        public static String registerProgram(Program pgm)
        {

            String result = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    IQueryable<Program> programs = ctx.Program.Where(p => p.OrganizationID == pgm.OrganizationID && p.ProgramName == pgm.ProgramName);
                    if (programs.ToList().Count == 0)
                    {
                        ctx.Database.Log = msg => Trace.WriteLine(msg);


                        List<ProgramFund> programFundList = pgm.programFunds.ToList();
                        List<ProgramCategory> programCategoryList = pgm.programCategories.ToList();
                        pgm.programFunds = null;
                        pgm.programCategories = null;
                        ctx.Program.Add(pgm);
                        ctx.SaveChanges();
                        var prog = ctx.Program.OrderByDescending(p => p.ProgramID).FirstOrDefault();
                        Console.WriteLine(prog);
                        for (var i = 0; i < programFundList.Count; i++)
                        {
                            programFundList[i].ProgramID = prog.ProgramID;
                            programFundList[i].Operation = 1;
                            ProgramFund.registerProgramFund(programFundList[i]);

                        }

                        for (var i = 0; i < programCategoryList.Count; i++)
                        {
                            programCategoryList[i].ProgramID = prog.ProgramID;
                            programCategoryList[i].Operation = 1;
                            ProgramCategory.registerProgramCategory(programCategoryList[i]);

                        }
                        result = "Success" + "," + prog.ProgramID;
                        List<Program> programList = new List<Program>();
                        programList = ctx.Program.Where(s => s.ProgramID == pgm.ProgramID).ToList();
                        ContractModification contractModificationsList = new ContractModification();
                        foreach (var plist in programList)
                        {
                            var cvalue = plist.ContractValue.Trim('$');
                           
                            contractModificationsList.ModificationNo = "0";
                            contractModificationsList.Title = "Original Contract Value";
                            contractModificationsList.ModificationType = 0;
                            contractModificationsList.Value = cvalue;
                            contractModificationsList.ScheduleImpact = 0;
                            contractModificationsList.Date = plist.CurrentStartDate ?? DateTime.Now;
                            contractModificationsList.ProgramID = plist.ProgramID;
                            contractModificationsList.CreatedDate = plist.CreatedDate;
                            contractModificationsList.CreatedBy = plist.CreatedBy;

                        }
                        ctx.ContractModification.Add(contractModificationsList);
                        ctx.SaveChanges();
                    }
                    else
                    {
                        //result = "Failed to add new Program. Program " + pgm.ProgramName + " Already Exist in the system";
                        result = "Failed to add new contract. Contract " + pgm.ProgramName + " already existed.";  //Manasi 13-07-2020
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

        public static String updateProgram(Program program)
        {

            String result = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ctx.Database.Log = msg => Trace.WriteLine(msg);
                    int pgmId = program.ProgramID;
                    IQueryable<Program> programs;
                    if (program.isModified == true)
                    {
                        programs = ctx.Program.Where(p => p.OrganizationID == program.OrganizationID && p.ProgramName == program.ProgramName);
                        if (programs.ToList().Count == 0)
                        {
                            Program pgm = ctx.Program.First(p => p.ProgramID == pgmId);
                            if (pgm != null)
                            {
                                pgm.ProgramName = program.ProgramName;
                                pgm.ProgramManager = program.ProgramManager;
                                pgm.ProgramSponsor = program.ProgramSponsor;
                                pgm.ClientPOC = program.ClientPOC;
                                pgm.ClientID = program.ClientID;
                                pgm.ClientPhone = program.ClientPhone;
                                pgm.ClientEmail = program.ClientEmail;
                                //====== Jignesh-AddAddressField-21-01-2021 =======
                                //pgm.ClientAddress = program.ClientAddress;
                                pgm.ClientAddressLine1 = program.ClientAddressLine1;
                                pgm.ClientAddressLine2 = program.ClientAddressLine2;
                                pgm.ClientCity = program.ClientCity;
                                pgm.ClientState = program.ClientState;
                                pgm.ClientPONo = program.ClientPONo;
                                //=================================================
                                pgm.ProjectManager = program.ProjectManager;
                                pgm.ProjectManagerPhone = program.ProjectManagerPhone;
                                pgm.ProjectManagerEmail = program.ProjectManagerEmail;
                                pgm.ContractName = program.ContractName;
                                pgm.ContractNumber = program.ContractNumber;
                                pgm.ContractValue = program.ContractValue;       //Manasi 14-07-2020
                                pgm.JobNumber = program.JobNumber;   //Manasi 04-08-2020
                                pgm.CurrentStartDate = program.CurrentStartDate;
                                pgm.CurrentEndDate = program.CurrentEndDate;
                                pgm.BillingPOC = program.BillingPOC;
                                pgm.BillingPOCPhone1 = program.BillingPOCPhone1;
                                pgm.BillingPOCPhone2 = program.BillingPOCPhone2;
                                //====== Jignesh-AddAddressField-21-01-2021 =======
                                //pgm.BillingPOCAddress = program.BillingPOCAddress;
                                pgm.BillingPOCAddressLine1 = program.BillingPOCAddressLine1;
                                pgm.BillingPOCAddressLine2 = program.BillingPOCAddressLine2;
                                pgm.BillingPOCCity = program.BillingPOCCity;
                                pgm.BillingPOCState = program.BillingPOCState;
                                pgm.BillingPOCPONo = program.BillingPOCPONo;
                                //=================================================
                                pgm.BillingPOCEmail = program.BillingPOCEmail;
                                pgm.BillingPOCSpecialInstruction = program.BillingPOCSpecialInstruction;
                                pgm.TMBilling = program.TMBilling;
                                pgm.SOVBilling = program.SOVBilling;
                                pgm.MonthlyBilling = program.MonthlyBilling;
                                pgm.CertifiedPayroll = program.CertifiedPayroll;
                                pgm.Lumpsum = program.Lumpsum;


                                pgm.ProgramManagerID = program.ProgramManagerID;
                                pgm.ProgramSponsorID = program.ProgramSponsorID;
                                pgm.ProjectClassID = program.ProjectClassID;
                                List<ProgramFund> programFundList = program.programFunds.ToList();
                                pgm.programFunds = null;
                                List<ProgramFund> fundToBeDeletedList = program.fundToBeDeleted.ToList();
                                pgm.fundToBeDeleted = null;

                                //program Categories
                                List<ProgramCategory> programCategoryList = program.programCategories.ToList();
                                pgm.programCategories = null;
                                List<ProgramCategory> categoryToBeDeleted = program.categoryToBeDeleted.ToList();
                                pgm.categoryToBeDeleted = null;

                                ctx.SaveChanges();

                                for (var i = 0; i < fundToBeDeletedList.Count; i++)
                                {
                                    ProgramFund.deleteProgramFund(fundToBeDeletedList[i]);
                                }
                                foreach (var pgmf in programFundList)
                                {
                                    var fund = ctx.ProgramFund.Where(p => p.FundName == pgmf.FundName && p.ProgramID == pgmId).FirstOrDefault();
                                    if (fund == null)
                                    {

                                        pgmf.ProgramID = program.ProgramID;
                                        ProgramFund.registerProgramFund(pgmf);
                                    }
                                    else
                                    {

                                        ProgramFund.updateProgramFund(pgmf);
                                    }

                                }
                                //delete category first before adding new one
                                foreach (var cat in categoryToBeDeleted)
                                {
                                    ProgramCategory.deleteProgramCategory(cat);
                                }
                                foreach (var item in programCategoryList)
                                {
                                    var category = ctx.ProgramCategory.Where(a => a.ActivityCategoryID == item.ActivityCategoryID && a.ProgramID == pgmId).FirstOrDefault();
                                    if (category == null)
                                    {
                                        //register
                                        ProgramCategory.registerProgramCategory(category);
                                    }
                                }
                                result = "Success";
                            }
                            else
                            {
                                result = "Update failed because Program " + program.ProgramName + " is not exist!";
                            }
                        }
                        else
                        {
                            result = "Update failed because Contract " + program.ProgramName + " already exist. Please make sure that contract name is unique!";
                        }
                    }
                    else
                    {

                        Program pgm = ctx.Program.First(p => p.ProgramID == pgmId);
                        if (pgm != null)
                        {
                            pgm.ProgramName = program.ProgramName;
                            pgm.ProgramManager = program.ProgramManager;
                            pgm.ProgramSponsor = program.ProgramSponsor;
                            pgm.ClientPOC = program.ClientPOC;
                            pgm.ClientID = program.ClientID;
                            pgm.ClientPhone = program.ClientPhone;
                            pgm.ClientEmail = program.ClientEmail;

                            //====== Jignesh-AddAddressField-21-01-2021 =======
                            //pgm.ClientAddress = program.ClientAddress;
                            pgm.ClientAddressLine1 = program.ClientAddressLine1;
                            pgm.ClientAddressLine2 = program.ClientAddressLine2;
                            pgm.ClientCity = program.ClientCity;
                            pgm.ClientState = program.ClientState;
                            pgm.ClientPONo = program.ClientPONo;
                            //=================================================

                            pgm.ProjectManager = program.ProjectManager;
                            pgm.ProjectManagerPhone = program.ProjectManagerPhone;
                            pgm.ProjectManagerEmail = program.ProjectManagerEmail;
                            pgm.ContractName = program.ContractName;
                            pgm.ContractNumber = program.ContractNumber;
                            pgm.ContractValue = program.ContractValue;       //Manasi 14-07-2020
                            pgm.JobNumber = program.JobNumber;             //Manasi 04-08-2020
                            pgm.CurrentStartDate = program.CurrentStartDate;
                            pgm.CurrentEndDate = program.CurrentEndDate;
                            pgm.BillingPOC = program.BillingPOC;
                            pgm.BillingPOCPhone1 = program.BillingPOCPhone1;
                            pgm.BillingPOCPhone2 = program.BillingPOCPhone2;

                            //====== Jignesh-AddAddressField-21-01-2021 =======
                            //pgm.BillingPOCAddress = program.BillingPOCAddress;
                            pgm.BillingPOCAddressLine1 = program.BillingPOCAddressLine1;
                            pgm.BillingPOCAddressLine2 = program.BillingPOCAddressLine2;
                            pgm.BillingPOCCity = program.BillingPOCCity;
                            pgm.BillingPOCState = program.BillingPOCState;
                            pgm.BillingPOCPONo = program.BillingPOCPONo;
                            //=================================================
                            pgm.BillingPOCEmail = program.BillingPOCEmail;
                            pgm.BillingPOCSpecialInstruction = program.BillingPOCSpecialInstruction;
                            pgm.TMBilling = program.TMBilling;
                            pgm.SOVBilling = program.SOVBilling;
                            pgm.MonthlyBilling = program.MonthlyBilling;
                            pgm.CertifiedPayroll = program.CertifiedPayroll;
                            pgm.Lumpsum = program.Lumpsum;


                            pgm.ProgramManagerID = program.ProgramManagerID;
                            pgm.ProgramSponsorID = program.ProgramSponsorID;
                            pgm.ProjectClassID = program.ProjectClassID;
                            List<ProgramFund> programFundList = program.programFunds.ToList();
                            pgm.programFunds = null;
                            List<ProgramFund> fundToBeDeletedList = program.fundToBeDeleted.ToList();
                            pgm.fundToBeDeleted = null;

                            //program Categories
                            List<ProgramCategory> programCategoryList = program.programCategories.ToList();
                            pgm.programCategories = null;
                            List<ProgramCategory> categoryToBeDeleted = program.categoryToBeDeleted.ToList();
                            pgm.categoryToBeDeleted = null;
                            ctx.SaveChanges();

                            for (var i = 0; i < fundToBeDeletedList.Count; i++)
                            {
                                ProgramFund.deleteProgramFund(fundToBeDeletedList[i]);
                            }
                            foreach (var pgmf in programFundList)
                            {

                                var fund = ctx.ProgramFund.Where(p => p.FundName == pgmf.FundName && p.ProgramID == pgmf.ProgramID).ToList();
                                if (fund.Count == 0)
                                {

                                    pgmf.ProgramID = program.ProgramID;
                                    ProgramFund.registerProgramFund(pgmf);
                                }
                                else
                                {

                                    ProgramFund.updateProgramFund(pgmf);
                                }

                            }
                            //delete category first before adding new one
                            foreach (var cat in categoryToBeDeleted)
                            {
                                ProgramCategory.deleteProgramCategory(cat);
                            }
                            foreach (var item in programCategoryList)
                            {
                                var category = ctx.ProgramCategory.Where(a => a.ActivityCategoryID == item.ActivityCategoryID && a.ProgramID == pgmId).FirstOrDefault();
                                if (category == null)
                                {
                                    //register
                                    ProgramCategory.registerProgramCategory(item);
                                }
                            }

                            result = "Success";
                        }
                        else
                        {
                            result = "Update failed because Program " + program.ProgramName + " is not exist!";
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
                            RetreivedCostFTE.ID = Convert.ToInt16(reader.GetValue(0).ToString().Trim());
                            RetreivedCostFTE.FTECostID = reader.GetValue(1).ToString().Trim();
                            RetreivedCostFTE.Granularity = reader.GetValue(2).ToString().Trim();
                            RetreivedCostFTE.ActivityID = Convert.ToInt16(reader.GetValue(3).ToString().Trim());
                            RetreivedCostFTE.FTEStartDate = reader.GetValue(4).ToString().Trim();

                            RetreivedCostFTE.FTEEndDate = reader.GetValue(5).ToString().Trim();
                            RetreivedCostFTE.FTEPosition = reader.GetValue(6).ToString().Trim();
                            RetreivedCostFTE.FTEValue = reader.GetValue(7).ToString().Trim();

                            RetreivedCostFTE.FTEHourlyRate = reader.GetValue(8).ToString().Trim();
                            RetreivedCostFTE.FTEHours = reader.GetValue(9).ToString().Trim();
                            RetreivedCostFTE.FTECost = reader.GetValue(10).ToString().Trim();


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
                            RetreivedCostLumpsum.ID = Convert.ToInt16(reader.GetValue(0).ToString().Trim());
                            RetreivedCostLumpsum.LumpsumCostID = reader.GetValue(1).ToString().Trim();
                            RetreivedCostLumpsum.ActivityID = Convert.ToInt16(reader.GetValue(2).ToString().Trim());
                            RetreivedCostLumpsum.LumpsumCostStartDate = reader.GetValue(3).ToString().Trim();
                            RetreivedCostLumpsum.LumpsumCostEndDate = reader.GetValue(4).ToString().Trim();

                            RetreivedCostLumpsum.LumpsumDescription = reader.GetValue(5).ToString().Trim();
                            RetreivedCostLumpsum.LumpsumCost = reader.GetValue(6).ToString().Trim();
                            RetreivedCostLumpsum.Granularity = reader.GetValue(7).ToString().Trim();


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
                            RetreivedCostUnit.ID = Convert.ToInt16(reader.GetValue(0).ToString().Trim());
                            RetreivedCostUnit.UnitCostID = reader.GetValue(1).ToString().Trim();
                            RetreivedCostUnit.Granularity = reader.GetValue(2).ToString().Trim();

                            RetreivedCostUnit.ActivityID = Convert.ToInt16(reader.GetValue(3).ToString().Trim());
                            RetreivedCostUnit.UnitCostStartDate = reader.GetValue(4).ToString().Trim();
                            RetreivedCostUnit.UnitCostEndDate = reader.GetValue(5).ToString().Trim();
                            RetreivedCostUnit.UnitDescription = reader.GetValue(6).ToString().Trim();

                            RetreivedCostUnit.UnitQuantity = reader.GetValue(7).ToString().Trim();
                            RetreivedCostUnit.UnitPrice = reader.GetValue(8).ToString().Trim();
                            RetreivedCostUnit.UnitCost = reader.GetValue(9).ToString().Trim();
                            RetreivedCostUnit.UnitType = reader.GetValue(10).ToString().Trim();



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

        public static String deleteProgram(int ProgramID)
        {

            String result = "";
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ctx.Database.Log = msg => Trace.WriteLine(msg);
                    int pgmId = ProgramID;
                    Program pgm = ctx.Program.First(p => p.ProgramID == pgmId);
                    List<ProgramElement> programElementList = ctx.ProgramElement.Where(pe => pe.ProgramID == ProgramID).Select(row => row).ToList();
                    //IQueryable<Project> projectList = ctx.Project.Where()
                    foreach (var peItem in programElementList)
                    {
                        List<Project> projectList = ctx.Project.Where(p => p.ProgramElementID == peItem.ProgramElementID).Select(proj => proj).ToList();
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
                                    activityList = ctx.Activity.Where(a => a.TrendNumber == trend.TrendNumber && a.ProjectID == trend.ProjectID).ToList();

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
                                        Activity.deleteActivity(act);

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
                        if (projectList.Count > 0)
                        {

                            foreach (var p in projectList)
                            {
                                Project.deleteProject(p.ProjectID);
                            }
                        }

                    }



                    if (programElementList.Count > 0)
                    {
                        foreach (var pe in programElementList)
                        {
                            ProgramElement.deleteProgramElement(pe.ProgramElementID);
                        }
                    }
                    //delete program fund
                    if (conn == null)
                    {
                        conn = ConnectionManager.getConnection();
                        conn.Open();
                    }
                    var query1 = "delete from program_fund where 1=1 and ProgramId = " + ProgramID;
                    MySqlCommand command1 = new MySqlCommand(query1, conn);
                    command1.ExecuteNonQuery();
                   
                    //Delete Program Category
                    if (conn == null)
                    {
                        conn = ConnectionManager.getConnection();
                        conn.Open();
                    }
                    query1 = "delete from program_category where 1=1 and ProgramID = " + ProgramID;
                    MySqlCommand command3 = new MySqlCommand(query1, conn);
                    command3.ExecuteNonQuery();
                    //finally delete program
                    if (conn == null)
                    {
                        conn = ConnectionManager.getConnection();
                        conn.Open();
                    }
                    var query2 = "delete from program where 1=1 and ProgramID = " + ProgramID;
                    MySqlCommand command2 = new MySqlCommand(query2, conn);
                    command2.ExecuteNonQuery();
                    //ctx.Program.Remove(pgm);
                    // ctx.SaveChanges();
                    result = "Success";
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {

            }
            return result;
        }

    }
}