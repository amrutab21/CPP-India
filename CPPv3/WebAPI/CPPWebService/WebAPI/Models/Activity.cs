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
using System.Data.Entity.SqlServer;
using WebAPI.Helper;
using WebAPI.Models.StoredProcedure;

namespace WebAPI.Models
{
    [Table("cost_fte")]
    public class CostFTE : Audit
    {

        [NotMapped]
        public int Operation { get; set; }
        [NotMapped]
        public String ProgramID { get; set; }
        [NotMapped]
        public String ProgramElementID { get; set; }
        [NotMapped]
        public String ProjectID { get; set; }
        [NotMapped]
        public String TrendNumber { get; set; }
        [NotMapped]
        public String PhaseCode { get; set; }
        [NotMapped]
        public String TextBoxID;
        [NotMapped]
        public String CostTrackTypes { get; set; }
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public String FTECostID { get; set; }
        public String Granularity { get; set; }
        public int ActivityID { get; set; }

        public String FTEStartDate { get; set; }
        public String FTEEndDate { get; set; }
        public String FTEPosition { get; set; }
        public int FTEPositionID { get; set; }
        public String FTEValue { get; set; }
        public String FTEHourlyRate { get; set; }
        public String RawFTEHourlyRate { get; set; }
        public String FTEHours { get; set; }
        public String FTECost { get; set; }
        public int CostTrackTypeID { get; set; }
        public int EstimatedCostID { get; set; }
        public String CostLineItemID { get; set; }
        public string RegularHours { get; set; } //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
        public string OTHours { get; set; } //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
        public string DTHours { get; set; } //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
        public int EmployeeID { get; set; }
        public String OriginalCost { get; set; }

        [ForeignKey("EmployeeID")]
        public virtual Employee Employee { get; set; }

        [ForeignKey("FTEPositionID")]
        public virtual FTEPosition FTEPositions { get; set; }

        [ForeignKey("ActivityID")]
        public virtual Activity Activity { get; set; }

        public String ActualFTEHourlyRate { get; set; }   //Swapnil 24-11-2020

        public String ActualBudget { get; set; }    //Swapnil 24-11-2020

        //Nivedita 10022022
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }

        //[ForeignKey("EmployeeID")]
        //public virtual Employee Employee { get; set; }
        //public CostFTE(String id, String st_date, String end_date, String pos, String val, String rate, String hours, String cost)
        //{ FTECostID = id; FTEStartDate = st_date; FTEEndDate = end_date; FTEPosition = pos; FTEValue = val; FTEHourlyRate = rate; FTEHours = hours; FTECost = cost; }
        //public CostFTE() { }

        //From RequestFTECostController

        public static String SQL_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

        public static List<CostFTE> getCostLineItem(string CostLineItemID)
        {
            List<CostFTE> CostLineItemList = new List<CostFTE>();
            var ctx = new CPPDbContext();
            CostLineItemList = ctx.CostFte.Where(z=>z.CostLineItemID == CostLineItemID && z.IsDeleted==false).ToList();
            return CostLineItemList;
        }

        public static List<CostFTE> getCostLineItemForInsperity(string CostLineItemID)
        {
            List<CostFTE> CostLineItemList = new List<CostFTE>();
            var ctx = new CPPDbContext();
            CostLineItemList = ctx.CostFte.Where(z => z.CostLineItemID.Contains(CostLineItemID) && z.IsDeleted == false).ToList();
            return CostLineItemList;
        }

        public static void updateIsExportedFlag(int Id)
        {
            var ctx = new CPPDbContext();
            ctx.Database.ExecuteSqlCommand("call SpUpdateIsExportedFlag(@Id)",
                                            new MySql.Data.MySqlClient.MySqlParameter("@Id", Id));
        }
        public static List<CostFTE> getCostFTE(String ActivityID, String Granularity, String TrendNumber, String ProjectID, String PhaseCode, String BudgetID, String BudgetCategory, String BudgetSubCategory)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);

            List<CostFTE> RetreivedFTECosts = new List<CostFTE>();

            try
            {

                using (var ctx = new CPPDbContext())
                {

                    List<CostFTE> MatchedCostList = new List<CostFTE>();
                    var aID = Convert.ToInt16(ActivityID);
                    Activity act = ctx.Activity.Where(a => a.ActivityID == aID && a.IsDeleted==false).FirstOrDefault();
                    
                    DateTime cutOffDate = DateUtility.getCutOffDate(Granularity);
                    if (TrendNumber == "1000") //Actual, Estimate to completion cost
                        MatchedCostList = ctx.Database.SqlQuery<CostFTE>("call getActualEtcCost(@ProjectID, @CutOffDate, @CostType, @Granularity, @MainCategory,@SubCategory,@PhaseCode)",
                                                          new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", act.ProjectID),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@CutOffDate", cutOffDate.ToString("yyyy-MM-dd")),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@CostType", "F"),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@MainCategory", act.BudgetCategory),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@SubCategory", act.BudgetSubCategory),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode)
                                                          )
                                                          .ToList();
                    else if(TrendNumber == "2000")//Forecast costs (view only)
                    {
                        //IEnumerable<List<CostFTE>> fteList = ctx.Database.SqlQuery<CostFTE>("call get_forecast_cost(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                        //                                 //new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", PhaseCode), 
                        //                                 //new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", BudgetCategory),
                        //                                 //new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", BudgetSubCategory),
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@CostType", "F"),
                        //                                new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                        //                                ).GroupBy(a => new { a.FTEPosition, a.EmployeeID }).Select(a => a.ToList());


                        //-------------------Manasi 10-11-2020--------------------------
                        IEnumerable<List<CostFTE>> fteList = ctx.Database.SqlQuery<CostFTE>("call get_forecast_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                        new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                                                        new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                                                        new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                                                        new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@CostType", "F"),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                                                        ).GroupBy(a => new { a.FTEPosition, a.EmployeeID }).Select(a => a.ToList());

                        int lineId = 1;
                        foreach (List<CostFTE> list in fteList)
                        {
                            int cellId = 0;
                            foreach (CostFTE cost in list)
                            {
                                cost.FTECostID = ActivityID + "_" + lineId + "_" + cellId;
                                cellId += 1;
                                MatchedCostList.Add(cost);
                            }
                            lineId += 1;
                        }
                    }
                    //-------------------Manasi 10-11-2020--------------------------
                    else if (TrendNumber=="3000")
                    {
                        IEnumerable<List<CostFTE>> fteList = ctx.Database.SqlQuery<CostFTE>("call get_current_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                        new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                                                        new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                                                        new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                                                        new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@CostType", "F"),
                                                        new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                                                        ).GroupBy(a => new { a.FTEPosition, a.EmployeeID }).Select(a => a.ToList());

                        int lineId = 1;
                        foreach (List<CostFTE> list in fteList)
                        {
                            int cellId = 0;
                            foreach (CostFTE cost in list)
                            {
                                cost.FTECostID = ActivityID + "_" + lineId + "_" + cellId;
                                cellId += 1;
                                MatchedCostList.Add(cost);
                            }
                            lineId += 1;
                        }
                    }
                    else
                         MatchedCostList = ctx.CostFte.Where(f => f.ActivityID == aID && f.Granularity == Granularity && f.IsDeleted == false).OrderBy(x => x.FTEStartDate).ToList();
                    //Split CostID into ActivityID, RowID, TextBoxID
                    foreach (var MatchedFTECost in MatchedCostList)
                    {
                        String[] FTECostID = MatchedFTECost.FTECostID.ToString().Trim().Split('_');

                        //Find if an entry for this RowID exists
                        int i = RetreivedFTECosts.FindIndex(FTECost => FTECost.FTECostID == FTECostID[1]);

                        if (i >= 0) //RowID exists
                        {
                            RetreivedFTECosts[i].TextBoxID += ", " + FTECostID[2];
                            RetreivedFTECosts[i].FTEValue += ", " + MatchedFTECost.FTEValue.ToString();
                            RetreivedFTECosts[i].FTEStartDate += ", " + DateTime.Parse(MatchedFTECost.FTEStartDate).ToString(SQL_DATE_FORMAT); // MatchedFTECost.FTEStartDate; // DateTime.Parse(FTEStartDateList[i]).ToString(SQL_DATE_FORMAT)
                            RetreivedFTECosts[i].FTEEndDate += ", " + MatchedFTECost.FTEEndDate;
                            RetreivedFTECosts[i].FTECost += ", " + MatchedFTECost.FTECost;
                            RetreivedFTECosts[i].FTEHours += ", " + MatchedFTECost.FTEHours;
                            RetreivedFTECosts[i].CostTrackTypes += "," + MatchedFTECost.CostTrackTypeID;
                            RetreivedFTECosts[i].OriginalCost += "," + MatchedFTECost.OriginalCost;
                            //RetreivedFTECosts[i].RegularHours += "," + MatchedFTECost.RegularHours.ToString(); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                            //RetreivedFTECosts[i].OTHours += "," + MatchedFTECost.OTHours.ToString(); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                            //RetreivedFTECosts[i].DTHours += "," + MatchedFTECost.DTHours.ToString(); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 

                            RetreivedFTECosts[i].RegularHours += "," + MatchedFTECost.RegularHours; //  Manasi 12-04-2021 
                            RetreivedFTECosts[i].OTHours += "," + MatchedFTECost.OTHours; //  Manasi 12-04-2021 
                            RetreivedFTECosts[i].DTHours += "," + MatchedFTECost.DTHours; //  Manasi 12-04-2021 

                            RetreivedFTECosts[i].ActualFTEHourlyRate += "," + MatchedFTECost.ActualFTEHourlyRate; // Swapnil 24-11-2020
                            RetreivedFTECosts[i].ActualBudget += "," + MatchedFTECost.ActualBudget; // Swapnil 24-11-2020
                        }
                        else //RowID does not exist. Add new entry in List
                        {
                            int rowID = int.Parse(FTECostID[1]);
                            for (int j = 0; j <= int.Parse(FTECostID[1]); j++)
                            {
                                if (RetreivedFTECosts.ElementAtOrDefault(j) == null)
                                    RetreivedFTECosts.Add(new CostFTE());
                            }
                            RetreivedFTECosts[rowID].TextBoxID = FTECostID[2];
                            RetreivedFTECosts[rowID].FTECostID = rowID.ToString();
                            RetreivedFTECosts[rowID].ActivityID = MatchedFTECost.ActivityID;
                            RetreivedFTECosts[rowID].FTEStartDate = DateTime.Parse(MatchedFTECost.FTEStartDate).ToString(SQL_DATE_FORMAT); // MatchedFTECost.FTEStartDate;
                            RetreivedFTECosts[rowID].FTEEndDate = MatchedFTECost.FTEEndDate;
                            RetreivedFTECosts[rowID].FTEPosition = MatchedFTECost.FTEPosition;
                            RetreivedFTECosts[rowID].FTEValue = MatchedFTECost.FTEValue;
                            RetreivedFTECosts[rowID].FTEHourlyRate = MatchedFTECost.FTEHourlyRate;
                            RetreivedFTECosts[rowID].FTEHours = MatchedFTECost.FTEHours;
                            RetreivedFTECosts[rowID].FTECost = MatchedFTECost.FTECost;
                            RetreivedFTECosts[rowID].Granularity = MatchedFTECost.Granularity;
                            RetreivedFTECosts[rowID].FTEPositionID = MatchedFTECost.FTEPositionID;
                            RetreivedFTECosts[rowID].EstimatedCostID = MatchedFTECost.EstimatedCostID;
                            RetreivedFTECosts[rowID].CostTrackTypeID = MatchedFTECost.CostTrackTypeID;
                            RetreivedFTECosts[rowID].EmployeeID = MatchedFTECost.EmployeeID;
                            RetreivedFTECosts[rowID].CostTrackTypes = MatchedFTECost.CostTrackTypeID.ToString();
                            RetreivedFTECosts[rowID].CostLineItemID = MatchedFTECost.CostLineItemID;
                            RetreivedFTECosts[rowID].OriginalCost = MatchedFTECost.OriginalCost;
                            RetreivedFTECosts[rowID].RawFTEHourlyRate = MatchedFTECost.RawFTEHourlyRate;
                            RetreivedFTECosts[rowID].ActualFTEHourlyRate = MatchedFTECost.ActualFTEHourlyRate; // Swapnil 24-11-2020
                            RetreivedFTECosts[rowID].ActualBudget = MatchedFTECost.ActualBudget; // Swapnil 24-11-2020
                            //RetreivedFTECosts[rowID].RegularHours = MatchedFTECost.RegularHours.ToString(); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                            //RetreivedFTECosts[rowID].OTHours = MatchedFTECost.OTHours.ToString(); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                            //RetreivedFTECosts[rowID].DTHours = MatchedFTECost.DTHours.ToString(); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs

                            RetreivedFTECosts[rowID].RegularHours = MatchedFTECost.RegularHours; //  Manasi 12-04-2021 
                            RetreivedFTECosts[rowID].OTHours = MatchedFTECost.OTHours; //  Manasi 12-04-2021 
                            RetreivedFTECosts[rowID].DTHours = MatchedFTECost.DTHours; //  Manasi 12-04-2021 

                        }//End else
                    }
                }
                //    }//End reader read
                //}//End executing reader

                for (int j = 0; j < RetreivedFTECosts.Count; j++)
                {
                    if (RetreivedFTECosts[j].ActivityID == null || RetreivedFTECosts[j].ActivityID == 0)
                    {
                        RetreivedFTECosts.RemoveAt(j);
                        j = -1;
                    }
                }

                //To sort String arrays based on TextBoxID
                for (int j = 0; j < RetreivedFTECosts.Count; j++)
                {
                    //Sort arrays by TextBoxID
                    if (RetreivedFTECosts[j].TextBoxID != null)
                    {
                        int[] a_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] b_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] c_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] d_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] e_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] f_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] g_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] h_sortTextBoxID = RetreivedFTECosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();

                        String[] sortFTECost = RetreivedFTECosts[j].FTECost.ToString().Trim().Split(',');
                        String[] sortFTEValue = RetreivedFTECosts[j].FTEValue.ToString().Trim().Split(',');
                        String[] sortFTEStartDate = RetreivedFTECosts[j].FTEStartDate.ToString().Trim().Split(',');
                        String[] sortFTEEndDate = RetreivedFTECosts[j].FTEEndDate.ToString().Trim().Split(',');
                        String[] sortFTEHours = RetreivedFTECosts[j].FTEHours.ToString().Trim().Split(',');
                        String[] sortRegularHours = RetreivedFTECosts[j].RegularHours.ToString().Trim().Split(','); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                        String[] sortOTHours = RetreivedFTECosts[j].OTHours.ToString().Trim().Split(','); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                        String[] sortDTHours = RetreivedFTECosts[j].DTHours.ToString().Trim().Split(','); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 


                        Array.Sort(a_sortTextBoxID, sortFTECost);
                        Array.Sort(b_sortTextBoxID, sortFTEStartDate);
                        Array.Sort(c_sortTextBoxID, sortFTEEndDate);
                        Array.Sort(d_sortTextBoxID, sortFTEValue);
                        Array.Sort(e_sortTextBoxID, sortFTEHours);
                        Array.Sort(f_sortTextBoxID, sortRegularHours); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                        Array.Sort(g_sortTextBoxID, sortOTHours); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                        Array.Sort(h_sortTextBoxID, sortDTHours); //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                    }

                }
            }//End try
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return RetreivedFTECosts;
        }
        public static List<CostFTE> getCostRow(int ActivityID, String Granularity, String LineID, String CostType)
        {
            List<CostFTE> CostFTEs = new List<CostFTE>();

            using(var ctx = new CPPDbContext())
            {
                String query = "CALL get_cost_row(@ActivityID,@LineID,@Granularity,@CostType)";
                CostFTEs = ctx.Database.SqlQuery<CostFTE>(query,
                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID",ActivityID),
                                            new MySql.Data.MySqlClient.MySqlParameter("@LineID", LineID),
                                            new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                            new MySql.Data.MySqlClient.MySqlParameter("@CostType", CostType)
                                            )
                                        .ToList();
            }

            return CostFTEs;
        }
        //Function to Update Cost in Activity, Trend, and project
        public static void updateTotalCost(String ActivityID, String TrendNumber, String ProjectID, String ProgramElementID, String ProgramID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;

            String query = "";
            MySqlCommand command = new MySqlCommand();
            try
            {
                conn = ConnectionManager.getConnection();
                conn.Open();

                //Update cost_fte in Activity
                query = "UPDATE activity SET ";
                query += "FTECost = (SELECT  IFNULL(SUM(FTECost),0) FROM cost_fte where ";
                query += "ActivityID = @ActivityID AND IsDeleted!=true)";
                query += " Where ActivityID = @ActivityID AND IsDeleted!=true ";
                query += " ;\n";


                // Update fte_cost  in Trend
                query += "UPDATE trend SET";
                query += " PostTrendCost = (SELECT (SUM(IFNULL(act.FTECost,0)) + SUM(IFNULL(act.LumpsumCost,0)) + SUM(IFNULL(act.UnitCost,0)) + SUM(IFNULL(act.PercentageBasisCost,0))) ";
                query += " FROM activity act Where act.ProjectID = @ProjectID AND act.IsDeleted!=true";
                query += " AND act.TrendNumber = @TrendNumber " ;
                query += ");\n";



                ////update cost in project
                query += "UPDATE project SET";
                query += " CurrentCost = (SELECT * FROM (SELECT trd.PostTrendCost from trend trd, project prj";
                query += " Where trd.ProjectID = @ProjectID " ;
                query += " And trd.TrendNumber = @TrendNumber " ;
                query += " And trd.ProjectID = prj.ProjectID AND trd.IsDeleted!=true)tblTmp1),";

                query += " ForecastCost = (select * from (select IFNULL(sum(trd.postTrendCost),0) from trend trd, project prj";
                query += " Where trd.ProjectID = @ProjectID " ;
                query += " AND trd.TrendStatusID = 3";
                query += " AND trd.ProjectID = prj.ProjectID AND trd.IsDeleted!=true)tblTmp2)";
                query += " Where ProjectID = @ProjectID " ;

                command = new MySqlCommand(query, conn);
                command.Parameters.AddWithValue("@ActivityID", ActivityID);
                command.Parameters.AddWithValue("@ProjectID", ProjectID);
                command.Parameters.AddWithValue("@TrendNumber", TrendNumber);
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
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
        }
        //From RegisterFTECostController
        public static String updateCostFTE(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String FTECostID, String StartDate, String EndDate, String FTEPosition, String TextBoxValue, String FTEHourlyRate, String FTEHours, String FTECost, String Scale, String FTEIDList, int EmployeeID,String CostTrackTypes,String CostLineItem)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            MySqlConnection duplicateCheckerConn = null;
            MySqlDataReader duplicateCheckReader = null;
            bool duplicateOnRegisterFound = false;
            bool duplicateOnUpdateFound = false;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForUpdateAB = false; //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
            bool OKForRegister = false;
            bool OKForDelete = false;
            bool isZero = true;
            int zero = 0;
            String currentUserName = UserUtil.getCurrentUserName();
            // List<String> FTECostList = TextBoxValue.Split(',').ToList();
            List<String> FTECostList = (TextBoxValue != "") ? TextBoxValue.Split(',').ToList() : new List<String>();
            List<String> FTETotalCostList = FTECost.Split(',').ToList();
            List<String> FTEStartDateList = StartDate.Split(',').ToList();
            List<String> FTEEndDateList = EndDate.Split(',').ToList();
            List<String> FTECostIDList = FTEIDList.Split(',').ToList();
            List<String> FTEHoursList = FTEHours.Split(',').ToList();
            List<String> CostTrackTypeList = null;
            String lineNumber = "";
            
            if (CostTrackTypes != null && CostTrackTypes != "")
                CostTrackTypeList = CostTrackTypes.Split(',').ToList();

            var aId = Convert.ToInt16(ActivityID);
            var ctx = new CPPDbContext();
            if (FTEPosition == "")
            {
              
                var existingCost = ctx.CostFte.Where(c => c.ActivityID == aId && c.Granularity == Scale && c.IsDeleted==false).FirstOrDefault();
                FTEPosition = existingCost.FTEPosition;
            }

            int pID = Convert.ToInt32(ProjectID);
            var project = ctx.Project.Where(p => p.ProjectID == pID && p.IsDeleted == false).FirstOrDefault();
            var projectClass = ctx.ServiceClass.Where(a => a.ID == project.ProjectClassID).FirstOrDefault();
            var programElement = ctx.ProgramElement.Include("ProjectClass").Where(pm => pm.ProgramElementID == project.ProgramElementID && pm.IsDeleted == false).FirstOrDefault();
            var programElementClass = ctx.ProjectClass.Where(a => a.ProjectClassID == programElement.ProjectClassID).FirstOrDefault();  //Manasi 27-10-2020
            var program = ctx.Program.Where(p => p.ProgramID == programElement.ProgramID && p.IsDeleted==false);
            var ftePoistion = ctx.FtePosition.Where(f => f.PositionDescription == FTEPosition).FirstOrDefault();
            var activity = ctx.Activity.Where(a => a.ActivityID == aId && a.IsDeleted==false).FirstOrDefault();
            var phase = ctx.PhaseCode.Where(a => a.PhaseID == activity.PhaseCode).FirstOrDefault();//phaseCode in Activity object is the fk points to phaseID
            var category = Activity.getActivityCategory(activity);
            ProgramID = (program.FirstOrDefault().ProgramID).ToString();
            ProgramElementID = (programElement.ProgramElementID).ToString();
            ProjectID = (project.ProjectID).ToString();
            var ftePoistionID = ftePoistion.Id;
            var lineID = FTECostIDList[0].Split('_')[1];
            var actualCostId = 0;
            int minArrayCount = Math.Min(FTEStartDateList.Count, FTECostIDList.Count);
            for (int j = 0; j < FTECostList.Count; j++)
            {
                if (FTECostList[j] != "0")
                {
                    isZero = false;
                    break;
                }
            }

            //getting line numner 01,02
            CostLineItemResult costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                               category.CategoryID, category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null);
            //Manasi 05-11-2020
            CostLineItemResult newCostLineItem = CostLineItemResult.getNewCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                               category.CategoryID, category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, ProjectID);



            for (int i = 0; i < minArrayCount; i++)
            {
                if(duplicateOnRegisterFound || duplicateOnUpdateFound)  //stop loop when know it's all duplicates
                {
                    return update_result;
                }

                try
                {
                    MySqlCommand command = null;
                    // create and open a connection object
                    conn = ConnectionManager.getConnection();
                    conn.Open();

                    if (CostTrackTypeList != null && i < CostTrackTypeList.Count &&
                     (CostTrackTypeList.ElementAt(i).FirstOrDefault() == 3 || CostTrackTypeList.ElementAt(i).Trim() == "3"))
                        continue;
                    String query = "";



                    //Check if program exists in system
                    query = "SELECT FTECostID from cost_fte";
                    query += " WHERE 1=1 AND IsDeleted!=true";
                    query += " AND FTECostID = @FTECostID ";
                    query += " And Granularity = @Scale ";
                    command = new MySqlCommand(query, conn);
                    command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                    command.Parameters.AddWithValue("@Scale", Scale);
                    using (reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();

                            if (reader.GetValue(0).ToString().Trim() == FTECostIDList[i] && Operation != 3)
                            {
                                //Luan experimental update
                                if (i == 0)
                                {
                                    var FTEStartDateWithTime = DateTime.Parse(FTEStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                    var FTEEndDateWithTime = DateTime.Parse(FTEEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                    query = "SELECT FTECostID from cost_fte";
                                    query += " WHERE 1=1";
                                    query += " AND FTEPosition = @FTEPosition ";
                                    query += " And EmployeeID = @EmployeeID ";
                                    query += " And ActivityID = @ActivityID ";
                                    query += " And (FTEStartDate = @FTEStartDateList OR FTEStartDate = @FTEStartDateWithTime)";
                                    query += " And (FTEEndDate = @FTEEndDateList OR FTEEndDate =@FTEEndDateWithTime)";
                                    query += " And FTECostID != @FTECostIDList";
                                    query += " And CostTrackTypeID = @CostTrackTypeList AND IsDeleted!=true";
                                    duplicateCheckerConn = ConnectionManager.getConnection();
                                    duplicateCheckerConn.Open();
                                    command = new MySqlCommand(query, duplicateCheckerConn);
                                    command.Parameters.AddWithValue("@FTEPosition", FTEPosition);
                                    command.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                                    command.Parameters.AddWithValue("@ActivityID", ActivityID);
                                    command.Parameters.AddWithValue("@FTEStartDateList", FTEStartDateList[i]);
                                    command.Parameters.AddWithValue("@FTEStartDateWithTime", FTEStartDateWithTime);
                                    command.Parameters.AddWithValue("@FTEEndDateList", FTEEndDateList[i]);
                                    command.Parameters.AddWithValue("@FTEEndDateWithTime", FTEEndDateWithTime);
                                    command.Parameters.AddWithValue("@FTECostIDList", FTECostIDList[i]);
                                    command.Parameters.AddWithValue("@CostTrackTypeList", CostTrackTypeList[i]);
                                    using (duplicateCheckReader = command.ExecuteReader())
                                    {
                                        if (duplicateCheckReader.HasRows)
                                        {
                                            duplicateOnUpdateFound = true;
                                        }
                                    }
                                }
                                OKForUpdate = true;
                                OKForUpdateAB = true; //  Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs 
                            }
                            else if (Operation == 3)
                            {
                                OKForDelete = true;
                            }

                        }
                        else
                        {
                            //Luan experimental create
                            if (i == 0)
                            {
                                var FTEStartDateWithTime = DateTime.Parse(FTEStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                var FTEEndDateWithTime = DateTime.Parse(FTEEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                query = "SELECT FTECostID from cost_fte";
                                query += " WHERE 1=1 AND IsDeleted!=true";
                                query += " AND FTEPosition = @FTEPosition ";
                                query += " And EmployeeID = @EmployeeID ";
                                query += " And ActivityID = @ActivityID";
                                query += " And FTEStartDate = @FTEStartDateList ";
                                query += " And FTEEndDate = @FTEEndDateList";
                                query += " And (FTEStartDate = @FTEStartDateList OR FTEStartDate = @FTEStartDateWithTime)";
                                query += " And (FTEEndDate = @FTEEndDateList OR FTEEndDate =@FTEEndDateWithTime )";
                                duplicateCheckerConn = ConnectionManager.getConnection();
                                duplicateCheckerConn.Open();
                                command = new MySqlCommand(query, duplicateCheckerConn);
                                command.Parameters.AddWithValue("@FTEPosition", FTEPosition);
                                command.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                                command.Parameters.AddWithValue("@ActivityID", ActivityID);
                                command.Parameters.AddWithValue("@FTEStartDateList", FTEStartDateList[i]);
                                command.Parameters.AddWithValue("@FTEStartDateWithTime", FTEStartDateWithTime);
                                command.Parameters.AddWithValue("@FTEEndDateList", FTEEndDateList[i]);
                                command.Parameters.AddWithValue("@FTEEndDateWithTime", FTEEndDateWithTime);
                                //command.Parameters.AddWithValue("@FTECostIDList", FTECostIDList[i]);
                                //command.Parameters.AddWithValue("@CostTrackTypeList", CostTrackTypeList[i]);
                                using (duplicateCheckReader = command.ExecuteReader())
                                {
                                    if (duplicateCheckReader.HasRows)
                                    {
                                        duplicateOnRegisterFound = true;
                                    }
                                }
                            }

                            OKForRegister = true;
                        }
                    }

                    //Delete the cost
                    if (OKForDelete)
                    {
                        String fteID = FTECostIDList[i];
                        CostFTE fte = ctx.CostFte.Where(a => a.FTECostID == fteID).FirstOrDefault();

                        //Delete CostLineItemTracker
                        if (fte != null)
                        {
                            //Check if the lineNumber still used by other cost
                            //check_if_cost_exist_in_other_trend
                            //int zero = 0;
                            var result = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription, "F", fte.FTEPositionID.ToString(), fte.EmployeeID.ToString(),
                                                                                        null, null, null, null, null);
                            if (result == 0) //This cost is not being used in other trend
                            {
                                CostLineItemTracker.removeCostLine("F", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                category.SubCategoryID, fte.FTEPositionID.ToString(), fte.EmployeeID.ToString(), null, null, null, null, null, null);
                            }

                            Cost.saveFTECost(3, ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID,
                                 FTECostIDList[i], "", "", "", "", "", "", "",
                                 Scale, fte.FTEPositionID, 1, 0, fte.EmployeeID, null); //Delete

                            update_result += "";
                        }

                        
                    }
                    //Update the Program
                    if (OKForUpdate)
                    {
                        if (duplicateOnUpdateFound)
                        {
                            Employee employee = ctx.Employee.Where(a => a.ID == EmployeeID).FirstOrDefault();
                            update_result = "Duplicate found for employee: " + FTEPosition + " - " + employee.Name + ". \n";

                            return update_result;
                        }
                        else
                        {
                            String fteId = FTECostIDList[i];
                            CostFTE fte = ctx.CostFte.Where(a => a.FTECostID == fteId && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                            //Determine CostLineItem Number
                             costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                        category.CategoryID, category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null);

                            //Manasi 04-11-2020
                            newCostLineItem = CostLineItemResult.getNewCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                        category.CategoryID, category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, ProjectID);


                            string lineItem = null;
                            Boolean costExistInOtherTrend = false;
                            if (EmployeeID != fte.EmployeeID || ftePoistionID != fte.FTEPositionID)
                            {
                                //Changes in EmployeeID and POsitionID
                                //use activity phaseCode to join
                                var oldCost = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber.ToString(), activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription,
                                                                                                "F", fte.FTEPositionID.ToString(), fte.EmployeeID.ToString(),
                                                                                                            null, null, null, null, null);
                                costExistInOtherTrend = (oldCost > 0) ? true : false;


                                //If the cost does not exist in any other trend -> remove -> create
                                //If it exist in other trends -> resuse

                                //Remove -> because the type and name is different now
                                if (!costExistInOtherTrend)
                                {
                                    CostLineItemTracker.removeCostLine("F", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber,phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                    category.SubCategoryID, fte.FTEPositionID.ToString(), fte.EmployeeID.ToString(), null, null, null, null, null, fte.CostLineItemID);
                                    if(!costLineItem.IsExist)
                                        costLineItem.LineNumber = int.Parse(fte.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    // costLineItem.LineNumber = int.Parse(fte.CostLineItemID.Split('.').LastOrDefault().ToString()); //Resue the line id number

                                    //Manasi 04-11-2020
                                    if (!newCostLineItem.IsExist)
                                        newCostLineItem.LineNumber = int.Parse(fte.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    // newCostLineItem.LineNumber = int.Parse(fte.CostLineItemID.Split('.').LastOrDefault().ToString()); //Resue the line id number


                                }

                                //Determine Line Number
                                if (costLineItem != null && costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + costLineItem.LineNumber.ToString();
                                else
                                    lineNumber = costLineItem.LineNumber.ToString();

                                //Manasi 04-11-2020
                                if (newCostLineItem != null && newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else
                                    lineNumber = newCostLineItem.LineNumber.ToString();

                                //Create line Item
                                //if (!costLineItem.IsExist )
                                if (!newCostLineItem.IsExist)
                                    CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                            category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, lineNumber);



                                //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                //                            phase.ActivityPhaseCode.ToString(),
                                //                      category.CategoryID, category.SubCategoryID, lineNumber);

                                //----------Manasi 26-10-2020-------------------------------------------
                                string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                year = year.Substring(2, 2);

                                lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                                phase.ActivityPhaseCode.ToString(),
                                                          category.CategoryID, category.SubCategoryID, lineNumber, year, "1", programElementClass.ProjectClassLineItemID);
                                //-------------------------------------------------------------------------

                            }
                            else
                            {//No changes in Employee and Position
                                lineItem = fte.CostLineItemID;

                                if (CostTrackTypeList!= null && CostTrackTypeList.ElementAt(i) != null && 
                                    CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == 4 || CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == '4')
                                {
                                    //do nothing
                                }
                                else
                                {
                                  
                                    //Check if costline already exist
                                    CostLineItemTracker existingCostLineItem = CostLineItemTracker.checkIfCostLineItemExist("F", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber,
                                                            phase.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID, ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, lineNumber, TrendNumber.ToString());
                                    lineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                    (costLineItem != null && costLineItem.LineNumber != 0) ? costLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Manasi 05-11-2020
                                    lineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                    (newCostLineItem != null && newCostLineItem.LineNumber != 0) ? newCostLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Regenerate the LineItem
                                    //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                    //                           phase.ActivityPhaseCode.ToString(),
                                    //                      category.CategoryID, category.SubCategoryID, lineNumber);

                                    //----------Manasi 26-10-2020-------------------------------------------
                                    string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                    year = year.Substring(2, 2);

                                    lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                               phase.ActivityPhaseCode.ToString(),
                                                          category.CategoryID, category.SubCategoryID, lineNumber, year, "1", programElementClass.ProjectClassLineItemID);
                                    //-------------------------------------------------------------------------


                                    if (existingCostLineItem == null)
                                        CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                              category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, lineNumber);


                                }

                            }


                           

                            Cost.saveFTECost(2, ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID,
                                              FTECostIDList[i], FTEStartDateList[i], FTEEndDateList[i], FTEPosition, FTECostList[i], FTEHourlyRate, FTEHoursList[i], FTETotalCostList[i],
                                              Scale, ftePoistionID, 1, 0, EmployeeID, lineItem); //LineNumber not getting udpated



                        
                            update_result += "";

                            duplicateOnUpdateFound = false;

                            OKForUpdate = false;
                        }
                    }

                    //Register the program
                    if (OKForRegister)
                    {
                        if (duplicateOnRegisterFound)
                        {
                            Employee employee = ctx.Employee.Where(a => a.ID == EmployeeID).FirstOrDefault();
                            update_result = "Duplicate found for employee: " + FTEPosition + " - " + employee.Name + ". \n";

                            return update_result;   //we done
                        }
                        else
                        {
                            bool isExist = false;
                            if (costLineItem != null)
                            {
                                if (costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + costLineItem.LineNumber.ToString();
                                else lineNumber = costLineItem.LineNumber.ToString();
                                isExist = costLineItem.IsExist;
                            }

                            //Manasi 06-11-2020
                            if (newCostLineItem != null)
                            {
                                if (newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else lineNumber = newCostLineItem.LineNumber.ToString();
                                isExist = newCostLineItem.IsExist;
                            }

                            //string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                            //                       phase.ActivityPhaseCode.ToString(),
                            //                 category.CategoryID, category.SubCategoryID, lineNumber);


                            //----------Manasi 26-10-2020-------------------------------------------
                            string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                            year = year.Substring(2, 2);

                            string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                  phase.ActivityPhaseCode.ToString(),
                                            category.CategoryID, category.SubCategoryID, lineNumber, year, "1", programElementClass.ProjectClassLineItemID);
                            //-------------------------------------------------------------------------

                            Cost.saveFTECost(1, ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID,
                                                FTECostIDList[i], FTEStartDateList[i], FTEEndDateList[i], FTEPosition, FTECostList[i], FTEHourlyRate, FTEHoursList[i], FTETotalCostList[i],
                                                Scale, ftePoistionID, 1, 0, EmployeeID, lineItem);
                            //Create line Item
                            //if (isExist == false)
                            //{
                            //    CostLineItemTracker.save(project.ProjectClassID.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                            //                           category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, lineNumber);

                            //}

                        }

                        update_result += "";

                        duplicateOnRegisterFound = false;

                        //OKForRegister = false;
                    }

                    
                }

                catch (Exception ex)
                {
                    Employee employee = ctx.Employee.Where(a => a.ID == EmployeeID).FirstOrDefault();
                    update_result = "Failed to update " + FTEPosition + " - " + employee.Name + ". \n";

                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }
                finally
                {
                    if (conn != null) conn.Close();
                    if (reader != null) reader.Close();
                    if (duplicateCheckerConn != null) conn.Close();
                    if (duplicateCheckReader != null) reader.Close();
                }
            }

            //=================== Jignesh-23-03-2021 BudVSActual-UnitcostUpdate-for-OT-DT-Reg-Hrs ==================================
            if (OKForUpdateAB && TrendNumber == "1000")
            {
                MySqlConnection conn1 = null;
                MySqlCommand command = null;
                int newCostID = 0;
                try
                {

                    conn1 = ConnectionManager.getConnection();
                    conn1.Open();
                    String query = "update_budget_vs_actual"; //Stored Procedure
                    command = new MySqlCommand(query, conn1);
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.Add(new MySqlParameter("_TrendNumber", TrendNumber));
                    command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                    command.Parameters.Add(new MySqlParameter("_Granularity", Scale));
                    command.Parameters.Add(new MySqlParameter("_LineNumber", CostLineItem));

                    command.ExecuteNonQuery();
                    OKForUpdateAB = false;
                }
                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }
                finally
                {
                    if (conn1 != null) conn1.Close();

                }
            }   
            //=======================================================================================================================

            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            if(OKForRegister)
                CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                     category.SubCategoryID, "F", ftePoistionID.ToString(), EmployeeID.ToString(), null, null, null, null, null, lineNumber);

            //}
            if (!OKForDelete)
             Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(lineID), Scale, "F");
            if (actualCostId > 0)
                Scaling.scaling(Convert.ToInt16(ActivityID), actualCostId, Scale, "F");
            return update_result;
        }
        public static String updateMultipleCostFTE(int Operation, String ProgramID, String ProgramElementID,
                                                    String ProjectID, String TrendNumber, String ActivityID,
                                                    String FTECostID1, String FTEStartDate, String FTEEndDate,
                                                    String FTEPosition, String FTEValue, String FTEHourlyRate,
                                                    String FTEHours, String FTECost, String Granularity,
                                                    String FTEIDList, String drag_direction, String NumberOfTextboxToBeRemoved, int EmployeeID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            var NumberOfTextbox = 0;
            var isZero = true;
            List<String> FTEValueList = FTEValue.Split(',').ToList();
            List<String> FTECostList = FTECost.Split(',').ToList();
            List<String> FTEStartDateList = FTEStartDate.Split(',').ToList();
            List<String> FTEEndDateList = FTEEndDate.Split(',').ToList();
            List<String> FTECostIDList = FTEIDList.Split(',').ToList();
            List<String> FTEHourList = FTEHours.Split(',').ToList();

            var ctx = new CPPDbContext();
            var ftePositionID = 0;
            var position = ctx.FtePosition.Where(f => f.PositionDescription == FTEPosition).FirstOrDefault();
            if (position != null)
                ftePositionID = Convert.ToInt16(position.Id);

            string costIdList = FTEIDList.ToString();

            // create and open a connection object
            conn = ConnectionManager.getConnection();
            conn.Open();

            //string query = "DELETE FROM cost_fte ";
            //query += " WHERE";
            //query += " FTECostID not in (@FTECostID) ";//'" + FTECostIDList[i] + "'";
            //query += " And Granularity = '" + Granularity + "'";
            //MySqlCommand command = new MySqlCommand(query, conn);
            //command.Parameters.AddWithValue("@FTECostID", costIdList);
            //command.ExecuteNonQuery();
            try
            {
                if (drag_direction == "right-left")
                {
                    Activity activity = Activity.getActivityByID(ActivityID);
                    var activityEndDate = activity.ActivityEndDate;
                    for (int i = 0; i < FTECostIDList.Count; i++)
                    {
                        try
                        {

                            //Check if program exists in system
                            string query = "SELECT FTEcostID from cost_fte";
                            query += " WHERE 1=1 AND IsDeleted!=true";
                            query += " AND FTECostID = @FTECostID";//'" + FTECostIDList[i] + "'";
                            query += " And Granularity = @Granularity and IsDeleted=false";

                            MySqlCommand command = new MySqlCommand(query, conn);
                            command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                            command.Parameters.AddWithValue("@Granularity", Granularity);
                            using (reader = command.ExecuteReader())
                            {
                                if (reader.HasRows)
                                {
                                    reader.Read();
                                    if (reader.GetValue(0).ToString().Trim() == FTECostIDList[i])
                                        OKForUpdate = true;
                                }
                                else
                                    update_result += "Role '" + FTECostIDList[i] + "' does not exist in system";
                            }

                            //Update the Program
                            if (OKForUpdate)
                            {
                                //if (!FTECostList[i].Equals("0"))
                                //{
                                var tempID = FTECostIDList[i];
                                if (Convert.ToDateTime(FTEStartDateList[i]) >= Convert.ToDateTime(activityEndDate)) //delete
                                {
                                    //query = "DELETE FROM cost_fte ";
                                    query = "UPDATE cost_fte SET";
                                    query += " IsDeleted = @IsDeleted,";
                                    query += " DeletedBy = '',";
                                    query += " DeletedDate = @DeletedDate";
                                    query += " WHERE";
                                    query += " FTECostID = @FTECostID";//'" + FTECostIDList[i] + "'";
                                    query += " And Granularity = @Granularity";
                                    command = new MySqlCommand(query, conn);
                                    command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                                    command.Parameters.AddWithValue("@Granularity", Granularity);
                                    command.Parameters.AddWithValue("@IsDeleted", 1);
                                    command.Parameters.AddWithValue("@DeletedDate", DateTime.Now);
                                    command.ExecuteNonQuery();
                                }
                                else
                                {
                                    query = "UPDATE cost_fte SET";
                                    // query += " FTECostID = '" + newFTECostID + "',";
                                    query += " FTEStartDate = @FTEStartDateList,";
                                    query += " FTEEndDate = @FTEEndDateList,";
                                    query += " FTEPosition = @FTEPosition,";
                                    query += " FTEValue = @FTEValueList,";
                                    query += " FTEHourlyRate = @FTEHourlyRate,";
                                    query += " FTEHours = @FTEHourList,";
                                    query += " FTECost = @FTECostList,";
                                    query += " Granularity = @Granularity,";
                                    query += " FTEPositionID = @ftePositionID,";
                                    query += " EmployeeID = @EmployeeID";
                                    //No need to update costlineItem on update method
                                    query += " WHERE";
                                    query += " FTECostID = @FTECostID";//'" + FTECostIDList[i] + "'";
                                    query += " And Granularity = @Granularity";
                                    command = new MySqlCommand(query, conn);
                                    command.Parameters.AddWithValue("@FTEStartDateList", FTEStartDateList[i]);
                                    command.Parameters.AddWithValue("@FTEEndDateList", FTEEndDateList[i]);
                                    command.Parameters.AddWithValue("@FTEPosition", FTEPosition);
                                    command.Parameters.AddWithValue("@FTEValueList", FTEValueList[i]);
                                    command.Parameters.AddWithValue("@FTEHourlyRate", FTEHourlyRate);
                                    command.Parameters.AddWithValue("@FTEHourList", FTEHourList[i]);
                                    command.Parameters.AddWithValue("@FTECostList", FTECostList[i]);
                                    command.Parameters.AddWithValue("@ftePositionID", ftePositionID);
                                    command.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                                    command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                                    command.Parameters.AddWithValue("@Granularity", Granularity);
                                    command.ExecuteNonQuery();
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


                    }
                }
                else
                {
                    //left-right
                    for (int i = 0; i < FTECostIDList.Count; i++)
                    {
                        try
                        {
                            //Check if program exists in system
                            string query = "SELECT FTEcostID from cost_fte";
                            query += " WHERE 1=1 AND IsDeleted!=true";
                            query += " AND FTECostID = @FTECostID";//'" + FTECostIDList[i] + "'";
                            query += " And Granularity = @Granularity And IsDeleted=false";

                            MySqlCommand command = new MySqlCommand(query, conn);
                            command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                            command.Parameters.AddWithValue("@Granularity", Granularity);
                            using (reader = command.ExecuteReader())
                            {
                                if (reader.HasRows)
                                {
                                    reader.Read();
                                    if (reader.GetValue(0).ToString().Trim() == FTECostIDList[i])
                                        OKForUpdate = true;
                                }
                                else
                                    update_result += "Role '" + FTECostIDList[i] + "' does not exist in system";
                            }

                            //Update the Program
                            if (OKForUpdate)
                            {
                                //if (!FTECostList[i].Equals("0"))
                                //{
                                var tempID = FTECostIDList[i];
                                var count = 0;
                                var newFTECostID = "";
                                var TextboxID = 0;
                                if (drag_direction == "left-right")
                                {

                                    for (int k = tempID.Length - 1; tempID[k] != '_'; k--)
                                    {
                                        count++;
                                    }
                                    TextboxID = int.Parse(tempID.Substring(tempID.Length - count));
                                    var firstPartID = tempID.Substring(0, tempID.Length - count);

                                    NumberOfTextbox = TextboxID - int.Parse(NumberOfTextboxToBeRemoved);
                                    newFTECostID = firstPartID + NumberOfTextbox.ToString();
                                }
                                else
                                {
                                    newFTECostID = FTECostIDList[i];
                                }
                                if (NumberOfTextbox >= 0)
                                {
                                    query = "UPDATE cost_fte SET";
                                    query += " FTECostID = @newFTECostID,";
                                    query += " FTEStartDate = @FTEStartDateList,";
                                    query += " FTEEndDate = @FTEEndDateList,";
                                    query += " FTEPosition = @FTEPosition,";
                                    query += " FTEValue = @FTEValueList,";
                                    query += " FTEHourlyRate = @FTEHourlyRate,";
                                    query += " FTEHours = @FTEHourList,";
                                    query += " FTECost = @FTECostList,";
                                    query += " Granularity = @Granularity,";
                                    query += " FTEPositionID = @ftePositionID,";
                                    query += " EmployeeID = @EmployeeID ";
                                    query += " WHERE";
                                    query += " FTECostID = @FTECostID";//'" + FTECostIDList[i] + "'";
                                    query += " And Granularity = @Granularity";
                                    command = new MySqlCommand(query, conn);
                                    command.Parameters.AddWithValue("@newFTECostID", newFTECostID);
                                    command.Parameters.AddWithValue("@FTEStartDateList", FTEStartDateList[i]);
                                    command.Parameters.AddWithValue("@FTEEndDateList", FTEEndDateList[i]);
                                    command.Parameters.AddWithValue("@FTEPosition", FTEPosition);
                                    command.Parameters.AddWithValue("@FTEValueList", FTEValueList[i]);
                                    command.Parameters.AddWithValue("@FTEHourlyRate", FTEHourlyRate);
                                    command.Parameters.AddWithValue("@FTEHourList", FTEHourList[i]);
                                    command.Parameters.AddWithValue("@FTECostList", FTECostList[i]);
                                    command.Parameters.AddWithValue("@ftePositionID", ftePositionID);
                                    command.Parameters.AddWithValue("@EmployeeID", EmployeeID);
                                    command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                                    command.Parameters.AddWithValue("@Granularity", Granularity);
                                    command.ExecuteNonQuery();
                                }
                                //}
                                else if (NumberOfTextbox < 0)
                                {
                                    //query = "DELETE FROM cost_fte ";
                                    query = "UPDATE cost_fte SET";
                                    query += " IsDeleted = @IsDeleted,";
                                    query += " DeletedBy = '',";
                                    query += " DeletedDate = @DeletedDate";
                                    query += " WHERE";
                                    query += " FTECostID = @FTECostID";//'" + FTECostIDList[i] + "'";
                                    query += " And Granularity = @Granularity";
                                    command = new MySqlCommand(query, conn);
                                    command.Parameters.AddWithValue("@FTECostID", FTECostIDList[i]);
                                    command.Parameters.AddWithValue("@Granularity", Granularity);
                                    command.Parameters.AddWithValue("@IsDeleted", 1);
                                    command.Parameters.AddWithValue("@DeletedDate", DateTime.Now);
                                    command.ExecuteNonQuery();
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


                    }
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
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
            


            update_result = "Success";
            Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(FTECostID1), Granularity, "F");
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Granularity);
            return update_result;

        }
        public static String updateCostFTELeftLeft(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String FTECostID1, String FTEStartDate, String FTEEndDate, String FTEPosition, 
            String FTEValue, String FTEHourlyRate, String FTEHours, String FTECost, String Granularity, String FTEIDList, int EmployeeID, String CostLineItemID, int CostTrackTypeID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            
            bool OKForRegister = false;
            bool isZero = true;
            List<String> FTEValueList = FTEValue.Split(',').ToList();
            List<String> FTECostList = FTECost.Split(',').ToList();
            List<String> FTEStartDateList = FTEStartDate.Split(',').ToList();
            List<String> FTEEndDateList = FTEEndDate.Split(',').ToList();
            List<String> FTECostIDList = FTEIDList.Split(',').ToList();
            List<String> FTEHoursList = FTEHours.Split(',').ToList();
            String currentUser = UserUtil.getCurrentUserName();
            var ctx = new CPPDbContext();
            var ftePositionId = 0;
            var position = ctx.FtePosition.Where(f => f.PositionDescription == FTEPosition).FirstOrDefault();
            if (position != null)
                ftePositionId = position.Id;

            for (int i = 0; i < FTECostIDList.Count; i++)
            {
                try
                {
                    // create and open a connection object
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    //Check if program exists in system
                    String query = "SELECT FTEcostID from cost_fte";
                    query += " WHERE 1=1 AND IsDeleted!=true";
                    query += " AND FTECostID = @FTECostIDList";
                    query += " And Granularity = @Granularity And IsDeleted=false";
                    MySqlCommand command = new MySqlCommand(query, conn);
                    command.Parameters.AddWithValue("@FTECostIDList", FTECostIDList[i]);
                    command.Parameters.AddWithValue("@Granularity", Granularity);
                    using (reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();

                            if (reader.GetValue(0).ToString().Trim() == FTECostIDList[i])
                                OKForUpdate = true;

                        }
                        else  //Insert new entity
                        {

                            OKForRegister = true;

                        }
                    }

                    //Update the Program
                    if (OKForUpdate)
                    {
                        var hour = "0";
                        if (FTECostList[i] == "0")
                        {
                            hour = "0";
                        }
                        else
                        {
                            hour = FTEHours;
                        }
                        //query = "UPDATE cost_fte SET";

                        //query += " FTEStartDate = '" + DateTime.Parse(FTEStartDateList[i]).ToString(SQL_DATE_FORMAT) + "',";
                        //query += " FTEEndDate = '" + DateTime.Parse(FTEEndDateList[i]).ToString(SQL_DATE_FORMAT) + "',";
                        //query += " FTEPosition = '" + FTEPosition + "',";
                        //query += " FTEValue = '" + FTEValueList[i] + "',";
                        //query += " FTEHourlyRate = '" + FTEHourlyRate + "',";
                        //query += " FTEHours = '" + FTEHoursList[i] + "',";
                        //query += " FTECost = '" + FTECostList[i] + "',";
                        //query += " Granularity = '" + Granularity + "',";
                        //query += " FTEPositionID = " + ftePositionId + ",";
                        //query += " EmployeeID = '" + EmployeeID + "',";
                        //query += " UpdatedBy='" +currentUser + "'," ;
                        //query += " UpdatedDate='" + DateTime.UtcNow.ToString(DateUtility.getSqlDateFormat()) + "'";
                        ////No need to update costlineitemid on update method
                        //query += " WHERE";
                        //query += " FTECostID = '" + FTECostIDList[i] + "'";
                        //query += " And Granularity = '" + Granularity + "'";
                        //command = new MySqlCommand(query, conn);
                        //command.ExecuteNonQuery();
                        Cost.saveFTECost(2, ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID,
                                            FTECostIDList[i], FTEStartDateList[i], FTEEndDateList[i], FTEPosition, FTEValueList[i], FTEHourlyRate, FTEHoursList[i], FTECostList[i],
                                            Granularity, ftePositionId, 1, 0, EmployeeID, CostLineItemID); //LineNumber not getting udpated

                        OKForUpdate = false;
                    }

                    if (OKForRegister)
                    {

                        //query = "INSERT INTO cost_fte (FTECostID, ActivityID, FTEStartDate, FTEEndDate, FTEPosition, FTEValue, FTEHourlyRate, FTEHours, FTECost, Granularity, FTEPositionID, EmployeeID, CostLineItemID, CostTrackTypeID,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate,OriginalCost) VALUES";
                        //query += " (";
                        //query += "'" + FTECostIDList[i] + "', ";
                        //query += "'" + ActivityID + "', ";
                        //query += "'" + DateTime.Parse(FTEStartDateList[i]).ToString(SQL_DATE_FORMAT) + "',";
                        //query += "'" + DateTime.Parse(FTEEndDateList[i]).ToString(SQL_DATE_FORMAT) + "',";
                        //query += "'" + FTEPosition + "',";
                        //query += "'" + FTEValueList[i] + "',";
                        //query += "'" + FTEHourlyRate + "',";
                        //query += "'" + FTEHoursList[i] + "',";
                        //query += "'" + FTECostList[i] + "',";
                        //query += "'" + Granularity + "',";
                        //query += " " + ftePositionId + ",";
                        //query += " " + EmployeeID + ", ";
                        //query += " '" + CostLineItemID + "',";
                        //query += " " + 1 + ","; //Estimated Cost
                        //query += " '" + currentUser  + "',"; //CreatedBy
                        //query += " '" + currentUser + "',"; //UpdatedBy
                        //query += " '" + DateTime.UtcNow.ToString(DateUtility.getSqlDateFormat()) + "',"; //CreatedDate
                        //query += " '" + DateTime.UtcNow.ToString(DateUtility.getSqlDateFormat()) + "',"; //UpdatedDate
                        //query += " '" + FTECostList[i] + "'"; //UpdatedDate
                        //query += ")";

                        //command = new MySqlCommand(query, conn);
                        //command.ExecuteNonQuery();
                        Cost.saveFTECost(1, ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID,
                                           FTECostIDList[i], FTEStartDateList[i], FTEEndDateList[i], FTEPosition, FTEValueList[i], FTEHourlyRate, FTEHoursList[i], FTECostList[i],
                                           Granularity, ftePositionId, 1, 0, EmployeeID, CostLineItemID); //LineNumber not getting udpated

                        OKForRegister = false;
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
                    if (conn != null) conn.Close();
                    if (reader != null) reader.Close();
                }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


            }


            update_result = "Success";
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Granularity);
            Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(FTECostID1), Granularity, "F");
            return update_result;

        }

    }

    [Table("cost_lumpsum")]
    public class CostLumpsum : Audit
    {

        [NotMapped]
        public int Operation { get; set; }
        [NotMapped]
        public String ProgramID { get; set; }
        [NotMapped]
        public String ProgramElementID { get; set; }
        [NotMapped]
        public String ProjectID { get; set; }
        [NotMapped]
        public String TrendNumber { get; set; }
        [NotMapped]
        public String PhaseCode { get; set; }
        [NotMapped]
        public String TextBoxID { get; set; }
        [NotMapped]
        public String CostTrackTypes { get; set; }
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int ActivityID { get; set; }
        public String LumpsumCostID { get; set; }
        public String LumpsumCostStartDate { get; set; }
        public String LumpsumCostEndDate { get; set; }
        public String LumpsumDescription { get; set; }
        public String LumpsumCost { get; set; }
        public String Granularity { get; set; }
        public int CostTrackTypeID { get; set; }
        public int EstimatedCostID { get; set; }
        public int SubcontractorTypeID { get; set; }
        public int SubcontractorID { get; set; }
        public String CostLineItemID { get; set; }
        public String OriginalCost { get; set; }
        public String ActualBudget { get; set; } // swapnil 24-11-2020
        //Nivedita 10022022
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }

        [ForeignKey("SubcontractorID")]
        public virtual Subcontractor Subcontractor { get; set; }

        [ForeignKey("ActivityID")]
        public virtual Activity Activity { get; set; }
        //public CostLumpsum(String id, String st_date, String end_date, String desc, String cost)
        //{ LumpsumCostID = id; LumpsumCostStartDate = st_date; LumpsumCostEndDate = end_date; LumpsumDescription = desc; LumpsumCost = cost; }
        //public CostLumpsum() { }
        private static String SQL_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
        public static List<CostLumpsum> getCostRow(String ActivityID, String Granularity, String LineID, String CostType)
        {
            List<CostLumpsum> results = new List<CostLumpsum>();
            using (var ctx = new CPPDbContext())
            {
                String query = "CALL get_cost_row(@ActivityID,@LineID,@Granularity,@CostType)";
                results = ctx.Database.SqlQuery<CostLumpsum>(query,
                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                             new MySql.Data.MySqlClient.MySqlParameter("@LineID", LineID),
                                              new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                               new MySql.Data.MySqlClient.MySqlParameter("@CostType", "L")
                                        ).ToList();
            }
            return results;
        }
        //From RequestLumpsumCostController
        public static List<CostLumpsum> getCostLumpsum(String ActivityID, String Granularity,String TrendNumber,String ProjectID, String PhaseCode,String BudgetID, String BudgetCategory, String BudgetSubCategory)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<CostLumpsum> RetreivedLumpsumCosts = new List<CostLumpsum>();

            try
            {

                using (var ctx = new CPPDbContext())
                {
                    //CostLumpsum MatchedLumpsumCost = new CostLumpsum();
                    List<CostLumpsum> MatchedCostList = new List<CostLumpsum>();
                    var aID = Convert.ToInt16(ActivityID);
                    DateTime cutOffDate = DateUtility.getCutOffDate(Granularity);
                    Activity act = ctx.Activity.Where(a => a.ActivityID == aID).FirstOrDefault();
                    if (TrendNumber == "1000") //Actual, Estimate to completion cost
                        MatchedCostList = ctx.Database.SqlQuery<CostLumpsum>("call getActualEtcCost(@ProjectID, @CutOffDate, @CostType, @Granularity, @MainCategory, @SubCategory, @PhaseCode)",
                                                          new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", act.ProjectID),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@CutOffDate", cutOffDate.ToString("yyyy-MM-dd")),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@CostType", "L"),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@MainCategory", act.BudgetCategory),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@SubCategory", act.BudgetSubCategory),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode)
                                                          )
                                                          .ToList();
                    else if(TrendNumber == "2000")
                    {
                        //IEnumerable<List<CostLumpsum>> lumpsumList = ctx.Database.SqlQuery<CostLumpsum>("call get_forecast_cost(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                        //                                    //new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", PhaseCode),
                        //                                    //new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", BudgetCategory),
                        //                                    //new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", BudgetSubCategory),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory),  //Manasi 29-07-2020
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory),  //Manasi 29-07-2020
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@CostType", "L"),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity)
                        //                                    ). GroupBy(a => new { a.SubcontractorTypeID, a.SubcontractorID}).Select(a => a.ToList());

                        //-------------------Manasi 10-11-2020--------------------------
                        IEnumerable<List<CostLumpsum>> lumpsumList = ctx.Database.SqlQuery<CostLumpsum>("call get_forecast_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@CostType", "L"),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity)
                                                            ).GroupBy(a => new { a.SubcontractorTypeID, a.SubcontractorID }).Select(a => a.ToList());

                        int lineId = 1;
                        foreach(List<CostLumpsum> list in lumpsumList)
                        {
                             int cellId = 0;
                            foreach(CostLumpsum cost in list)
                            {
                                cost.LumpsumCostID = ActivityID + "_" + lineId + "_" + cellId;
                                cellId += 1;
                                MatchedCostList.Add(cost);
                            }
                            lineId += 1;
                        }
                                                         
                        
                    }

                    //-------------------Manasi 10-11-2020--------------------------
                    else if (TrendNumber == "3000")
                    {
                        IEnumerable<List<CostLumpsum>> lumpsumList = ctx.Database.SqlQuery<CostLumpsum>("call get_current_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@CostType", "L"),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity)
                                                            ).GroupBy(a => new { a.SubcontractorTypeID, a.SubcontractorID }).Select(a => a.ToList());

                        int lineId = 1;
                        foreach (List<CostLumpsum> list in lumpsumList)
                        {
                            int cellId = 0;
                            foreach (CostLumpsum cost in list)
                            {
                                cost.LumpsumCostID = ActivityID + "_" + lineId + "_" + cellId;
                                cellId += 1;
                                MatchedCostList.Add(cost);
                            }
                            lineId += 1;
                        }


                    }

                    else
                          MatchedCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aID && l.Granularity == Granularity).ToList();
                    foreach (var MatchedLumpsumCost in MatchedCostList)
                    {
                        //Split CostID into ActivityID, RowID, TextBoxID
                        String[] LumpsumCostID = MatchedLumpsumCost.LumpsumCostID.ToString().Trim().Split('_');
                        //Find if an entry for this RowID exists
                        int i = RetreivedLumpsumCosts.FindIndex(LumpsumCost => LumpsumCost.LumpsumCostID == LumpsumCostID[1]);

                        if (i >= 0) //RowID exists
                        {
                            RetreivedLumpsumCosts[i].TextBoxID += ", " + LumpsumCostID[2];
                            RetreivedLumpsumCosts[i].LumpsumCost += ", " + MatchedLumpsumCost.LumpsumCost;
                            RetreivedLumpsumCosts[i].OriginalCost += ", " + MatchedLumpsumCost.OriginalCost;
                            RetreivedLumpsumCosts[i].LumpsumCostStartDate += ", " + MatchedLumpsumCost.LumpsumCostStartDate;
                            RetreivedLumpsumCosts[i].LumpsumCostEndDate += ", " + MatchedLumpsumCost.LumpsumCostEndDate;
                            RetreivedLumpsumCosts[i].CostTrackTypes += ", " + MatchedLumpsumCost.CostTrackTypeID;
                            //RetreivedLumpsumCosts[i].ActualBudget += ", " + MatchedLumpsumCost.ActualBudget; // swapnil 24-11-2020
                        }
                        else //RowID does not exist. Add new entry in List
                        {
                            int rowID = int.Parse(LumpsumCostID[1]);
                            for (int j = 0; j <= int.Parse(LumpsumCostID[1]); j++)
                            {
                                if (RetreivedLumpsumCosts.ElementAtOrDefault(j) == null)
                                    RetreivedLumpsumCosts.Add(new CostLumpsum());
                            }
                            RetreivedLumpsumCosts[rowID].TextBoxID = LumpsumCostID[2];
                            RetreivedLumpsumCosts[rowID].LumpsumCostID = rowID.ToString(); ;
                            RetreivedLumpsumCosts[rowID].ActivityID = MatchedLumpsumCost.ActivityID;
                            RetreivedLumpsumCosts[rowID].LumpsumCostStartDate = MatchedLumpsumCost.LumpsumCostStartDate;
                            RetreivedLumpsumCosts[rowID].LumpsumCostEndDate = MatchedLumpsumCost.LumpsumCostEndDate;
                            RetreivedLumpsumCosts[rowID].LumpsumDescription = MatchedLumpsumCost.LumpsumDescription;
                            RetreivedLumpsumCosts[rowID].LumpsumCost = MatchedLumpsumCost.LumpsumCost;
                            RetreivedLumpsumCosts[rowID].OriginalCost = MatchedLumpsumCost.OriginalCost;
                            RetreivedLumpsumCosts[rowID].Granularity = MatchedLumpsumCost.Granularity;
                            RetreivedLumpsumCosts[rowID].EstimatedCostID = MatchedLumpsumCost.EstimatedCostID;
                            RetreivedLumpsumCosts[rowID].CostTrackTypeID = MatchedLumpsumCost.CostTrackTypeID;
                            RetreivedLumpsumCosts[rowID].SubcontractorTypeID = MatchedLumpsumCost.SubcontractorTypeID;
                            RetreivedLumpsumCosts[rowID].SubcontractorID = MatchedLumpsumCost.SubcontractorID;
                            RetreivedLumpsumCosts[rowID].CostTrackTypes = MatchedLumpsumCost.CostTrackTypeID.ToString();
                            RetreivedLumpsumCosts[rowID].CostLineItemID = MatchedLumpsumCost.CostLineItemID;
                            RetreivedLumpsumCosts[rowID].OriginalCost = MatchedLumpsumCost.OriginalCost;
                            RetreivedLumpsumCosts[rowID].ActualBudget += ", " + MatchedLumpsumCost.ActualBudget;// swapnil 24-11-2020
                        }//End else
                    }
                    //    }//End reader read
                    //}//End executing reader
                }
                for (int j = 0; j < RetreivedLumpsumCosts.Count; j++)
                {
                    if (RetreivedLumpsumCosts[j].ActivityID == null || RetreivedLumpsumCosts[j].ActivityID == 0)
                    {
                        RetreivedLumpsumCosts.RemoveAt(j);
                        j = -1;
                    }
                }

                //To sort String arrays based on TextBoxID
                for (int j = 0; j < RetreivedLumpsumCosts.Count; j++)
                {
                    //Sort arrays by TextBoxID
                    if (RetreivedLumpsumCosts[j].TextBoxID != null)
                    {
                        int[] a_sortTextBoxID = RetreivedLumpsumCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] b_sortTextBoxID = RetreivedLumpsumCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] c_sortTextBoxID = RetreivedLumpsumCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();

                        String[] sortLumpsumCost = RetreivedLumpsumCosts[j].LumpsumCost.ToString().Trim().Split(',');
                        String[] sortLumpsumCostStartDate = RetreivedLumpsumCosts[j].LumpsumCostStartDate.ToString().Trim().Split(',');
                        String[] sortLumpsumCostEndDate = RetreivedLumpsumCosts[j].LumpsumCostEndDate.ToString().Trim().Split(',');

                        Array.Sort(a_sortTextBoxID, sortLumpsumCost);
                        Array.Sort(b_sortTextBoxID, sortLumpsumCostStartDate);
                        Array.Sort(c_sortTextBoxID, sortLumpsumCostEndDate);
                    }

                }


            }//End try

            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {

            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return RetreivedLumpsumCosts;
        }

        //From RegisterLumpsumCostController
        public static String updateCostLumpsum(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String LumpsumCostID, String StartDate, String EndDate, String Description, String TextBoxValue, String Scale, String FTEIDList, int SubcontractorTypeID, int SubcontractorID,String CostTrackTypes,String CostLineID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            MySqlConnection duplicateCheckerConn = null;
            MySqlDataReader duplicateCheckReader = null;
            bool duplicateOnRegisterFound = false;
            bool duplicateOnUpdateFound = false;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForRegister = false;
            bool OKForDelete = false;
            bool isZero = true;
            int zero = 0;
            String lineNumber = "";
            var ctx = new CPPDbContext();
            int pID = Convert.ToInt32(ProjectID);
            var project = ctx.Project.Where(p => p.ProjectID == pID && p.IsDeleted==false).FirstOrDefault();
            var projectClass = ctx.ServiceClass.Where(a => a.ID == project.ProjectClassID).FirstOrDefault();
            var programElement = ctx.ProgramElement.Include("ProjectClass").Where(pm => pm.ProgramElementID == project.ProgramElementID && pm.IsDeleted==false).FirstOrDefault();
            var programElementClass = ctx.ProjectClass.Where(a => a.ProjectClassID == programElement.ProjectClassID).FirstOrDefault();  //Manasi 27-10-2020
            var program = ctx.Program.Where(p => p.ProgramID == programElement.ProgramID && p.IsDeleted==false);
            int aID = int.Parse(ActivityID);
            var activity = ctx.Activity.Where(a => a.ActivityID == aID && a.IsDeleted==false).FirstOrDefault();
            var phase = ctx.PhaseCode.Where(a => a.PhaseID == activity.PhaseCode).FirstOrDefault();
            var category = Activity.getActivityCategory(activity);
            var actualCostId = 0;
            ProgramID = (program.FirstOrDefault().ProgramID).ToString();
            ProgramElementID = (programElement.ProgramElementID).ToString();
           // ProjectID = (project.FirstOrDefault().ProjectID).ToString();
            List<String> LumpsumCostIDList = null;

            List<String> LumpsumCost = (TextBoxValue != "") ? TextBoxValue.Split(',').ToList() : new List<String>();
            var total = LumpsumCost.Sum(a => Convert.ToDouble(a));
            // List<String> FTECostList = FTECost.Split(',').ToList();
            List<String> LumpsumStartDateList = StartDate.Split(',').ToList();
            List<String> LumpsumEndDateList = EndDate.Split(',').ToList();
            List<String> CostTrackTypeList = null;
           
            //luan duplicate check experimental
            //if (LumpsumStartDateList.Any()) //prevent IndexOutOfRangeException for empty list
            //{
            //    LumpsumStartDateList.RemoveAt(LumpsumStartDateList.Count - 1);
            //}
            //if (LumpsumEndDateList.Any()) //prevent IndexOutOfRangeException for empty list
            //{
            //    LumpsumEndDateList.RemoveAt(LumpsumEndDateList.Count - 1);
            //}

            if (CostTrackTypes != null && CostTrackTypes != "")
                CostTrackTypeList =  CostTrackTypes.Split(',').ToList();
            if(FTEIDList == null)
            {
                LumpsumCostIDList = new List<String>();
                List<String> textBoxValues = TextBoxValue.Split(',').ToList();
                for(int i = 0; i < textBoxValues.Count; i++)
                {
                    String lineItemId = ActivityID + "_" + LumpsumCostID + "_" + i.ToString();
                    LumpsumCostIDList.Add(lineItemId);
                }
            }else
                LumpsumCostIDList = FTEIDList.Split(',').ToList();

            var lineId = LumpsumCostIDList[0].Split('_')[1];
             int minArrayCount = Math.Min(LumpsumStartDateList.Count, LumpsumCostIDList.Count);


            //getting line numner 01,02
            CostLineItemResult costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                               category.CategoryID, category.SubCategoryID, "L", null, null, null, null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString());

            //Manasi 05-11-2020
            CostLineItemResult newCostLineItem = CostLineItemResult.getNewCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                               category.CategoryID, category.SubCategoryID, "L", null, null, null, null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString(), ProjectID);

            try
            {
                MySqlCommand command = null;
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();
                for (int i = 0; i < minArrayCount; i++)
                {

                    if (CostTrackTypeList != null && i < CostTrackTypeList.Count &&
                  (CostTrackTypeList.ElementAt(i).FirstOrDefault() == 3 || CostTrackTypeList.ElementAt(i).Trim() == "3"))
                        continue;

                    String query = "";



                    //Check if program exists in system
                    query = "SELECT LumpsumCostID from cost_lumpsum";
                    query += " WHERE 1=1 ";
                    query += " AND LumpsumCostID = @LumpsumCostIDList";
                    query += " And Granularity = @Scale and IsDeleted=false";
                    command = new MySqlCommand(query, conn);
                    command.Parameters.AddWithValue("@LumpsumCostIDList", LumpsumCostIDList[i]);
                    command.Parameters.AddWithValue("@Scale", Scale);
                    using (reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();

                            if (reader.GetValue(0).ToString().Trim() == LumpsumCostIDList[i] && Operation != 3)
                            {
                                //Luan experimental update
                                if (i == 0)
                                {
                                    var LumpsumStartDateWithTime = DateTime.Parse(LumpsumStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                    var LumpsumEndDateWithTime = DateTime.Parse(LumpsumEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                    query = "SELECT LumpsumCostID from cost_lumpsum";
                                    query += " WHERE 1=1";
                                    query += " AND SubcontractorID = @SubcontractorID";
                                    query += " And SubcontractorTypeID = @SubcontractorTypeID";
                                    query += " And ActivityID = @ActivityID";
                                    query += " And (LumpsumCostStartDate = @LumpsumStartDateList OR LumpsumCostStartDate = @LumpsumStartDateWithTime)";
                                    query += " And (LumpsumCostEndDate = @LumpsumEndDateList OR LumpsumCostEndDate =@LumpsumEndDateWithTime)";
                                    query += " And LumpsumCostID != @LumpsumCostIDList";
                                    query += " And CostTrackTypeID = @CostTrackTypeList and IsDeleted=false";
                                    duplicateCheckerConn = ConnectionManager.getConnection();
                                    duplicateCheckerConn.Open();
                                    command = new MySqlCommand(query, duplicateCheckerConn);
                                    command.Parameters.AddWithValue("@SubcontractorID", SubcontractorID);
                                    command.Parameters.AddWithValue("@SubcontractorTypeID", SubcontractorTypeID);
                                    command.Parameters.AddWithValue("@ActivityID", ActivityID);
                                    command.Parameters.AddWithValue("@LumpsumStartDateList", LumpsumStartDateList[i]);
                                    command.Parameters.AddWithValue("@LumpsumStartDateWithTime", LumpsumStartDateWithTime);
                                    command.Parameters.AddWithValue("@LumpsumEndDateList", LumpsumEndDateList[i]);
                                    command.Parameters.AddWithValue("@LumpsumEndDateWithTime", LumpsumEndDateWithTime);
                                    command.Parameters.AddWithValue("@LumpsumCostIDList", LumpsumCostIDList[i]);
                                    command.Parameters.AddWithValue("@CostTrackTypeList", CostTrackTypeList[i]);
                                    using (duplicateCheckReader = command.ExecuteReader())
                                    {
                                        if (duplicateCheckReader.HasRows)
                                        {
                                            duplicateOnUpdateFound = true;
                                        }
                                    }
                                }

                                OKForUpdate = true;
                            }
                            else if (Operation == 3)
                            {
                                OKForDelete = true;
                            }

                        }
                        else
                        {
                            //Luan experimental create
                            if (i == 0)
                            {
                                var LumpsumStartDateWithTime = DateTime.Parse(LumpsumStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                var LumpsumEndDateWithTime = DateTime.Parse(LumpsumEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                query = "SELECT LumpsumCostID from cost_lumpsum";
                                query += " WHERE 1=1";
                                query += " AND SubcontractorID = @SubcontractorID";
                                query += " And SubcontractorTypeID = @SubcontractorTypeID";
                                query += " And ActivityID = @ActivityID";
                                query += " And (LumpsumCostStartDate = @LumpsumStartDateList OR LumpsumCostStartDate = @LumpsumStartDateWithTime)";
                                query += " And (LumpsumCostEndDate = @LumpsumEndDateList OR LumpsumCostEndDate =@LumpsumEndDateWithTime) and IsDeleted=false";
                                duplicateCheckerConn = ConnectionManager.getConnection();
                                duplicateCheckerConn.Open();
                                command = new MySqlCommand(query, duplicateCheckerConn);
                                command.Parameters.AddWithValue("@SubcontractorID", SubcontractorID);
                                command.Parameters.AddWithValue("@SubcontractorTypeID", SubcontractorTypeID);
                                command.Parameters.AddWithValue("@ActivityID", ActivityID);
                                command.Parameters.AddWithValue("@LumpsumStartDateList", LumpsumStartDateList[i]);
                                command.Parameters.AddWithValue("@LumpsumStartDateWithTime", LumpsumStartDateWithTime);
                                command.Parameters.AddWithValue("@LumpsumEndDateList", LumpsumEndDateList[i]);
                                command.Parameters.AddWithValue("@LumpsumEndDateWithTime", LumpsumEndDateWithTime);
                                
                                using (duplicateCheckReader = command.ExecuteReader())
                                {
                                    if (duplicateCheckReader.HasRows)
                                    {
                                        duplicateOnRegisterFound = true;
                                    }
                                }
                            }

                            OKForRegister = true;
                        }
                    }

                    //Delete the cost
                    if (OKForDelete)
                    {
                        String lumpsumID = LumpsumCostIDList[i];
                        CostLumpsum lumpsum = ctx.CostLumpsum.Where(a => a.LumpsumCostID == lumpsumID).FirstOrDefault(); //some attributes are missing from delete when passed from the frontend

                        //Delete CostLineItemTracke
                        if (lumpsum != null)
                        {
                            //Check if the lineNumber still used by other cost
                            //check_if_cost_exist_in_other_trend
                            //int zero = 0;
                            var result = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber, activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription, "L", null, null,
                                                                                       null, lumpsum.SubcontractorTypeID.ToString(), lumpsum.SubcontractorID.ToString(), null, null);
                            if (result == 0) //This cost is not being used in other trend
                            {
                                CostLineItemTracker.removeCostLine("L", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                category.SubCategoryID, null, null, lumpsum.SubcontractorTypeID.ToString(), lumpsum.SubcontractorID.ToString(), null, null, null, null);
                            }

                            Cost.saveLumpsumCost("3", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, LumpsumCostIDList[i], "", "", "", "",
                                               Scale, 0, 0, lumpsum.SubcontractorTypeID, lumpsum.SubcontractorID, null); //Delete
                        }

                        update_result += "";

                
                    }
                    //Update the Program
                    if (OKForUpdate)
                    {
                        if (duplicateOnUpdateFound)
                        {
                            Subcontractor subcontractor = ctx.Subcontractor.Where(a => a.SubcontractorID == SubcontractorID).FirstOrDefault();
                            SubcontractorType subcontractorType = ctx.SubcontractorType.Where(a => a.SubcontractorTypeID == SubcontractorTypeID).FirstOrDefault();
                            update_result = "Duplicate found for contractor " + subcontractor.SubcontractorName + " - " + subcontractorType.SubcontractorTypeName + ". \n";

                            return update_result;
                        }
                        else
                        {
                            String lumpsumID = LumpsumCostIDList[i];
                            CostLumpsum lumpsum = ctx.CostLumpsum.Where(a => a.LumpsumCostID == lumpsumID && a.Granularity == Scale).FirstOrDefault();
                            //if(CostLineID != null || CostLineID != "")

                            string lineItem = null;
                          
                            Boolean costExistInOtherTrend = false;
                            if (SubcontractorTypeID != lumpsum.SubcontractorTypeID || SubcontractorID != lumpsum.SubcontractorID)
                            {
                                //Changes in SubcontractorTypeID and SubcontractorID
                                //use phaseCode to join
                                var oldCost = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber.ToString(), activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription,
                                                                                              "L", null, null, null, lumpsum.SubcontractorTypeID.ToString(), lumpsum.SubcontractorID.ToString(), null, null);
                                costExistInOtherTrend = (oldCost > 0) ? true : false;
                                //If the cost does not exist in any other trend -> remove -> create
                                //If it exist in other trends -> resuse

                                //Remove -> because the type and name is different now
                                if (!costExistInOtherTrend)
                                {
                                    CostLineItemTracker.removeCostLine("L", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                     category.SubCategoryID, null, null, lumpsum.SubcontractorTypeID.ToString(), lumpsum.SubcontractorID.ToString(), null, null, null, lumpsum.CostLineItemID);
                                    //if (!costLineItem.IsExist)
                                    //     costLineItem.LineNumber = int.Parse(lumpsum.CostLineItemID.Split('.').LastOrDefault().ToString()); //Resue the line id number

                                    //Manasi 06-11-2020
                                    if (!newCostLineItem.IsExist)
                                        newCostLineItem.LineNumber = int.Parse(lumpsum.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    // newCostLineItem.LineNumber = int.Parse(lumpsum.CostLineItemID.Split('.').LastOrDefault().ToString()); //Resue the line id number

                                }

                                //if (costLineItem != null && costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                //    lineNumber = "0" + costLineItem.LineNumber.ToString();
                                //else
                                //    lineNumber = costLineItem.LineNumber.ToString();

                                //Manasi 06-11-2020
                                if (newCostLineItem != null && newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else
                                    lineNumber = newCostLineItem.LineNumber.ToString();

                                //Create line Item
                                //if (!costLineItem.IsExist)
                                if(!newCostLineItem.IsExist)
                                    CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                category.SubCategoryID, "L", null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString(), null, null, null, lineNumber);

                                //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                //               phase.ActivityPhaseCode.ToString(),
                                //         category.CategoryID, category.SubCategoryID, lineNumber);

                                //----------Manasi 26-10-2020-------------------------------------------
                                string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                year = year.Substring(2, 2);
                                lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                    phase.ActivityPhaseCode.ToString(),
                                              category.CategoryID, category.SubCategoryID, lineNumber, year, "4", programElementClass.ProjectClassLineItemID);
                                //-------------------------------------------------------------------------

                            }
                            else
                            {
                                lineItem = lumpsum.CostLineItemID;
                                if (CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == 4 || CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == '4')
                                {
                                    //do nothing
                                }
                                else
                                {
                                    CostLineItemTracker existingCostLineItem = CostLineItemTracker.checkIfCostLineItemExist("L", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber,
                                            phase.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID, null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString()
                                            , null, null, null, lineNumber, TrendNumber.ToString());
                                    //lineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                    //                                            (costLineItem != null && costLineItem.LineNumber != 0) ? costLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Manasi 06-11-2020
                                    lineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                (newCostLineItem != null && newCostLineItem.LineNumber != 0) ? newCostLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Regenerate the LineItem

                                    //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                    //                phase.ActivityPhaseCode.ToString(),
                                    //          category.CategoryID, category.SubCategoryID, lineNumber);

                                    //----------Manasi 26-10-2020-------------------------------------------
                                    string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                    year = year.Substring(2, 2);

                                    lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                          phase.ActivityPhaseCode.ToString(),
                                                    category.CategoryID, category.SubCategoryID, lineNumber, year, "4", programElementClass.ProjectClassLineItemID);
                                    //-------------------------------------------------------------------------

                                    if (existingCostLineItem == null)
                                        CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                             category.SubCategoryID, "L", null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString(), null, null, null, lineNumber);

                                }


                            }



                            Cost.saveLumpsumCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID
                                                    , LumpsumCostIDList[i], LumpsumStartDateList[i], LumpsumEndDateList[i], Description, LumpsumCost[i], Scale, zero, zero, SubcontractorTypeID, SubcontractorID, lineItem);

                

                            update_result += "";

                            duplicateOnUpdateFound = false;

                            OKForUpdate = false;
                        }
                    }

                    //Register the program
                    if (OKForRegister)
                    {
                        if (duplicateOnRegisterFound)
                        {
                            Subcontractor subcontractor = ctx.Subcontractor.Where(a => a.SubcontractorID == SubcontractorID).FirstOrDefault();
                            SubcontractorType subcontractorType = ctx.SubcontractorType.Where(a => a.SubcontractorTypeID == SubcontractorTypeID).FirstOrDefault();
                            update_result = "Duplicate found for contractor " + subcontractor.SubcontractorName + " - " + subcontractorType.SubcontractorTypeName + ". \n";

                            return update_result;
                        }
                        else
                        {

                             //costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                             //                                           category.CategoryID, category.SubCategoryID, "L", null, null, null, null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString());

                            //Manasi 06-11-2020
                            newCostLineItem = CostLineItemResult.getNewCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                        category.CategoryID, category.SubCategoryID, "L", null, null, null, null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString(), ProjectID);

                            //is LineItemexist

                            bool isExist = false;


                            //if (costLineItem != null)
                            //{
                            //    if (costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                            //        lineNumber = "0" + costLineItem.LineNumber.ToString();
                            //    else lineNumber = costLineItem.LineNumber.ToString();

                            //}

                            //Manasi 06-11-2020
                            if (newCostLineItem != null)
                            {
                                if (newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else lineNumber = newCostLineItem.LineNumber.ToString();

                            }

                            //string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                            //                 phase.ActivityPhaseCode.ToString(),
                            //           category.CategoryID, category.SubCategoryID, lineNumber);

                            //----------Manasi 26-10-2020-------------------------------------------
                            string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                            year = year.Substring(2, 2);

                            string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                  phase.ActivityPhaseCode.ToString(),
                                            category.CategoryID, category.SubCategoryID, lineNumber, year, "4", programElementClass.ProjectClassLineItemID);
                            //-------------------------------------------------------------------------

                            Cost.saveLumpsumCost("1", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, LumpsumCostIDList[i],
                                               LumpsumStartDateList[i], LumpsumEndDateList[i], Description, LumpsumCost[i], Scale, 1, zero, SubcontractorTypeID, SubcontractorID, lineItem);
                            //Create line Item
                            //if (!costLineItem.IsExist)
                            if (!newCostLineItem.IsExist)
                            {
                                //CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                //                       category.SubCategoryID, "L", null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString(), null, null, null, lineNumber);

                            }

                            update_result += "";

                            duplicateOnRegisterFound = false;

                            //OKForRegister = false;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                Subcontractor subcontractor = ctx.Subcontractor.Where(a => a.SubcontractorID == SubcontractorID).FirstOrDefault();
                SubcontractorType subcontractorType = ctx.SubcontractorType.Where(a => a.SubcontractorTypeID == SubcontractorTypeID).FirstOrDefault();
                update_result += "Failed to update " + subcontractor.SubcontractorName + " - " + subcontractorType.SubcontractorTypeName + ". \n";

                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
                if (duplicateCheckerConn != null) conn.Close();
                if (duplicateCheckReader != null) reader.Close();
            }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


            
            //}
            //================Scaling & adjust last value to ensure correct precisiont===========================
            try
            {
                if(OKForRegister)
                    CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                     category.SubCategoryID, "L", null, null, SubcontractorTypeID.ToString(), SubcontractorID.ToString(), null, null, null, lineNumber);

                if (OKForDelete != true)
                    Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(lineId), Scale, "L");
                if (actualCostId > 0)
                    Scaling.scaling(Convert.ToInt16(ActivityID), actualCostId, Scale, "L");
                var aId = Convert.ToInt16(ActivityID);
                List<CostLumpsum> lumpsumCostList = new List<CostLumpsum>();
                lineId = lineId.ToString();
                if (Scale == "month")
                {
                    //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "week" && l.LumpsumCostID.Contains(lineId)).ToList();
                    lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineId), "week", Convert.ToInt16(aId));
                    total = lumpsumCostList.Sum(a => Convert.ToDouble(a.LumpsumCost));
                    if (lumpsumCostList.Count != 0)
                        adjustLastValue(ActivityID, "week", lumpsumCostList, ctx, total);
                }
                else
                {

                    lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineId), "month", Convert.ToInt16(aId));
                    total = lumpsumCostList.Sum(a => Convert.ToDouble(a.LumpsumCost));
                    
                    if (lumpsumCostList.Count != 0)
                        adjustLastValue(ActivityID, "month", lumpsumCostList, ctx, total);

                    lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineId), "week", Convert.ToInt16(aId));
                    total = lumpsumCostList.Sum(a => Convert.ToDouble(a.LumpsumCost));
                    //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "week" && l.LumpsumCostID.Contains(lineId)).ToList();
                    if (lumpsumCostList.Count != 0)
                        if (lumpsumCostList.Count != 0) adjustLastValue(ActivityID, "week", lumpsumCostList, ctx, total);
                }
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
            }

            update_result += "";
            return update_result;
        }

        public static void adjustLastValue(String activityId, String scale, List<CostLumpsum> costList, CPPDbContext ctx, Double total)
        {
            var lastItem = costList.Last();
            var totalToAdjust = 0.0;
            foreach (var lumpCost in costList)
            {
                if (lumpCost.Equals(lastItem))
                {
                    //adjust last value
                    var adjustedValue = total - totalToAdjust;
                    //lumpCost.LumpsumCost = adjustedValue.ToString("F");
                    lumpCost.LumpsumCost = Convert.ToDouble(adjustedValue) > 0 ? adjustedValue.ToString("F8") : "0.00";   //Manasi 31-08-2020
                    lumpCost.LumpsumCostStartDate = lumpCost.LumpsumCostStartDate;
                    lumpCost.LumpsumCostEndDate = lumpCost.LumpsumCostEndDate;
                    lumpCost.CostLineItemID = lumpCost.CostLineItemID;

                    var newCtx = new CPPDbContext();
                    var currentCost = newCtx.CostLumpsum.Where(a => a.LumpsumCostID == lumpCost.LumpsumCostID && a.Granularity == scale && a.IsDeleted==false).FirstOrDefault();
                    currentCost.LumpsumCost = lumpCost.LumpsumCost;
                    
                    newCtx.Entry(currentCost).State = System.Data.Entity.EntityState.Modified;
                    newCtx.SaveChanges();

                    //ctx.Entry(lumpCost).State = System.Data.Entity.EntityState.Modified;
                    //ctx.SaveChanges();
                }
                else
                {
                    totalToAdjust += Convert.ToDouble(lumpCost.LumpsumCost);
                }
            }

        }
        public static String updateMultipleCostLumpsum(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber,
                                                    String ActivityID, String CostID, String StartDate, String EndDate, String Description,
                                                    String TextBoxValue, String Scale, String FTEIDList, String drag_direction, String NumberOfTextboxToBeRemoved, int CostTrackTypeID, String CostLineItemId)  //Manasi 31-08-2020
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            var NumberOfTextbox = 0;
            var isZero = true;
                int zero = 0;
            List<String> LumpsumCost = TextBoxValue.Split(',').ToList();
            // List<String> FTECostList = FTECost.Split(',').ToList();
            List<String> LumpsumStartDateList = StartDate.Split(',').ToList();
            List<String> LumpsumEndDateList = EndDate.Split(',').ToList();
            List<String> LumpsumCostIDList = FTEIDList.Split(',').ToList();
            var lineItem = LumpsumCostIDList[0].Split('_')[1];
            Activity activity = Activity.getActivityByID(ActivityID);
            var lineId = LumpsumCostIDList[0].Split('_')[1];

            try
            {
                if (drag_direction == "right-left")
                {
                    for (int i = 0; i < LumpsumCostIDList.Count; i++)
                    {
                        try
                        {

                            CostLumpsum currentCost = null;
                            using (var getCtx = new CPPDbContext())
                            {
                                var costCellID = LumpsumCostIDList[i];
                                currentCost = getCtx.CostLumpsum.Where(a => a.LumpsumCostID == costCellID && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                                if (currentCost != null)
                                    OKForUpdate = true;
                                else
                                    update_result += "Lumpsum '" + LumpsumCostIDList[i] + "' does not exist in system";


                                //Update the Program
                                if (OKForUpdate)
                                {

                                    var tempID = LumpsumCostIDList[i];
                                    if (Convert.ToDateTime(LumpsumStartDateList[i]) > Convert.ToDateTime(activity.ActivityEndDate))
                                    {

                                        getCtx.Entry<CostLumpsum>(currentCost).State = System.Data.Entity.EntityState.Deleted;
                                        getCtx.SaveChanges();
                                    }
                                    else
                                    {

                                        Cost.saveLumpsumCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, LumpsumCostIDList[i],
                                          LumpsumStartDateList[i], LumpsumEndDateList[i], Description, LumpsumCost[i], Scale, CostTrackTypeID, zero, currentCost.SubcontractorTypeID, currentCost.SubcontractorID, currentCost.CostLineItemID);
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
                        Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


                    }
                }
                else
                {
                    for (int i = 0; i < LumpsumCostIDList.Count; i++)
                    {
                        try
                        {

                            CostLumpsum currentCost = null;
                            using (var getCtx = new CPPDbContext())
                            {
                                var costCellID = LumpsumCostIDList[i];
                                currentCost = getCtx.CostLumpsum.Where(a => a.LumpsumCostID == costCellID && a.IsDeleted==false).FirstOrDefault();
                                if (currentCost != null)
                                    OKForUpdate = true;
                                else
                                    update_result += "Lumpsum '" + LumpsumCostIDList[i] + "' does not exist in system";



                                //Update the Program
                                if (OKForUpdate)
                                {
                                    //if (!LumpsumCost[i].Equals("0"))
                                    //{
                                    var tempID = LumpsumCostIDList[i];
                                    var count = 0;
                                    var newLumpsumCostID = "";
                                    if (drag_direction == "left-right")
                                    {

                                        for (int k = tempID.Length - 1; tempID[k] != '_'; k--)
                                        {
                                            count++;
                                        }
                                        var TextboxID = int.Parse(tempID.Substring(tempID.Length - count));
                                        var firstPartID = tempID.Substring(0, tempID.Length - count);

                                        NumberOfTextbox = TextboxID - int.Parse(NumberOfTextboxToBeRemoved);
                                        newLumpsumCostID = firstPartID + NumberOfTextbox.ToString();
                                    }
                                    else
                                    {
                                        newLumpsumCostID = LumpsumCostIDList[i];
                                    }
                                    if (NumberOfTextbox >= 0 && currentCost != null)
                                    {

                                        currentCost.LumpsumCostID = newLumpsumCostID;
                                        getCtx.Entry<CostLumpsum>(currentCost).State = System.Data.Entity.EntityState.Modified;
                                        getCtx.SaveChanges();

                                        Cost.saveLumpsumCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, newLumpsumCostID,
                                      LumpsumStartDateList[i], LumpsumEndDateList[i], Description, LumpsumCost[i], Scale, CostTrackTypeID, zero, currentCost.SubcontractorTypeID, currentCost.SubcontractorID, currentCost.CostLineItemID);

                                    }
                                    //}
                                    else if (NumberOfTextbox < 0 && currentCost != null)
                                    {
                                        getCtx.Entry<CostLumpsum>(currentCost).State = System.Data.Entity.EntityState.Deleted;
                                        getCtx.SaveChanges();

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
                        Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


                    }
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
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }

            

            update_result = "Success";
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Scale);
            Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(lineId), Scale, "L");

            List<CostLumpsum> lumpsumCostList = new List<CostLumpsum>();
            var ctx = new CPPDbContext();
            var aId = Convert.ToInt16(ActivityID);
            //var costRow = getCostRow(ActivityID, Scale, lineId, "L");
            var costRow = getCostRow(ActivityID, Scale, CostLineItemId, "L");   //Manasi 31-08-2020
            var total = costRow.Sum(a => Convert.ToDouble(a.LumpsumCost));
            if (Scale == "month")
            {
                //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineItem), "week", aId);
                if (lumpsumCostList.Count != 0)
                    adjustLastValue(ActivityID, "week", lumpsumCostList, ctx, total);
            }
            else
            {
                //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineItem), "month", aId);
                if (lumpsumCostList.Count != 0)
                    adjustLastValue(ActivityID, "month", lumpsumCostList, ctx, total);
                //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineItem), "week", aId);
                if (lumpsumCostList.Count != 0)
                    adjustLastValue(ActivityID, "week", lumpsumCostList, ctx, total);
            }

            return update_result;

        }
        public static String updateCostLumpsumLeftLeft(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String CostID, String StartDate, String EndDate,
                                String Description, String TextBoxValue, String Scale, String FTEIDList,int SubcontractorTypeID, int SubcontractorID, int CostTrackTypeID, String CostLineItemID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForRegister = false;
            bool isZero = true;
            List<String> LumpsumCost = TextBoxValue.Split(',').ToList();
            // List<String> FTECostList = FTECost.Split(',').ToList();
            List<String> LumpsumStartDateList = StartDate.Split(',').ToList();
            List<String> LumpsumEndDateList = EndDate.Split(',').ToList();
            List<String> LumpsumCostIDList = FTEIDList.Split(',').ToList();
            var lineId = LumpsumCostIDList[0].Split('_')[1];
            int zero = 0;
            String currentUser = UserUtil.getCurrentUserName();
            for (int i = 0; i < LumpsumCostIDList.Count; i++)
            {
                try
                {
                    // create and open a connection object
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    //Check if program exists in system
                    String query = "SELECT LumpsumCostID from cost_lumpsum";
                    query += " WHERE 1=1";
                    query += " AND LumpsumCostID = @LumpsumCostIDList";
                    query += " AND Granularity = @Scale and IsDeleted=false";
                    MySqlCommand command = new MySqlCommand(query, conn);
                    command.Parameters.AddWithValue("@LumpsumCostIDList", LumpsumCostIDList[i]);
                    command.Parameters.AddWithValue("@Scale", Scale);
                    using (reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();

                            if (reader.GetValue(0).ToString().Trim() == LumpsumCostIDList[i])
                                OKForUpdate = true;

                        }
                        else
                            OKForRegister = true;
                    }

                    //Update the Program
                    if (OKForUpdate)
                    {
                       
                        Cost.saveLumpsumCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID
                                                  , LumpsumCostIDList[i], LumpsumStartDateList[i], LumpsumEndDateList[i], Description, LumpsumCost[i], Scale, CostTrackTypeID, zero, SubcontractorTypeID, SubcontractorID, CostLineItemID);

                        OKForUpdate = false;
                    }

                    //Register the program
                    if (OKForRegister)
                    {
                     
                        Cost.saveLumpsumCost("1", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID
                          , LumpsumCostIDList[i], LumpsumStartDateList[i], LumpsumEndDateList[i], Description, LumpsumCost[i], Scale, CostTrackTypeID, zero, SubcontractorTypeID, SubcontractorID, CostLineItemID);
                        OKForRegister = false;
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
                    if (conn != null) conn.Close();
                    if (reader != null) reader.Close();
                }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


            }

            update_result = "Success";
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Scale);
            Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(lineId), Scale, "L");
            List<CostLumpsum> lumpsumCostList = new List<CostLumpsum>();
            var ctx = new CPPDbContext();
            var aId = Convert.ToInt16(ActivityID);
            // var total = LumpsumCost.Sum(a => Convert.ToDouble(a));
            //var costRow = getCostRow(ActivityID, Scale, lineId, "L");
            var costRow = getCostRow(ActivityID, Scale, CostLineItemID, "L");
            var total = costRow.Sum(a => Convert.ToDouble(a.LumpsumCost));
            if (Scale == "month")
            {
                //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineId), "week", aId);
                if (lumpsumCostList.Count != 0)
                    adjustLastValue(ActivityID, "week", lumpsumCostList, ctx, total);
            }
            else
            {
                //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineId), "month", aId);
                if (lumpsumCostList.Count != 0)
                    adjustLastValue(ActivityID, "month", lumpsumCostList, ctx, total);
                //lumpsumCostList = ctx.CostLumpsum.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                lumpsumCostList = getCost.getLumpsumCostByCostID(Convert.ToInt16(lineId), "week", aId);
                if (lumpsumCostList.Count != 0)
                    adjustLastValue(ActivityID, "week", lumpsumCostList, ctx, total);
            }


            return update_result;

        }

    }

    [Table("cost_odc")]
    public class CostODC : Audit
    {
        //ODC
        [NotMapped]
        public int Operation { get; set; }
        [NotMapped]
        public String ProgramID { get; set; }
        [NotMapped]
        public String ProgramElementID { get; set; }
        [NotMapped]
        public String ProjectID { get; set; }
        [NotMapped]
        public String TrendNumber { get; set; }
        [NotMapped]
        public String PhaseCode { get; set; }
        [NotMapped]
        public String TextBoxID { get; set; }
        [NotMapped]
        public String CostTrackTypes { get; set; }
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int ActivityID { get; set; }

        public String ODCCostID { get; set; }
        public String ODCStartDate { get; set; }
        public String ODCEndDate { get; set; }
        public String ODCQuantity { get; set; }
        public String ODCPrice { get; set; }
        public String ODCCost { get; set; }
        public int ODCTypeID { get; set; }
        public String Granularity { get; set; }
        ///[ForeignKey]
        public int CostTrackTypeID { get; set; }
        public String OriginalCost { get; set; }
        public int EstimatedCostID { get; set; }

        public string ActualBudget { get; set; } // Swapnil 24-11-2020
        public String CostLineItemID { get; set; }
        [ForeignKey("ActivityID")]
        public virtual Activity Activity { get; set; }
        [ForeignKey("ODCTypeID")]
        public virtual ODCType ODCType { get; set;}
        //Nivedita 10022022
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }
        //public String CreatedBy { get; set; }
        //public String LastUpdatedBy { get; set; }
        //public DateTime CreatedDate { get; set; }
        //public DateTime LastUpdatedDate { get; set; }

        // What type?
        //[ForeignKey("OtherDirectCostID")]
        //public virtual UnitType UnitTypes { get; set; }
        private static String SQL_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

        //From RequestUnitCostController
        public static List<CostODC> getCostODC(String ActivityID, String Granularity,String TrendNumber,String ProjectID, String PhaseCode, String BudgetID, String BudgetCategory,String BudgetSubCategory)
        {
            //ODC
            {
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
                List<CostODC> RetreivedODCCosts = new List<CostODC>();
                //RetreivedLumpsumCosts = null;
                String query = "";
                try
                {
                    using (var ctx = new CPPDbContext())
                    {
                        List<CostODC> MatchedODCCostList = new List<CostODC>();
                        var aID = Convert.ToInt16(ActivityID);
                        DateTime cutOffDate = DateUtility.getCutOffDate(Granularity);
                        Activity act = ctx.Activity.Where(a => a.ActivityID == aID).FirstOrDefault();
                        if (TrendNumber == "1000") //Actual, Estimate to completion cost
                            MatchedODCCostList = ctx.Database.SqlQuery<CostODC>("call getActualEtcCost(@ProjectID, @CutOffDate, @CostType, @Granularity, @MainCategory, @SubCategory, @PhaseCode)",
                                                              new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", act.ProjectID),
                                                              new MySql.Data.MySqlClient.MySqlParameter("@CutOffDate", cutOffDate.ToString("yyyy-MM-dd")),
                                                              new MySql.Data.MySqlClient.MySqlParameter("@CostType", "ODC"),
                                                              new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                                              new MySql.Data.MySqlClient.MySqlParameter("@MainCategory", act.BudgetCategory),
                                                              new MySql.Data.MySqlClient.MySqlParameter("@SubCategory", act.BudgetSubCategory),
                                                              new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode)
                                                              )
                                                              .ToList();
                        else if (TrendNumber == "2000") //Forecast costs (View Only)
                        {

                            //IEnumerable<List<CostODC>> odcList = ctx.Database.SqlQuery<CostODC>("call get_forecast_cost(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                            //                                    //new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", PhaseCode), //Manasi 29-07-2020
                            //                                    //new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", BudgetCategory),
                            //                                    //new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", BudgetSubCategory),
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode), //Manasi 29-07-2020
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@CostType", "ODC"),
                            //                                    new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                            //                                    ).GroupBy(a => a.ODCTypeID).Select(a => a.ToList());

                            //---------------------------Manasi 10-11-2020-----------------------------------
                            IEnumerable<List<CostODC>> odcList = ctx.Database.SqlQuery<CostODC>("call get_forecast_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                                new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode), //Manasi 29-07-2020
                                                                new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                                                                new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                                                                new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@CostType", "ODC"),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                                                                ).GroupBy(a => a.ODCTypeID).Select(a => a.ToList());

                            int lineId = 1;
                            foreach (List<CostODC> list in odcList)
                            {
                                int cellId = 0;
                                foreach (CostODC cost in list)
                                {
                                    cost.ODCCostID = ActivityID + "_" + lineId + "_" + cellId;
                                    cellId += 1;
                                    MatchedODCCostList.Add(cost);
                                }
                                lineId += 1;
                            }

                        }
                        //---------------------------Manasi 10-11-2020-----------------------------------
                        else if (TrendNumber == "3000") //Forecast costs (View Only)
                        {
                            
                            IEnumerable<List<CostODC>> odcList = ctx.Database.SqlQuery<CostODC>("call get_current_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                                new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode), //Manasi 29-07-2020
                                                                new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                                                                new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                                                                new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@CostType", "ODC"),
                                                                new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                                                                ).GroupBy(a => a.ODCTypeID).Select(a => a.ToList());

                            int lineId = 1;
                            foreach (List<CostODC> list in odcList)
                            {
                                int cellId = 0;
                                foreach (CostODC cost in list)
                                {
                                    cost.ODCCostID = ActivityID + "_" + lineId + "_" + cellId;
                                    cellId += 1;
                                    MatchedODCCostList.Add(cost);
                                }
                                lineId += 1;
                            }

                        }

                        else
                        {
                            MatchedODCCostList = ctx.CostODC.Where(u => u.ActivityID == aID && u.Granularity == Granularity).ToList();
                        }
                        foreach (var MatchedODCCost in MatchedODCCostList)
                        {
                            //Split CostID into ActivityID, RowID, TextBoxID
                            String[] ODCID = MatchedODCCost.ODCCostID.ToString().Trim().Split('_');

                            ////Find if an entry for this RowID exists
                            int i = RetreivedODCCosts.FindIndex(ODCCost => ODCCost.ODCCostID == ODCID[1]);

                            if (i >= 0) //RowID exists
                            {
                                RetreivedODCCosts[i].TextBoxID += ", " + ODCID[2];
                                RetreivedODCCosts[i].ODCQuantity += ", " + MatchedODCCost.ODCQuantity;
                                RetreivedODCCosts[i].ODCCost += ", " + MatchedODCCost.ODCCost;
                                RetreivedODCCosts[i].OriginalCost += ", " + MatchedODCCost.OriginalCost;
                                RetreivedODCCosts[i].ODCStartDate += ", " + MatchedODCCost.ODCStartDate;
                                RetreivedODCCosts[i].ODCEndDate += ", " + MatchedODCCost.ODCEndDate;
                                RetreivedODCCosts[i].CostTrackTypes += ", " + MatchedODCCost.CostTrackTypeID;
                                //RetreivedODCCosts[i].ActualBudget += ", " + MatchedODCCost.ActualBudget; // Swapnil 24-11-2020

                            }
                            else //RowID does not exist. Add new entry in List
                            {
                                int rowID = int.Parse(ODCID[1]);
                                for (int j = 0; j <= int.Parse(ODCID[1]); j++)
                                {
                                    if (RetreivedODCCosts.ElementAtOrDefault(j) == null)
                                        RetreivedODCCosts.Add(new CostODC());
                                }
                                RetreivedODCCosts[rowID].TextBoxID = ODCID[2];
                                RetreivedODCCosts[rowID].ODCCostID = rowID.ToString(); ;
                                RetreivedODCCosts[rowID].ActivityID = MatchedODCCost.ActivityID;
                                RetreivedODCCosts[rowID].ODCStartDate = MatchedODCCost.ODCStartDate;
                                RetreivedODCCosts[rowID].ODCEndDate = MatchedODCCost.ODCEndDate;
                                RetreivedODCCosts[rowID].ODCTypeID = MatchedODCCost.ODCTypeID;
                                //RetreivedODCCosts[rowID].ODCQuantity = MatchedODCCost.ODCQuantity;
                                RetreivedODCCosts[rowID].ODCQuantity = MatchedODCCost.OriginalCost;
                                RetreivedODCCosts[rowID].ODCPrice = MatchedODCCost.ODCPrice;
                               RetreivedODCCosts[rowID].ODCCost = MatchedODCCost.ODCCost;
                                RetreivedODCCosts[rowID].OriginalCost = MatchedODCCost.OriginalCost;
                                RetreivedODCCosts[rowID].Granularity = MatchedODCCost.Granularity;
                                RetreivedODCCosts[rowID].ODCType = MatchedODCCost.ODCType;
                                RetreivedODCCosts[rowID].EstimatedCostID = MatchedODCCost.EstimatedCostID;
                                RetreivedODCCosts[rowID].CostTrackTypeID = MatchedODCCost.CostTrackTypeID;
                                RetreivedODCCosts[rowID].CostTrackTypes = MatchedODCCost.CostTrackTypeID.ToString();
                                RetreivedODCCosts[rowID].CostLineItemID = MatchedODCCost.CostLineItemID;
                                RetreivedODCCosts[rowID].ActualBudget = MatchedODCCost.ActualBudget; // Swapnil 24-11-2020


                            }//End else
                        }
                    }
                    //    }//End reader read
                    //}//End executing reader

                    for (int j = 0; j < RetreivedODCCosts.Count; j++)
                    {
                        if (RetreivedODCCosts[j].ActivityID == null || RetreivedODCCosts[j].ActivityID == 0)
                        {
                            RetreivedODCCosts.RemoveAt(j);
                            j = -1;
                        }

                    }

                    //To sort String arrays based on TextBoxID
                    for (int j = 0; j < RetreivedODCCosts.Count; j++)
                    {
                        //Sort arrays by TextBoxID
                        if (RetreivedODCCosts[j].TextBoxID != null)
                        {
                            int[] a_sortTextBoxID = RetreivedODCCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                            int[] b_sortTextBoxID = RetreivedODCCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                            int[] c_sortTextBoxID = RetreivedODCCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                            int[] d_sortTextBoxID = RetreivedODCCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();

                            String[] sortUnitCost = RetreivedODCCosts[j].ODCCost.ToString().Trim().Split(',');
                            String[] sortUnitQuantity = RetreivedODCCosts[j].ODCQuantity.ToString().Trim().Split(',');
                            String[] sortUnitCostStartDate = RetreivedODCCosts[j].ODCStartDate.ToString().Trim().Split(',');
                            String[] sortUnitCostEndDate = RetreivedODCCosts[j].ODCEndDate.ToString().Trim().Split(',');

                            Array.Sort(a_sortTextBoxID, sortUnitCost);
                            Array.Sort(b_sortTextBoxID, sortUnitCostStartDate);
                            Array.Sort(c_sortTextBoxID, sortUnitCostEndDate);
                            Array.Sort(d_sortTextBoxID, sortUnitQuantity);
                        }

                    }

                }//End try

                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }
                finally
                {


                }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
                return RetreivedODCCosts;
            }
        }

        public static List<CostODC> getCostRow(String ActivityID, String Granularity, String LineID, String CostType)
        {
            List<CostODC> results = new List<CostODC>();
            using (var ctx = new CPPDbContext())
            {
                String query = "CALL get_cost_row(@ActivityID,@LineID,@Granularity,@CostType)";
                results = ctx.Database.SqlQuery<CostODC>(query,
                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                             new MySql.Data.MySqlClient.MySqlParameter("@LineID", LineID),
                                              new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                               new MySql.Data.MySqlClient.MySqlParameter("@CostType", "ODC")
                                        ).ToList();
            }
            return results;
        }
        //From RegisterUnitCostController
        public static String updateCostODC(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String UnitCostID, String StartDate, String EndDate, String ODCDescription, String ODCQuantity, String ODCPrice, String Scale, String ODCType, String ODCIDList, String CostTrackTypes, String CostLineID)
        {

            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            MySqlConnection duplicateCheckerConn = null;
            MySqlDataReader duplicateCheckReader = null;
            bool duplicateOnRegisterFound = false;
            bool duplicateOnUpdateFound = false;
            MySqlTransaction transaction = null;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForRegister = false;
            bool OKForDelete = false;
            bool isZero = true; var odcTypeID = 0;
            var zero = 0;
            String lineNumber = "";
            var actualCostId = 0;
            //List<String> UnitCostList = UnitQuantity.Split(',').ToList();
            List<String> ODCCostList = (ODCQuantity != "") ? ODCQuantity.Split(',').ToList() : new List<String>();
            //var totalUnitCost = totalQuantity * UnitPrice;
            //  List<String> FTETotalCostList = FTECost.Split(',').ToList();
            List<String> ODCStartDateList = StartDate.Split(',').ToList();
            List<String> ODCEndDateList = EndDate.Split(',').ToList();

            //luan duplicate check experimental
            //if (ODCStartDateList.Any()) //prevent IndexOutOfRangeException for empty list
            //{
            //    ODCStartDateList.RemoveAt(ODCStartDateList.Count - 1);
            //}
            //if (ODCEndDateList.Any()) //prevent IndexOutOfRangeException for empty list
            //{
            //    ODCEndDateList.RemoveAt(ODCEndDateList.Count - 1);
            //}

            List<String> ODCCostIDList = ODCIDList.Split(',').ToList();
            List<String> CostTrackTypeList = null;
            if (CostTrackTypes != null && CostTrackTypes != "")
                CostTrackTypeList = CostTrackTypes.Split(',').ToList();

            var lineId = ODCCostIDList[0].Split('_')[1];
            var ctx = new CPPDbContext();
            int pID = Convert.ToInt32(ProjectID);
            var project = ctx.Project.Where(p => p.ProjectID == pID && p.IsDeleted==false).FirstOrDefault();
            var projectClass = ctx.ServiceClass.Where(a => a.ID== project.ProjectClassID).FirstOrDefault();
            int aID = Convert.ToInt16(ActivityID);
            var activity = ctx.Activity.Where(a => a.ActivityID == aID && a.IsDeleted==false).FirstOrDefault();
            var category = Activity.getActivityCategory(activity);
            var phase = ctx.PhaseCode.Where(a => a.PhaseID == activity.PhaseCode).FirstOrDefault();  //phaseCode in Activity object is the fk points to phaseID
            var programElement = ctx.ProgramElement.Include("ProjectClass").Where(pm => pm.ProgramElementID == project.ProgramElementID && pm.IsDeleted==false).FirstOrDefault();
            var programElementClass = ctx.ProjectClass.Where(a => a.ProjectClassID == programElement.ProjectClassID).FirstOrDefault();  //Manasi 27-10-2020
            var program = ctx.Program.Where(p => p.ProgramID == programElement.ProgramID && p.IsDeleted==false);
            var unitItem = ctx.ODCType.Where(u => u.ODCTypeName == ODCType).FirstOrDefault();
            if (unitItem != null)
                odcTypeID = unitItem.ODCTypeID;
            ProgramID = (program.FirstOrDefault().ProgramID).ToString();
            var material = ctx.Material.Where(u => u.Name == ODCDescription).FirstOrDefault();
            var materialId = 0;
            if (material != null)
                materialId = material.ID;
            ProgramElementID = (programElement.ProgramElementID).ToString();
            ProjectID = (project.ProjectID).ToString();
            int minArrayCount = Math.Min(ODCStartDateList.Count, ODCCostIDList.Count);
            CostLineItemResult costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                   category.CategoryID, category.SubCategoryID, "ODC", null, null, odcTypeID.ToString(), null, null, null, null);

            //Manasi 05-11-2020
            CostLineItemResult newCostLineItem = CostLineItemResult.getNewCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                   category.CategoryID, category.SubCategoryID, "ODC", null, null, odcTypeID.ToString(), null, null, null, null, ProjectID);
            for (int j = 0; j < ODCCostList.Count; j++)
            {
                if (ODCCostList[j] != "0")
                {
                    isZero = false;
                    break;
                }
            }
            try
            {
                MySqlCommand command = null;
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();
                for (int i = 0; i < minArrayCount; i++)
                {


                    if (CostTrackTypeList != null && i < CostTrackTypeList.Count &&
                   (CostTrackTypeList.ElementAt(i).FirstOrDefault() == 3 || CostTrackTypeList.ElementAt(i).Trim() == "3"))
                        continue;
                    String query = "";

                    // transaction = conn.BeginTransaction();

                    //Check if program exists in system
                    query = "SELECT ODCCostID from cost_odc";
                    query += " WHERE 1=1 and IsDeleted=false";
                    query += " AND ODCCostID = '" + ODCCostIDList[i] + "'";
                    query += " And Granularity = '" + Scale + "'";
                    command = new MySqlCommand(query, conn);
                    using (reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();
                            if (reader.GetValue(0).ToString().Trim() == ODCCostIDList[i] && Operation != 3)
                            {
                                //Luan experimental update
                                if (i == 0)
                                {
                                    ODCType odcTypeTemp = ctx.ODCType.Where(a => a.ODCTypeName == ODCType).FirstOrDefault();

                                    var ODCStartDateWithTime = DateTime.Parse(ODCStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                    var ODCEndDateWithTime = DateTime.Parse(ODCEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                    query = "SELECT ODCCostID from cost_odc";
                                    query += " WHERE 1=1 and IsDeleted=false";
                                    query += " And ODCTypeID = '" + odcTypeTemp.ODCTypeID + "'";
                                    query += " And ActivityID = '" + ActivityID + "'";
                                    query += " And (ODCStartDate = '" + ODCStartDateList[i] + "' OR ODCStartDate = '" + ODCStartDateWithTime + "')";
                                    query += " And (ODCEndDate = '" + ODCEndDateList[i] + "' OR ODCEndDate ='" + ODCEndDateWithTime + "')";
                                    query += " And ODCCostID != '" + ODCCostIDList[i] + "'";
                                    query += " And CostTrackTypeID = '" + CostTrackTypeList[i] + "'";
                                    duplicateCheckerConn = ConnectionManager.getConnection();
                                    duplicateCheckerConn.Open();
                                    command = new MySqlCommand(query, duplicateCheckerConn);
                                    using (duplicateCheckReader = command.ExecuteReader())
                                    {
                                        if (duplicateCheckReader.HasRows)
                                        {
                                            duplicateOnUpdateFound = true;
                                        }
                                    }
                                }

                                OKForUpdate = true;
                            }
                            else if (Operation == 3)
                            {
                                OKForDelete = true;
                            }

                        }
                        else
                        {
                            //Luan experimental create
                            if (i == 0)
                            {
                                ODCType odcTypeTemp = ctx.ODCType.Where(a => a.ODCTypeName == ODCType).FirstOrDefault();

                                var ODCStartDateWithTime = DateTime.Parse(ODCStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                var ODCEndDateWithTime = DateTime.Parse(ODCEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                query = "SELECT ODCCostID from cost_odc";
                                query += " WHERE 1=1 and IsDeleted=false";
                                query += " And ODCTypeID = '" + odcTypeTemp.ODCTypeID + "'";
                                query += " And ActivityID = '" + ActivityID + "'";
                                query += " And (ODCStartDate = '" + ODCStartDateList[i] + "' OR ODCStartDate = '" + ODCStartDateWithTime + "')";
                                query += " And (ODCEndDate = '" + ODCEndDateList[i] + "' OR ODCEndDate ='" + ODCEndDateWithTime + "')";
                                duplicateCheckerConn = ConnectionManager.getConnection();
                                duplicateCheckerConn.Open();
                                command = new MySqlCommand(query, duplicateCheckerConn);
                                using (duplicateCheckReader = command.ExecuteReader())
                                {
                                    if (duplicateCheckReader.HasRows)
                                    {
                                        duplicateOnRegisterFound = true;
                                    }
                                }
                            }

                            OKForRegister = true;
                        }
                    }

                    //Delete the cost
                    if (OKForDelete)
                    {
                        String odcID = ODCCostIDList[i];
                        CostODC odc = ctx.CostODC.Where(a => a.ODCCostID == odcID).FirstOrDefault();

                        //Delete CostLineItemTracke
                        if (odc != null)
                        {
                            //Check if the lineNumber still used by other cost
                            //check_if_cost_exist_in_other_trend
                            //int zero = 0;
                            var result = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber, 
                                                activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription, "ODC", null, null, odc.ODCTypeID.ToString(),
                                                                                    null, null, null, null);
                            if (result == 0) //This cost is not being used in other trend
                            {
                                CostLineItemTracker.removeCostLine("ODC", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                category.SubCategoryID, null, null, null, null, odc.ODCTypeID.ToString(), null, null, null); //NUll - not required
                            }

                            Cost.saveODCCost("3", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i],
                                              null, null, null, 0, null, null, null, 0, 0, 0, null); //These null values are not important for deletion
                        }

                        update_result += "";


                    }
                    //Update the Program
                    if (OKForUpdate)
                    {
                        if (duplicateOnUpdateFound)
                        {
                            update_result = "Duplicate found for ODC: " + ODCType + ". \n";

                            return update_result;
                        }
                        else
                        {

                            String odcID = ODCCostIDList[i];
                            CostODC odc = ctx.CostODC.Where(a => a.ODCCostID == odcID && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                            //CostLineItemResult costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                            //                                          category.CategoryID, category.SubCategoryID, "ODC", null, null, odcTypeID.ToString(), null, null, null, null);
                            string lineItem = null;
                            Boolean costExistInOtherTrend = false;

                            if (odcTypeID != odc.ODCTypeID)
                            {
                                //Changes in ODC type
                                var oldCost = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber.ToString(), activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription,
                                                                                              "ODC", null, null, odc.ODCTypeID.ToString(), null, null, null, null);
                                costExistInOtherTrend = (oldCost > 0) ? true : false;

                                //If the cost does not exist in any other trend -> remove -> create
                                //If it exist in other trends -> resuse

                                //Remove -> because the type and name is different now
                                if (!costExistInOtherTrend)
                                {
                                    CostLineItemTracker.removeCostLine("ODC", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                     category.SubCategoryID, null, null, null, null, odc.ODCTypeID.ToString(), null, null, odc.CostLineItemID);

                                    if (!costLineItem.IsExist)
                                        costLineItem.LineNumber = int.Parse(odc.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    /*costLineItem.LineNumber = int.Parse(odc.CostLineItemID.Split('.').LastOrDefault().ToString());*/ //Resue the line id number

                                    //Manasi 06-11-2020
                                    if (!newCostLineItem.IsExist)
                                        newCostLineItem.LineNumber = int.Parse(odc.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    // newCostLineItem.LineNumber = int.Parse(odc.CostLineItemID.Split('.').LastOrDefault().ToString()); //Resue the line id number


                                }

                                if (costLineItem != null && costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + costLineItem.LineNumber.ToString();
                                else
                                    lineNumber = costLineItem.LineNumber.ToString();

                                //Manasi 06-11-2020
                                if (newCostLineItem != null && newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else
                                    lineNumber = newCostLineItem.LineNumber.ToString();

                                //Save
                                //if (!costLineItem.IsExist)
                                if (!newCostLineItem.IsExist)   //Manasi 06-11-2020
                                    CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                        category.SubCategoryID, "ODC", null, null, null, null, odcTypeID.ToString(), null, null, lineNumber);

                                //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                //              phase.ActivityPhaseCode.ToString(),
                                //        category.CategoryID, category.SubCategoryID, lineNumber);

                                //----------Manasi 26-10-2020-------------------------------------------
                                string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                year = year.Substring(2, 2);

                                lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                             phase.ActivityPhaseCode.ToString(),
                                       category.CategoryID, category.SubCategoryID, lineNumber, year, "2", programElementClass.ProjectClassLineItemID);
                                //-------------------------------------------------------------------------
                            }
                            else
                            {
                                lineItem = odc.CostLineItemID;
                                if (CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == 4 || CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == '4')
                                {
                                   //do nothing
                                }
                                else
                                {
                                    lineItem = odc.CostLineItemID;

                                    //Check if costline already exist
                                    CostLineItemTracker existingCostLineItem = CostLineItemTracker.checkIfCostLineItemExist("ODC", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber,
                                                            phase.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID, null, null, null, null, odcTypeID.ToString(), null, null, lineNumber, TrendNumber.ToString());

                                    lineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                (costLineItem != null && costLineItem.LineNumber != 0) ? costLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Manasi 06-11-2020
                                    lineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                (newCostLineItem != null && newCostLineItem.LineNumber != 0) ? newCostLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Regenerate the LineItem
                                    //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                    //              phase.ActivityPhaseCode.ToString(),
                                    //        category.CategoryID, category.SubCategoryID, lineNumber);

                                    //----------Manasi 26-10-2020-------------------------------------------
                                    string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                    year = year.Substring(2, 2);
                                    lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                  phase.ActivityPhaseCode.ToString(),
                                           category.CategoryID, category.SubCategoryID, lineNumber, year, "2", programElementClass.ProjectClassLineItemID);
                                    //-------------------------------------------------------------------------
                                    if (existingCostLineItem == null)
                                        CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                        category.SubCategoryID, "ODC", null, null, null, null, odcTypeID.ToString(), null, null, lineNumber);
                                }
                            }


                            Cost.saveODCCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i],
                                                       ODCStartDateList[i], ODCEndDateList[i], ODCCostList[i], materialId, "0", ODCCostList[i],
                                                                Scale, odcTypeID, 1, 0, lineItem); //These null values are not important for deletion


                            update_result += "";

                            duplicateOnUpdateFound = false;

                            OKForUpdate = false;
                        }
                    }

                    //Register the program
                    if (OKForRegister)
                    {
                        if (duplicateOnRegisterFound)
                        {
                            update_result = "Duplicate found for ODC: " + ODCType + ". \n";

                            return update_result;
                        }
                        else
                        {


                            //is LineItemexist

                            bool isExist = false;


                            if (costLineItem != null)
                            {
                                if (costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + costLineItem.LineNumber.ToString();
                                else lineNumber = costLineItem.LineNumber.ToString();
                                isExist = costLineItem.IsExist;
                            }

                            //Manasi 06-11-2020
                            if (newCostLineItem != null)
                            {
                                if (newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    lineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else lineNumber = newCostLineItem.LineNumber.ToString();
                                isExist = newCostLineItem.IsExist;
                            }

                            //string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                            //                 phase.ActivityPhaseCode.ToString(),
                            //           category.CategoryID, category.SubCategoryID, lineNumber);

                            //----------Manasi 26-10-2020-------------------------------------------
                            string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                            year = year.Substring(2, 2);

                            string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                             phase.ActivityPhaseCode.ToString(),
                                       category.CategoryID, category.SubCategoryID, lineNumber, year, "2", programElementClass.ProjectClassLineItemID);
                            //------------------------------------------------------------------------- 

                            Cost.saveODCCost("1", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i], ODCStartDateList[i], ODCEndDateList[i], ODCCostList[i], materialId, "0", ODCCostList[i],
                                                    Scale, odcTypeID, 1, zero, lineItem);

                            //Create line Item
                            //if (costLineItem.IsExist == false)
                            if (newCostLineItem.IsExist == false)   //Manasi 06-11-2020
                            {
                                //CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                //                        category.SubCategoryID, "ODC", null, null, null, null, odcTypeID.ToString(), null, null, lineNumber);

                            }

                            update_result += "";

                            duplicateOnRegisterFound = false;

                            //   OKForRegister = false;
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                update_result += "Failed to update " + ODCType + ". \n";

                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
                if (duplicateCheckerConn != null) conn.Close();
                if (duplicateCheckReader != null) reader.Close();
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            if (OKForRegister)
                CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                       category.SubCategoryID, "ODC", null, null, null, null, odcTypeID.ToString(), null, null, lineNumber);

            if (!OKForDelete)
                Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(lineId), Scale, "ODC");
            if (actualCostId > 0)
                Scaling.scaling(Convert.ToInt16(ActivityID), actualCostId, Scale, "ODC");
            var totalQuantity = ODCCostList.Sum(a => Convert.ToDouble(a));
            var aId = Convert.ToInt16(ActivityID);
            List<CostODC> costList = new List<CostODC>();
            if (Scale == "month")
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }
            else
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "month", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "month", costList, ctx, totalQuantity);
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                //Nivedita 03-05-2022
               // if (costList.Count != 0)
                    //adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }

            update_result += "";
            return update_result;
        }
        public static void adjustLastValue(String activityId, String scale, List<CostODC> costList, CPPDbContext ctx, Double totalQuantity)
        {
            var lastItem = costList.Last();
            var totalToAdjust = 0.0;
            try
            {
                foreach (var cost in costList)
                {
                    if (cost.Equals(lastItem))
                    {
                        //adjust last value
                        var adjustedValue = totalQuantity - totalToAdjust;
                        adjustedValue = Convert.ToDouble(adjustedValue.ToString("F8"));
                        
                        cost.ODCCost = adjustedValue.ToString("F8");
                        
                        cost.ODCQuantity = adjustedValue.ToString("F8");
                        var newCtx = new CPPDbContext();
                        var currentCost = newCtx.CostODC.Where(a => a.ODCCostID == cost.ODCCostID && a.Granularity == scale && a.IsDeleted==false).FirstOrDefault();
                        currentCost.ODCCost = cost.ODCCost;
                        currentCost.ODCQuantity = cost.ODCQuantity;
                        newCtx.Entry(currentCost).State = System.Data.Entity.EntityState.Modified;
                        newCtx.SaveChanges();
                    }
                    else
                    {
                        totalToAdjust += Convert.ToDouble(cost.ODCQuantity);
                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            
        }
        public static String updateMultipleCostODC(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String CostID,
                                                    String StartDate, String EndDate, String Description, String TextBoxValue, String Base, String Scale,
                                                    String ODCIDList, String drag_direction, String ODCType, String NumberOfTextboxToBeRemoved, int CostTrackTypeID, String CostLineItemId)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            var NumberOfTextbox = 0;
            var isZero = true;
            //List<String> FTEValueList = FTEValue.Split(',').ToList();
            List<String> ODCCostList = TextBoxValue.Split(',').ToList();
            List<String> ODCStartDateList = StartDate.Split(',').ToList();
            List<String> ODCEndDateList = EndDate.Split(',').ToList();
            List<String> ODCCostIDList = ODCIDList.Split(',').ToList();
            var lineId = ODCCostIDList[0].Split('_')[1];
            Activity activity = Activity.getActivityByID(ActivityID);
            var ctx = new CPPDbContext();
            var odcTypeId = 0;
            var odc = ctx.ODCType.Where(u => u.ODCTypeName == ODCType).FirstOrDefault();
            if (odc != null)
                odcTypeId = odc.ODCTypeID;


            if (drag_direction == "right-left")
            {
                for (int i = 0; i < ODCCostIDList.Count; i++)
                {
                    try
                    {
                        // create and open a connection object
                        //conn = ConnectionManager.getConnection();
                        //conn.Open();
                        ////Check if program exists in system
                        //String query = "SELECT ODCCostID from cost_odc";
                        //query += " WHERE 1=1";
                        //query += " AND ODCCostID = @ODCCostID";
                        //query += " ANd Granularity = '" + Scale + "'";
                        //MySqlCommand command = new MySqlCommand(query, conn);
                        //command.Parameters.AddWithValue("@ODCCostID", ODCCostIDList[i]);
                        //using (reader = command.ExecuteReader())
                        //{
                        //    if (reader.HasRows)
                        //    {
                        //        reader.Read();

                        //        if (reader.GetValue(0).ToString().Trim() == ODCCostIDList[i])
                        //            OKForUpdate = true;

                        //    }
                        //    else
                        //        update_result += "ODC '" + ODCCostIDList[i] + "' does not exist in system";
                        //}
                        CostODC currentCost = null;
                        var costCellID = ODCCostIDList[i];
                        using (var getCtx = new CPPDbContext())
                        {
                            currentCost = getCtx.CostODC.Where(a => a.ODCCostID == costCellID && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();

                            if (currentCost != null)
                                OKForUpdate = true;
                            else
                                update_result += "ODC '" + ODCCostIDList[i] + "' does not exist in system";

                            if (OKForUpdate && currentCost != null)
                            {
                                //if (!ODCCostList[i].Equals("0"))

                                //var tempID = ODCCostIDList[i];

                                if (Convert.ToDateTime(ODCStartDateList[i]) > Convert.ToDateTime(activity.ActivityEndDate))
                                {
                                    //query = "DELETE FROM cost_odc ";
                                    //query += " WHERE";
                                    //query += " ODCCostID = @ODCCostID";
                                    //query += " AND Granularity = '" + Scale + "'";
                                    //command = new MySqlCommand(query, conn);
                                    //command.Parameters.AddWithValue("@ODCCostID", ODCCostIDList[i]);
                                    //command.ExecuteNonQuery();
                                    getCtx.Entry<CostODC>(currentCost).State = System.Data.Entity.EntityState.Deleted;
                                    getCtx.SaveChanges();
                                }
                                else
                                {
                                    
                                    Cost.saveODCCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i],
                                                      ODCStartDateList[i], ODCEndDateList[i], ODCCostList[i], 0, "0", ODCCostList[i],
                                                               Scale, currentCost.ODCTypeID, 1, 0, currentCost.CostLineItemID); //These null values are not important for deletion
                                    //query = "UPDATE cost_odc SET";
                                    //query += " ODCCostID = '" + ODCCostIDList[i] + "',";
                                    //query += " ODCStartDate = '" + ODCStartDateList[i] + "',";
                                    //query += " ODCEndDate = '" + ODCEndDateList[i] + "',";
                                    //// query += " ODCDescription = '" + Description + "',";
                                    //query += " ODCQuantity = '" + ODCCostList[i] + "',";
                                    //// query += " ODCPrice = '" + Base + "',";
                                    //// query += " ODCType = '" + ODCType + "',";
                                    //query += " ODCCost = '" + ODCCostList[i] + "',";
                                    //query += " Granularity = '" + Scale + "',";
                                    //query += " ODCTypeID = " + odcTypeId;

                                    //query += " WHERE";
                                    //query += " ODCCostID = @ODCCostID";//'" + ODCCostIDList[i] + "'";
                                    //query += " AND Granularity = '" + Scale + "'";
                                    //command = new MySqlCommand(query, conn);
                                    //command.Parameters.AddWithValue("@ODCCostID", ODCCostIDList[i]);
                                    //command.ExecuteNonQuery();
                                }
                            }

                            }

                        //Update the Program
                     
                        

                    }


                    catch (Exception ex)
                    {
                        var stackTrace = new StackTrace(ex, true);
                        var line = stackTrace.GetFrame(0).GetFileLineNumber();
                        Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                    }
                    finally
                    {
                        if (conn != null) conn.Close();
                        if (reader != null) reader.Close();
                    }
                    Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


                }
            }

            else
            {
                for (int i = 0; i < ODCCostIDList.Count; i++)
                {
                    try
                    {
                        // create and open a connection object
                        //conn = ConnectionManager.getConnection();
                        //conn.Open();
                        ////Check if program exists in system
                        //String query = "SELECT ODCCostID from cost_odc";
                        //query += " WHERE 1=1";
                        //query += " AND ODCCostID = @ODCCostID";//'" + ODCCostIDList[i] + "'";
                        //query += " And Granularity  = '" + Scale + "'";
                        //MySqlCommand command = new MySqlCommand(query, conn);
                        //command.Parameters.AddWithValue("@ODCCostID", ODCCostIDList[i]);
                        //using (reader = command.ExecuteReader())
                        //{
                        //    if (reader.HasRows)
                        //    {
                        //        reader.Read();

                        //        if (reader.GetValue(0).ToString().Trim() == ODCCostIDList[i])
                        //            OKForUpdate = true;

                        //    }
                        //    else
                        //        update_result += "ODC '" + ODCCostIDList[i] + "' does not exist in system";
                        //}
                        CostODC currentCost = null;
                        var costCellID = ODCCostIDList[i];
                        using (var getCtx = new CPPDbContext())
                        {
                            currentCost = getCtx.CostODC.Where(a => a.ODCCostID == costCellID && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();

                            if (currentCost != null)
                                OKForUpdate = true;
                            else
                                update_result += "ODC '" + ODCCostIDList[i] + "' does not exist in system";

                            if (OKForUpdate && currentCost != null)
                            {
                                //if (!ODCCostList[i].Equals("0"))
                                //{
                               // var tempID = ODCCostIDList[i];
                                var count = 0;
                                var newODCCostID = "";
                                if (drag_direction == "left-right")
                                {

                                    for (int k = costCellID.Length - 1; costCellID[k] != '_'; k--)
                                    {
                                        count++;
                                    }
                                    var TextboxID = int.Parse(costCellID.Substring(costCellID.Length - count));
                                    var firstPartID = costCellID.Substring(0, costCellID.Length - count);

                                    NumberOfTextbox = TextboxID - int.Parse(NumberOfTextboxToBeRemoved);
                                    newODCCostID = firstPartID + NumberOfTextbox.ToString();
                                }
                                else
                                {
                                    newODCCostID = ODCCostIDList[i];
                                }
                                if (NumberOfTextbox >= 0)
                                {
                                    //query = "UPDATE cost_odc SET";
                                    //query += " ODCCostID = '" + newODCCostID + "',";
                                    //query += " ODCStartDate = '" + ODCStartDateList[i] + "',";
                                    //query += " ODCEndDate = '" + ODCEndDateList[i] + "',";
                                    //query += " ODCQuantity = '" + ODCCostList[i] + "',";
                                    //query += " ODCPrice = '" + '0' + "',";
                                    //query += " ODCCost = '" + ODCCostList[i] + "',";
                                    //query += " Granularity = '" + Scale + "',";
                                    //query += " ODCTypeID = " + odcTypeId;

                                    //query += " WHERE";
                                    //query += " ODCCostID = @ODCCostID";//'" + ODCCostIDList[i] + "'";
                                    //query += " AND Granularity = '" + Scale + "'";
                                    //command = new MySqlCommand(query, conn);
                                    //command.Parameters.AddWithValue("@ODCCostID", ODCCostIDList[i]);
                                    //command.ExecuteNonQuery();

                                    currentCost.ODCCostID = newODCCostID;
                                    getCtx.Entry<CostODC>(currentCost).State = System.Data.Entity.EntityState.Modified;
                                    getCtx.SaveChanges();

                                    Cost.saveODCCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i],
                                             ODCStartDateList[i], ODCEndDateList[i], ODCCostList[i], 0, "0", ODCCostList[i],
                                                      Scale, currentCost.ODCTypeID, 1, 0, currentCost.CostLineItemID); //These null values are not important for deletion
                                }
                                else if (NumberOfTextbox < 0)
                                {
                                    //query = "DELETE FROM cost_odc ";
                                    //query += " WHERE";
                                    //query += " ODCCostID = @ODCCostID";//'" + ODCCostIDList[i] + "'";
                                    //query += " AND Granularity = '" + Scale + "'";
                                    //command = new MySqlCommand(query, conn);
                                    //command.Parameters.AddWithValue("@ODCCostID", ODCCostIDList[i]);
                                    //command.ExecuteNonQuery();
                                    getCtx.Entry<CostODC>(currentCost).State = System.Data.Entity.EntityState.Deleted;
                                    getCtx.SaveChanges();
                                }
                            }
                        }

                            //Update the Program
                        

                    }
                    catch (Exception ex)
                    {
                        var stackTrace = new StackTrace(ex, true);
                        var line = stackTrace.GetFrame(0).GetFileLineNumber();
                        Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                    }
                    finally
                    {
                        if (conn != null) conn.Close();
                        if (reader != null) reader.Close();
                    }
                    Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


                }
            }

            update_result = "Success";
            Scaling.scaling(Convert.ToInt32(ActivityID), Convert.ToInt16(CostID), Scale, "ODC");
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Scale);
            //var totalQuantity = ODCCostList.Sum(a => Convert.ToDouble(a));
           // var costRow = getCostRow(ActivityID, Scale, lineId, "ODC");
            var costRow = getCostRow(ActivityID, Scale, CostLineItemId, "ODC");
            var totalQuantity = costRow.Sum(a => Convert.ToDouble(a.ODCCost));
            var aId = Convert.ToInt16(ActivityID);
            List<CostODC> costList = new List<CostODC>();
            if (Scale == "month")
            {
                //costList = ctx.CostODC.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }
            else
            {
                //costList = ctx.CostODC.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "month", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "month", costList, ctx, totalQuantity);
                //costList = ctx.CostODC.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                //Nivedita 03-05-2022
                //if (costList.Count != 0)
                //    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }


            return update_result;
        }
        public static String updateODCCostLeftLeft(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String CostID, String StartDate, String EndDate,
                String Description, String TextBoxValue, String Base, String Scale, String ODCType, String ODCIDList, int ODCTypeID, String CostLineItemID, int CostTrackTypeID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForRegister = false;
            bool isZero = true;
            //List<String> FTEValueList = FTEValue.Split(',').ToList();
            List<String> ODCCostList = TextBoxValue.Split(',').ToList();
            List<String> ODCStartDateList = StartDate.Split(',').ToList();
            List<String> ODCEndDateList = EndDate.Split(',').ToList();
            List<String> ODCCostIDList = ODCIDList.Split(',').ToList();
            var lineId = ODCCostIDList[0].Split('_')[1];
            var ctx = new CPPDbContext();
            var odcTypeId = 0;
            var odc = ctx.ODCType.Where(u => u.ODCTypeName == ODCType).FirstOrDefault();
            if (odc != null)
                odcTypeId = odc.ODCTypeID;
            String currentUser = UserUtil.getCurrentUserName();
            for (int i = 0; i < ODCCostIDList.Count; i++)
            {
                try
                {
                    
                    CostODC currentCost = null;
                    var costCellID = ODCCostIDList[i];
                    using (var getCtx = new CPPDbContext())
                    {
                        currentCost = getCtx.CostODC.Where(a => a.ODCCostID == costCellID && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                        if (currentCost != null)
                            OKForUpdate = true;
                        else
                            OKForRegister = true;

                        //Update the Program
                        if (OKForUpdate)
                        {
                            //OKForUpdate = false;
                            Cost.saveODCCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i],
                                                   ODCStartDateList[i], ODCEndDateList[i], ODCCostList[i], 0, "0", ODCCostList[i],
                                                            Scale, odcTypeId, 1, 0, CostLineItemID); //These null values are not important for deletion
                        }

                        //Register the Program
                        if (OKForRegister)
                        {
                           
                            Cost.saveODCCost("1", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, ODCCostIDList[i],
                                                      ODCStartDateList[i], ODCEndDateList[i], ODCCostList[i], 0, "0", ODCCostList[i],
                                                               Scale, odcTypeId, 1, 0, CostLineItemID); //These null values are not important for deletion
                            OKForRegister = false;
                        }
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
                    if (conn != null) conn.Close();
                    if (reader != null) reader.Close();
                }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


            }

            update_result = "Success";
            Scaling.scaling(Convert.ToInt32(ActivityID), Convert.ToInt16(CostID), Scale, "ODC");
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Scale);

            //var costRow = getCostRow(ActivityID, Scale, lineId, "ODC");
            var costRow = getCostRow(ActivityID, Scale, CostLineItemID, "ODC");
            var totalQuantity = costRow.Sum(a => Convert.ToDouble(a.ODCCost));
            var aId = Convert.ToInt16(ActivityID);
            List<CostODC> costList = new List<CostODC>();
            if (Scale == "month")
            {
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }
            else
            {
                //costList = ctx.CostODC.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "month", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "month", costList, ctx, totalQuantity);
                //costList = ctx.CostODC.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getODCCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.ODCCost));
                //Nivedita 03-05-2022
                //if (costList.Count != 0)
                //    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }


            return update_result;
        }

    }

    [Table("cost_unitcost")]
    public class CostUnit : Audit
    {
        [NotMapped]
        public int Operation { get; set; }
        [NotMapped]
        public String ProgramID { get; set; }
        [NotMapped]
        public String ProgramElementID { get; set; }
        [NotMapped]
        public String ProjectID { get; set; }
        [NotMapped]
        public String TrendNumber { get; set; }
        [NotMapped]
        public String PhaseCode { get; set; }
        [NotMapped]
        public String TextBoxID { get; set; }
        [NotMapped]
        public String CostTrackTypes { get; set; }
        public String CostLineItemID { get; set; }
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int ActivityID { get; set; }

        public String UnitCostID { get; set; }
        public String UnitCostStartDate { get; set; }
        public String UnitCostEndDate { get; set; }
        public String UnitDescription { get; set; }
        public String UnitQuantity { get; set; }
        public String UnitPrice { get; set; }
        public String RawUnitPrice { get; set; }
        public String UnitCost { get; set; }
        public String UnitType { get; set; }
        public String Granularity { get; set; }
        public int MaterialID { get; set; }
        public int MaterialCategoryID { get; set; }
        public int CostTrackTypeID { get; set; }
        ///[ForeignKey]
        public int EstimatedCostID { get; set; }
        public int UnitType_ID { get; set; }
        public String OriginalCost { get; set; }
        public String ActualRate { get; set; } // Swapnil 24-11-2020
        public String ActualBudget { get; set; }// Swapnil 24-11-2020

        [ForeignKey("MaterialID")]
        public virtual Material Material { get; set; }

        [ForeignKey("ActivityID")]
        public virtual Activity Activity { get; set; }

        [ForeignKey("UnitType_ID")]
        public virtual UnitType UnitTypes { get; set; }

        public static String SQL_DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

        //Nivedita 10022022
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }
        //[ForeignKey("MaterialID")]
        //public virtual Material Material { get; set; }
        //public CostUnit(String id, String st_date, String end_date, String desc, String qty, String price, String cost, String type)
        //{ UnitCostID = id; UnitCostStartDate = st_date; UnitCostEndDate = end_date; UnitDescription = desc; UnitQuantity = qty; UnitPrice = price; UnitCost = cost; UnitType = type; }
        //public CostUnit() { }

        //From RequestUnitCostController
        public static List<CostUnit> getCostUnit(String ActivityID, String Granularity,String TrendNumber, String ProjectID, String PhaseCode, String BudgetID, String BudgetCategory, String BudgetSubCategory)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<CostUnit> RetreivedUnitCosts = new List<CostUnit>();
            //RetreivedLumpsumCosts = null;
            String query = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    List<CostUnit> MatchedUnitCostList = new List<CostUnit>();
                    var aID = Convert.ToInt16(ActivityID);
                    DateTime cutOffDate = DateUtility.getCutOffDate(Granularity);
                    Activity act = ctx.Activity.Where(a => a.ActivityID == aID && a.IsDeleted==false).FirstOrDefault();
                    if (TrendNumber == "1000") //Actual, Estimate to completion cost
                        MatchedUnitCostList = ctx.Database.SqlQuery<CostUnit>("call getActualEtcCost(@ProjectID, @CutOffDate, @CostType, @Granularity,@MainCategory, @SubCategory,@PhaseCode)",
                                                          new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", act.ProjectID),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@CutOffDate", cutOffDate.ToString("yyyy-MM-dd")),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@CostType", "U"),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@MainCategory", act.BudgetCategory),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@SubCategory", act.BudgetSubCategory),
                                                          new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode)
                                                          )
                                                          .ToList();
                    else if(TrendNumber == "2000")
                    {
                        //IEnumerable<List<CostUnit>> unitList = ctx.Database.SqlQuery<CostUnit>("call get_forecast_cost(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                        //                                    //new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", PhaseCode),  //Manasi 29-07-2020
                        //                                    //new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", BudgetCategory),
                        //                                    //new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory",BudgetSubCategory),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@CostType", "U"),
                        //                                    new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                        //                                    ).GroupBy(a => new { a.UnitDescription, a.MaterialID }).Select(a => a.ToList());

                        //-------------------------Manasi 10-11-2020-----------------------------------------
                        IEnumerable<List<CostUnit>> unitList = ctx.Database.SqlQuery<CostUnit>("call get_forecast_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@CostType", "U"),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                                                            ).GroupBy(a => new { a.UnitDescription, a.MaterialID }).Select(a => a.ToList());
                        int lineId = 1;
                        foreach (List<CostUnit> list in unitList)
                        {
                            int cellId = 0;
                            foreach (CostUnit cost in list)
                            {
                                cost.UnitCostID = ActivityID + "_" + lineId + "_" + cellId;
                                cellId += 1;
                                MatchedUnitCostList.Add(cost);
                            }
                            lineId += 1;
                        }

                    }
                    //-------------------------Manasi 10-11-2020-----------------------------------------
                    else if (TrendNumber == "3000")
                    {
                        IEnumerable<List<CostUnit>> unitList = ctx.Database.SqlQuery<CostUnit>("call get_current_cost_ForRollUp(@ProjectID, @TrendNumber, @PhaseCode, @BudgetCategory, @BudgetSubCategory,@ActivityID,@CostType, @Granularity)",
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@TrendNumber", TrendNumber),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@PhaseCode", act.PhaseCode),  //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetCategory", act.BudgetCategory), //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@BudgetSubCategory", act.BudgetSubCategory), //Manasi 29-07-2020
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@CostType", "U"),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@Granularity", "week")
                                                            ).GroupBy(a => new { a.UnitDescription, a.MaterialID }).Select(a => a.ToList());
                        int lineId = 1;
                        foreach (List<CostUnit> list in unitList)
                        {
                            int cellId = 0;
                            foreach (CostUnit cost in list)
                            {
                                cost.UnitCostID = ActivityID + "_" + lineId + "_" + cellId;
                                cellId += 1;
                                MatchedUnitCostList.Add(cost);
                            }
                            lineId += 1;
                        }

                    }

                    else
                        MatchedUnitCostList = ctx.CostUnit.Where(u => u.ActivityID == aID && u.Granularity == Granularity && u.IsDeleted==false) .ToList();
                    foreach (var MatchedUnitCost in MatchedUnitCostList)
                    {
                        //Split CostID into ActivityID, RowID, TextBoxID
                        String[] UnitCostID = MatchedUnitCost.UnitCostID.ToString().Trim().Split('_');

                        ////Find if an entry for this RowID exists
                        int i = RetreivedUnitCosts.FindIndex(UnitCost => UnitCost.UnitCostID == UnitCostID[1]);

                        if (i >= 0) //RowID exists
                        {
                            RetreivedUnitCosts[i].TextBoxID += ", " + UnitCostID[2];
                            RetreivedUnitCosts[i].UnitQuantity += ", " + MatchedUnitCost.UnitQuantity;
                            RetreivedUnitCosts[i].UnitCost += ", " + MatchedUnitCost.UnitCost;
                            RetreivedUnitCosts[i].UnitCostStartDate += ", " + MatchedUnitCost.UnitCostStartDate;
                            RetreivedUnitCosts[i].UnitCostEndDate += ", " + MatchedUnitCost.UnitCostEndDate;
                            RetreivedUnitCosts[i].CostTrackTypes += "," + MatchedUnitCost.CostTrackTypeID;
                            RetreivedUnitCosts[i].OriginalCost += "," + MatchedUnitCost.OriginalCost; // Jignesh-05-06-2021
                            //RetreivedUnitCosts[i].ActualBudget += "," + MatchedUnitCost.ActualBudget; // Swapnil 24-11-2020
                            //RetreivedUnitCosts[i].ActualRate += "," + MatchedUnitCost.ActualRate; // Swapnil 24-11-2020
                        }
                        else //RowID does not exist. Add new entry in List
                        {
                            int rowID = int.Parse(UnitCostID[1]);
                            for (int j = 0; j <= int.Parse(UnitCostID[1]); j++)
                            {
                                if (RetreivedUnitCosts.ElementAtOrDefault(j) == null)
                                    RetreivedUnitCosts.Add(new CostUnit());
                            }
                            RetreivedUnitCosts[rowID].TextBoxID = UnitCostID[2];
                            RetreivedUnitCosts[rowID].UnitCostID = rowID.ToString(); ;
                            RetreivedUnitCosts[rowID].ActivityID = MatchedUnitCost.ActivityID;
                            RetreivedUnitCosts[rowID].UnitCostStartDate = MatchedUnitCost.UnitCostStartDate;
                            RetreivedUnitCosts[rowID].UnitCostEndDate = MatchedUnitCost.UnitCostEndDate;
                            RetreivedUnitCosts[rowID].UnitDescription = MatchedUnitCost.UnitDescription;
                            RetreivedUnitCosts[rowID].UnitQuantity = MatchedUnitCost.UnitQuantity;
                            RetreivedUnitCosts[rowID].UnitPrice = MatchedUnitCost.UnitPrice;
                            RetreivedUnitCosts[rowID].RawUnitPrice = MatchedUnitCost.RawUnitPrice;
                            RetreivedUnitCosts[rowID].UnitCost = MatchedUnitCost.UnitCost;
                            RetreivedUnitCosts[rowID].Granularity = MatchedUnitCost.Granularity;
                            RetreivedUnitCosts[rowID].UnitType = MatchedUnitCost.UnitType;
                            RetreivedUnitCosts[rowID].CostTrackTypeID = MatchedUnitCost.CostTrackTypeID;
                            RetreivedUnitCosts[rowID].EstimatedCostID = MatchedUnitCost.EstimatedCostID;
                            RetreivedUnitCosts[rowID].MaterialID = MatchedUnitCost.MaterialID;
                            RetreivedUnitCosts[rowID].MaterialCategoryID = MatchedUnitCost.MaterialCategoryID;
                            RetreivedUnitCosts[rowID].CostTrackTypes = MatchedUnitCost.CostTrackTypeID.ToString();
                            RetreivedUnitCosts[rowID].CostLineItemID = MatchedUnitCost.CostLineItemID;
                            RetreivedUnitCosts[rowID].OriginalCost = MatchedUnitCost.OriginalCost;
                            RetreivedUnitCosts[rowID].ActualRate = MatchedUnitCost.ActualRate; // Swapnil 24-11-2020
                            RetreivedUnitCosts[rowID].ActualBudget = MatchedUnitCost.ActualBudget; // Swapnil 24-11-2020

                        }//End else
                    }
                }
                //    }//End reader read
                //}//End executing reader

                for (int j = 0; j < RetreivedUnitCosts.Count; j++)
                {
                    if (RetreivedUnitCosts[j].ActivityID == null || RetreivedUnitCosts[j].ActivityID == 0)
                    {
                        RetreivedUnitCosts.RemoveAt(j);
                        j = -1;
                    }

                }

                //To sort String arrays based on TextBoxID
                for (int j = 0; j < RetreivedUnitCosts.Count; j++)
                {
                    //Sort arrays by TextBoxID
                    if (RetreivedUnitCosts[j].TextBoxID != null)
                    {
                        int[] a_sortTextBoxID = RetreivedUnitCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] b_sortTextBoxID = RetreivedUnitCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] c_sortTextBoxID = RetreivedUnitCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] d_sortTextBoxID = RetreivedUnitCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();

                        String[] sortUnitCost = RetreivedUnitCosts[j].UnitCost.ToString().Trim().Split(',');
                        String[] sortUnitQuantity = RetreivedUnitCosts[j].UnitQuantity.ToString().Trim().Split(',');
                        String[] sortUnitCostStartDate = RetreivedUnitCosts[j].UnitCostStartDate.ToString().Trim().Split(',');
                        String[] sortUnitCostEndDate = RetreivedUnitCosts[j].UnitCostEndDate.ToString().Trim().Split(',');

                        Array.Sort(a_sortTextBoxID, sortUnitCost);
                        Array.Sort(b_sortTextBoxID, sortUnitCostStartDate);
                        Array.Sort(c_sortTextBoxID, sortUnitCostEndDate);
                        Array.Sort(d_sortTextBoxID, sortUnitQuantity);
                    }

                }

            }//End try

            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {


            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return RetreivedUnitCosts;
        }
        //From RegisterUnitCostController
        public static String updateCostUnit(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String UnitCostID, String StartDate, String EndDate, String UnitDescription, String UnitQuantity, String UnitPrice, String Scale, String UnitType, String FTEIDList, int MaterialCategoryID, int MaterialID,String CostTrackTypes,String CostLineID)
        {

            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            MySqlConnection duplicateCheckerConn = null;
            MySqlDataReader duplicateCheckReader = null;
            bool duplicateOnRegisterFound = false;
            bool duplicateOnUpdateFound = false;
            MySqlTransaction transaction = null;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForRegister = false;
            bool OKForDelete = false;
            bool isZero = true; var unitId = 0;
            var zero = 0;
            var actualCostId = 0;
            String LineNumber = "";
            //List<String> UnitCostList = UnitQuantity.Split(',').ToList();
            List<String> UnitCostList = (UnitQuantity != "") ? UnitQuantity.Split(',').ToList() : new List<String>();
            //var totalUnitCost = totalQuantity * UnitPrice;
            //  List<String> FTETotalCostList = FTECost.Split(',').ToList();
            List<String> UnitStartDateList = StartDate.Split(',').ToList();
            List<String> UnitEndDateList = EndDate.Split(',').ToList();


            List<String> UnitCostIDList = FTEIDList.Split(',').ToList();
            List<String> CostTrackTypeList = null;
            if (CostTrackTypes != null && CostTrackTypes != "")
                CostTrackTypeList = CostTrackTypes.Split(',').ToList();

            var lineId = UnitCostIDList[0].Split('_')[1];
            var ctx = new CPPDbContext();
            int pID = Convert.ToInt32(ProjectID);
            var project = ctx.Project.Where(p => p.ProjectID == pID && p.IsDeleted == false).FirstOrDefault();
            var projectClass = ctx.ServiceClass.Where(a => a.ID== project.ProjectClassID ).FirstOrDefault();
            var programElement = ctx.ProgramElement.Include("ProjectClass").Where(pm => pm.ProgramElementID == project.ProgramElementID && pm.IsDeleted == false).FirstOrDefault();
            var programElementClass = ctx.ProjectClass.Where(a => a.ProjectClassID == programElement.ProjectClassID ).FirstOrDefault();  //Manasi 27-10-2020
            var program = ctx.Program.Where(p => p.ProgramID == programElement.ProgramID && p.IsDeleted==false);
            int aID = Convert.ToInt16(ActivityID);
            var activity = ctx.Activity.Where(a => a.ActivityID == aID && a.IsDeleted==false).FirstOrDefault();
            var phase = ctx.PhaseCode.Where(a => a.PhaseID == activity.PhaseCode).FirstOrDefault();
            ActivityCategory category = Activity.getActivityCategory(activity);
            var unitItem = ctx.UnitType.Where(u => u.UnitName == UnitType).FirstOrDefault();
            if (unitItem != null)
                unitId = unitItem.UnitID;
            ProgramID = (program.FirstOrDefault().ProgramID).ToString();
            var material = ctx.Material.Where(u => u.Name == UnitDescription).FirstOrDefault();
            var materialId = 0;
            if (material != null)
                materialId = material.ID;
            ProgramElementID = (programElement.ProgramElementID).ToString();
            ProjectID = (project.ProjectID).ToString();
            int minArrayCount = Math.Min(UnitStartDateList.Count, UnitCostIDList.Count);
            CostLineItemResult costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                     category.CategoryID, category.SubCategoryID, "U", null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), null, null);

            //Manasi 06-11-2020
            CostLineItemResult newCostLineItem = CostLineItemResult.getNewCostLineItem(projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                                                                     category.CategoryID, category.SubCategoryID, "U", null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), null, null, ProjectID);

            for (int j = 0; j < UnitCostList.Count; j++)
            {
                if (UnitCostList[j] != "0")
                {
                    isZero = false;
                    break;
                }
            }
            try
            {
                MySqlCommand command = null;
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();
                for (int i = 0; i < minArrayCount; i++)
                {

                    if (CostTrackTypeList != null && i < CostTrackTypeList.Count &&
                        (CostTrackTypeList.ElementAt(i).FirstOrDefault() == 3 || CostTrackTypeList.ElementAt(i).Trim() == "3"))
                        continue;
                    String query = "";

                    // transaction = conn.BeginTransaction();

                    //Check if program exists in system
                    query = "SELECT UnitCostID from cost_unitcost";
                    query += " WHERE 1=1 and IsDeleted=false";
                    query += " AND UnitCostID = @UnitCostID";
                    query += " And Granularity = @Scale";
                    command = new MySqlCommand(query, conn);
                    command.Parameters.AddWithValue("@UnitCostID", UnitCostIDList[i]);
                    command.Parameters.AddWithValue("@Scale", Scale);
                    using (reader = command.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();
                            if (reader.GetValue(0).ToString().Trim() == UnitCostIDList[i] && Operation != 3)
                            {
                                //Luan experimental update
                                if (i == 0)
                                {
                                    var UnitStartDateWithTime = DateTime.Parse(UnitStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                    var UnitEndDateWithTime = DateTime.Parse(UnitEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                    query = "SELECT UnitCostID from cost_unitcost";
                                    query += " WHERE 1=1 and IsDeleted=false";
                                    query += " AND MaterialCategoryID = @MaterialCategoryID";
                                    query += " And MaterialID = @MaterialID";
                                    query += " And ActivityID = @ActivityID";
                                    query += " And (UnitCostStartDate = @UnitStartDateList OR UnitCostStartDate = @UnitStartDateWithTime)";
                                    query += " And (UnitCostEndDate = @UnitEndDateList OR UnitCostEndDate =@UnitEndDateWithTime)";
                                    query += " And UnitCostID != @UnitCostIDList";
                                    query += " And CostTrackTypeID = @CostTrackTypeList";
                                    duplicateCheckerConn = ConnectionManager.getConnection();
                                    duplicateCheckerConn.Open();
                                    command = new MySqlCommand(query, duplicateCheckerConn);
                                    command.Parameters.AddWithValue("@MaterialCategoryID", MaterialCategoryID);
                                    command.Parameters.AddWithValue("@MaterialID", MaterialID);
                                    command.Parameters.AddWithValue("@ActivityID", ActivityID);
                                    command.Parameters.AddWithValue("@UnitStartDateList", UnitStartDateList[i]);
                                    command.Parameters.AddWithValue("@UnitStartDateWithTime", UnitStartDateWithTime);
                                    command.Parameters.AddWithValue("@UnitEndDateList", UnitEndDateList[i]);
                                    command.Parameters.AddWithValue("@UnitEndDateWithTime", UnitEndDateWithTime);
                                    command.Parameters.AddWithValue("@UnitCostIDList", UnitCostIDList[i]);
                                    command.Parameters.AddWithValue("@CostTrackTypeList", CostTrackTypeList[i]);
                                    using (duplicateCheckReader = command.ExecuteReader())
                                    {
                                        if (duplicateCheckReader.HasRows)
                                        {
                                            duplicateOnUpdateFound = true;
                                        }
                                    }
                                }

                                OKForUpdate = true;
                            }
                            else if (Operation == 3)
                            {
                                OKForDelete = true;
                            }

                        }
                        else
                        {
                            //Luan experimental create
                            if (i == 0)
                            {
                                var UnitStartDateWithTime = DateTime.Parse(UnitStartDateList[i]).ToString(SQL_DATE_FORMAT);
                                var UnitEndDateWithTime = DateTime.Parse(UnitEndDateList[i]).ToString(SQL_DATE_FORMAT);

                                query = "SELECT UnitCostID from cost_unitcost";
                                query += " WHERE 1=1 and IsDeleted=false";
                                query += " AND MaterialCategoryID = @MaterialCategoryID";
                                query += " And MaterialID = @MaterialID";
                                query += " And ActivityID = @ActivityID";
                                query += " And (UnitCostStartDate = @UnitStartDateList OR UnitCostStartDate = @UnitStartDateWithTime)";
                                query += " And (UnitCostEndDate = @UnitEndDateList OR UnitCostEndDate =@UnitEndDateWithTime)";
                                duplicateCheckerConn = ConnectionManager.getConnection();
                                duplicateCheckerConn.Open();
                                command = new MySqlCommand(query, duplicateCheckerConn);
                                command.Parameters.AddWithValue("@MaterialCategoryID", MaterialCategoryID);
                                command.Parameters.AddWithValue("@MaterialID", MaterialID);
                                command.Parameters.AddWithValue("@ActivityID", ActivityID);
                                command.Parameters.AddWithValue("@UnitStartDateList", UnitStartDateList[i]);
                                command.Parameters.AddWithValue("@UnitStartDateWithTime", UnitStartDateWithTime);
                                command.Parameters.AddWithValue("@UnitEndDateList", UnitEndDateList[i]);
                                command.Parameters.AddWithValue("@UnitEndDateWithTime", UnitEndDateWithTime);
                                using (duplicateCheckReader = command.ExecuteReader())
                                {
                                    if (duplicateCheckReader.HasRows)
                                    {
                                        duplicateOnRegisterFound = true;
                                    }
                                }
                            }

                            OKForRegister = true;
                        }
                    }

                    //Delete the cost
                    if (OKForDelete)
                    {
                        String unitCostID = UnitCostIDList[i];
                        CostUnit unit = ctx.CostUnit.Where(a => a.UnitCostID == unitCostID).FirstOrDefault();

                        //Delete CostLineItemTracke
                        if (unit != null)
                        {
                            //Check if the lineNumber still used by other cost
                            //check_if_cost_exist_in_other_trend
                            //use phaseCode to join
                            //int zero = 0;
                            var result = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber, activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription, "U", null, null, null, null, null,
                                                                                                unit.MaterialCategoryID.ToString(), unit.MaterialID.ToString());
                            if (result == 0) //This cost is not being used in other trend
                            {
                                CostLineItemTracker.removeCostLine("U", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                category.SubCategoryID, null, null, null, null, null, unit.MaterialCategoryID.ToString(), unit.MaterialID.ToString(), LineNumber);
                            }

                            Cost.saveUnitCost("3", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, unitCostID, "", "", "", "", unit.MaterialCategoryID.ToString(), unit.MaterialID.ToString(), "",
                                                          "", "", "", unitId.ToString(), 0, 0, "");//Delete
                        }


                        update_result += "";

                      
                    }
                    //Update the Program
                    if (OKForUpdate)
                    {
                        if (duplicateOnUpdateFound)
                        {
                            MaterialCategory materialCategoryTemp = ctx.MaterialCategory.Where(a => a.ID == MaterialCategoryID).FirstOrDefault();
                            Material materialTemp = ctx.Material.Where(a => a.ID == MaterialID).FirstOrDefault();
                            update_result = "Duplicate found for material: " + materialCategoryTemp.Name + " - " + materialTemp.Name + ". \n";

                            return update_result;
                        }
                        else
                        {
                            String unitCostID = UnitCostIDList[i];
                            CostUnit unit = ctx.CostUnit.Where(a => a.UnitCostID == unitCostID && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                             //costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                             //                                         category.CategoryID, category.SubCategoryID, "U", null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), null, null);

                            string lineItem = null;
                            Boolean costExistInOtherTrend = false;
                            if (MaterialCategoryID != unit.MaterialCategoryID || MaterialID != unit.MaterialID)
                            {
                                //Changes in SubcontractorTypeID and SubcontractorID
                                var oldCost = CostLineItemResult.checkIfCostExistInOtherTrend(project.ProjectID.ToString(), activity.TrendNumber.ToString(), activity.PhaseCode.ToString(), category.CategoryDescription, category.SubCategoryDescription,
                                                                                              "U", null, null, null, null, null, unit.MaterialCategoryID.ToString(), unit.MaterialID.ToString());
                                costExistInOtherTrend = (oldCost > 0) ? true : false;
                                //If the cost does not exist in any other trend -> remove -> create
                                //If it exist in other trends -> resuse

                                //Remove -> because the type and name is different now
                                if (!costExistInOtherTrend)
                                {
                                    CostLineItemTracker.removeCostLine("U", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                                  category.SubCategoryID, null, null, null, null, null, unit.MaterialCategoryID.ToString(), unit.MaterialID.ToString(), LineNumber);
                                    if (!costLineItem.IsExist)
                                        costLineItem.LineNumber = int.Parse(unit.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    /*costLineItem.LineNumber = int.Parse(unit.CostLineItemID.Split('.').LastOrDefault().ToString());*/ //Resue the line id number

                                    //Manasi 06-11-2020
                                    if (!newCostLineItem.IsExist)
                                        newCostLineItem.LineNumber = int.Parse(unit.CostLineItemID.Last().ToString()); // Jignesh-18-03-2021
                                    /*newCostLineItem.LineNumber = int.Parse(unit.CostLineItemID.Split('.').LastOrDefault().ToString());*/ //Resue the line id number

                                }

                                if (costLineItem != null && costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                    LineNumber = "0" + costLineItem.LineNumber.ToString();
                                else LineNumber = costLineItem.LineNumber.ToString();

                                //Manasi 06-11-2020
                                if (newCostLineItem != null && newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    LineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else LineNumber = newCostLineItem.LineNumber.ToString();

                                //if (!costLineItem.IsExist)
                                if(!newCostLineItem.IsExist)  //Manasi 06-11-2020
                                    CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                               category.SubCategoryID, "U", null, null, null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), LineNumber);

                                //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                //            phase.ActivityPhaseCode.ToString(),
                                //      category.CategoryID, category.SubCategoryID, LineNumber);

                                //----------Manasi 26-10-2020-------------------------------------------
                                string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                year = year.Substring(2, 2);
                                lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                 phase.ActivityPhaseCode.ToString(),
                                           category.CategoryID, category.SubCategoryID, LineNumber, year, "3", programElementClass.ProjectClassLineItemID);
                                //-------------------------------------------------------------------------
                            }
                            else
                            {
                                lineItem = unit.CostLineItemID;
                                if (CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == 4 || CostTrackTypeList.ElementAt(i).Trim().FirstOrDefault() == '4')
                                {
                                    //do nothing
                                }
                                else
                                {

                                    CostLineItemTracker existingCostLineItem = CostLineItemTracker.checkIfCostLineItemExist("U", projectClass.Code.ToString(), project.ProjectNumber, project.ProjectElementNumber,
                                                            phase.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID, null, null, null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), LineNumber, TrendNumber.ToString());
                                    LineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                (costLineItem != null && costLineItem.LineNumber != 0) ? costLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Manasi 06-11-2020
                                    LineNumber = (existingCostLineItem != null) ? existingCostLineItem.lineItemNumber :
                                                                                (newCostLineItem != null && newCostLineItem.LineNumber != 0) ? newCostLineItem.LineNumber.ToString().PadLeft(2, '0') : lineItem.Split('.').Last();

                                    //Regenerate the LineItem
                                    //lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                    //             phase.ActivityPhaseCode.ToString(),
                                    //       category.CategoryID, category.SubCategoryID, LineNumber);

                                    //----------Manasi 26-10-2020-------------------------------------------
                                    string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                                    year = year.Substring(2, 2);

                                    lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                                 phase.ActivityPhaseCode.ToString(),
                                           category.CategoryID, category.SubCategoryID, LineNumber, year, "3", programElementClass.ProjectClassLineItemID);
                                    //-------------------------------------------------------------------------

                                    if (existingCostLineItem == null)
                                        CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                          category.SubCategoryID, "U", null, null, null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), LineNumber);

                                }

                            }


                            Cost.saveUnitCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, UnitCostIDList[i], UnitStartDateList[i], UnitEndDateList[i], UnitDescription, UnitCostList[i],
                                                MaterialCategoryID.ToString(), MaterialID.ToString(), UnitPrice, (Convert.ToDouble(UnitCostList[i]) * Convert.ToDouble(UnitPrice)).ToString(), Scale, UnitType, unitId.ToString(),
                                                0, 0, lineItem);

                    

                            update_result += "";

                            duplicateOnUpdateFound = false;

                            OKForUpdate = false;
                        }
                    }

                    //Register the program
                    if (OKForRegister)
                    {
                        if (duplicateOnRegisterFound)
                        {
                            MaterialCategory materialCategoryTemp = ctx.MaterialCategory.Where(a => a.ID == MaterialCategoryID).FirstOrDefault();
                            Material materialTemp = ctx.Material.Where(a => a.ID == MaterialID).FirstOrDefault();
                            update_result = "Duplicate found for material: " + materialCategoryTemp.Name + " - " + materialTemp.Name + ". \n";

                            return update_result;
                        }
                        else
                        {
                            //CostLineItemResult costLineItem = CostLineItemResult.getCostLineItem(projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(),
                            //                                          category.CategoryID, category.SubCategoryID, "U", null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), null, null);

                            //is LineItemexist

                            bool isExist = false;


                            if (costLineItem != null)
                            {
                                if (costLineItem.LineNumber != 0 && costLineItem.LineNumber.ToString().Length == 1)
                                    LineNumber = "0" + costLineItem.LineNumber.ToString();
                                else LineNumber = costLineItem.LineNumber.ToString();
                                isExist = costLineItem.IsExist;
                            }

                            //Manasi 06-11-2020
                            if (newCostLineItem != null)
                            {
                                if (newCostLineItem.LineNumber != 0 && newCostLineItem.LineNumber.ToString().Length == 1)
                                    LineNumber = "0" + newCostLineItem.LineNumber.ToString();
                                else LineNumber = newCostLineItem.LineNumber.ToString();
                                isExist = newCostLineItem.IsExist;
                            }

                            //string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                            //                 phase.ActivityPhaseCode.ToString(),
                            //           category.CategoryID, category.SubCategoryID, LineNumber);

                            //----------Manasi 26-10-2020-------------------------------------------
                            string year = programElement.ProjectStartDate.Split('/')[2].ToString();
                            year = year.Substring(2, 2);

                            string lineItem = Cost.getLineItem(projectClass.Code.ToString(), programElement.ProjectNumber, project.ProjectElementNumber,
                                             phase.ActivityPhaseCode.ToString(),
                                       category.CategoryID, category.SubCategoryID, LineNumber, year, "3", programElementClass.ProjectClassLineItemID);
                            //-------------------------------------------------------------------------



                            Cost.saveUnitCost("1", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, UnitCostIDList[i], UnitStartDateList[i], UnitEndDateList[i], UnitDescription,
                                               UnitCostList[i], MaterialCategoryID.ToString(), MaterialID.ToString(), UnitPrice, (Convert.ToDouble(UnitCostList[i]) * Convert.ToDouble(UnitPrice)).ToString(),
                                               Scale, UnitType, unitId.ToString(), 1, 0, lineItem);

                            //Create line Item
                            if (isExist == false)
                            {
                                //CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber,project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                //                     category.SubCategoryID, "U", null, null, null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), LineNumber);

                            }
                       
                            update_result += "";

                            duplicateOnRegisterFound = false;

                            //OKForRegister = false;
                        }
                    }

                }
                if(OKForRegister)
                    CostLineItemTracker.save(projectClass.Code.ToString(), project.ProjectID.ToString(), project.ProjectNumber, project.ProjectElementNumber, activity.TrendNumber, phase.ActivityPhaseCode.ToString(), category.CategoryID,
                                                   category.SubCategoryID, "U", null, null, null, null, null, MaterialCategoryID.ToString(), MaterialID.ToString(), LineNumber);

            }
            catch (Exception ex)
            {
                MaterialCategory materialCategoryTemp = ctx.MaterialCategory.Where(a => a.ID == MaterialCategoryID).FirstOrDefault();
                Material materialTemp = ctx.Material.Where(a => a.ID == MaterialID).FirstOrDefault();
                update_result += "Failed to update " + materialCategoryTemp.Name + " - " + materialTemp.Name + ". \n";

                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
                if (duplicateCheckerConn != null) conn.Close();
                if (duplicateCheckReader != null) reader.Close();
            }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


            
            if(!OKForDelete)
                Scaling.scaling(Convert.ToInt16(ActivityID), Convert.ToInt16(lineId), Scale, "U");
            if (actualCostId > 0)
                Scaling.scaling(Convert.ToInt16(ActivityID), actualCostId, Scale, "U");
            //var costRow = getCostRow(ActivityID, Scale, lineId, "U");
            var costRow = getCostRow(ActivityID, Scale, CostLineID, "U");

            var totalQuantity = costRow.Sum(a => Convert.ToDouble(a.UnitQuantity));
            var aId = Convert.ToInt16(ActivityID);
            List<CostUnit> costList = new List<CostUnit>();
            if (Scale == "month")
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.UnitQuantity));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }
            else
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "month", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.UnitQuantity));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "month", costList, ctx, totalQuantity);
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "week", aId);
                totalQuantity = costList.Sum(a => Convert.ToDouble(a.UnitQuantity));
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }

            update_result += "";
            return update_result;
        }
        public static void adjustLastValue(String activityId, String scale, List<CostUnit> costList, CPPDbContext ctx, Double totalQuantity)
        {
            var lastItem = costList.Last();
            var totalToAdjust = 0.0;
            try
            {
                foreach (var cost in costList)
                {
                    if (cost.Equals(lastItem))
                    {
                        //adjust last value
                        var adjustedValue = totalQuantity - totalToAdjust;
                        adjustedValue = Convert.ToDouble(adjustedValue.ToString("F8"));
                        cost.UnitCost = (adjustedValue * Convert.ToDouble(cost.UnitPrice)).ToString("F");
                        cost.UnitQuantity = adjustedValue.ToString("F8");
                        
                        var newCtx = new CPPDbContext();
                        var currentCost = newCtx.CostUnit.Where(a => a.UnitCostID == cost.UnitCostID && a.Granularity == scale && a.IsDeleted==false).FirstOrDefault();
                        currentCost.UnitCost = cost.UnitCost;
                        currentCost.UnitQuantity = cost.UnitQuantity;
                        currentCost.CostLineItemID = cost.CostLineItemID;
                        newCtx.Entry(currentCost).State = System.Data.Entity.EntityState.Modified;
                        newCtx.SaveChanges();
                    }
                    else
                    {
                        totalToAdjust += Convert.ToDouble(cost.UnitQuantity);
                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }


        }
        public static List<CostUnit> getCostRow(String ActivityID, String Granularity, String LineID, String CostType)   //int LineID  Manasi 13-08-2020
        {
            List<CostUnit> results = new List<CostUnit>();
            using (var ctx = new CPPDbContext())
            {
                String query = "CALL get_cost_row(@ActivityID,@LineID,@Granularity,@CostType)";
                results = ctx.Database.SqlQuery<CostUnit>(query,
                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID),
                                             new MySql.Data.MySqlClient.MySqlParameter("@LineID", LineID),
                                              new MySql.Data.MySqlClient.MySqlParameter("@Granularity", Granularity),
                                               new MySql.Data.MySqlClient.MySqlParameter("@CostType", CostType)
                                        ).ToList();
            }
            return results;
        }
        public static String updateMultipleCostUnit(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String CostID,
                                                    String StartDate, String EndDate, String Description, String TextBoxValue, String Base, String Scale,
                                                    String FTEIDList, String drag_direction, String UnitType, String NumberOfTextboxToBeRemoved, int CostTrackTypeID, String CostLineItemId)   //Manasi 31-08-2020
        {

            String update_result = "";
            bool OKForUpdate = false;
            var NumberOfTextbox = 0;
            //List<String> FTEValueList = FTEValue.Split(',').ToList();
            List<String> UnitCostList = TextBoxValue.Split(',').ToList();
            List<String> UnitStartDateList = StartDate.Split(',').ToList();
            List<String> UnitEndDateList = EndDate.Split(',').ToList();
            List<String> UnitCostIDList = FTEIDList.Split(',').ToList();
            var lineId = UnitCostIDList[0].Split('_')[1];
            Activity activity = Activity.getActivityByID(ActivityID);
            //var ctx = new CPPDbContext();
            var unitTypeId = 0;
            UnitType unit = null;
            if (unit != null)
                unitTypeId = unit.UnitID;


            if (drag_direction == "right-left")
            {
                for (int i = 0; i < UnitCostIDList.Count; i++)
                {
                    try
                    {
                       
                        CostUnit currentCost = null;
                        using (var ctx = new CPPDbContext())
                        {
                            unit = ctx.UnitType.Where(u => u.UnitName == UnitType).FirstOrDefault();
                            var cellCostId = UnitCostIDList[i];
                            currentCost = ctx.CostUnit.Where(a => a.UnitCostID == cellCostId && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                            if (currentCost != null)
                                OKForUpdate = true;
                            else
                                update_result += "Unit '" + UnitCostIDList[i] + "' does not exist in system";

                            //Update the Program
                            if (OKForUpdate && currentCost != null)
                            {
                             

                                if (Convert.ToDateTime(UnitStartDateList[i]) > Convert.ToDateTime(activity.ActivityEndDate))
                                {
                                    ctx.Entry<CostUnit>(currentCost).State = System.Data.Entity.EntityState.Deleted;
                                    ctx.SaveChanges();
                                }
                                else
                                {
                                    unitTypeId = (unitTypeId == 0) ? currentCost.UnitType_ID : unitTypeId;

                                    Cost.saveUnitCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, UnitCostIDList[i], UnitStartDateList[i], UnitEndDateList[i], Description, UnitCostList[i],
                                            currentCost.MaterialCategoryID.ToString(), currentCost.MaterialID.ToString(), Base, (Convert.ToDouble(UnitCostList[i]) * Convert.ToDouble(Base)).ToString(), Scale, UnitType, unitTypeId.ToString(),
                                            CostTrackTypeID, 0, currentCost.CostLineItemID); //0 Estimated CostID
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
                   
                    Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


                }
            }

            else
            {
                for (int i = 0; i < UnitCostIDList.Count; i++)
                {
                    try
                    {
                        
                        CostUnit currentCost = null;
                        var cellCostId = UnitCostIDList[i];
                        using (var ctx = new CPPDbContext())
                        {
                            unit = ctx.UnitType.Where(u => u.UnitName == UnitType ).FirstOrDefault();
                            
                            currentCost = ctx.CostUnit.Where(a => a.UnitCostID == cellCostId && a.Granularity == Scale && a.IsDeleted==false).FirstOrDefault();
                            if (currentCost != null)
                                OKForUpdate = true;
                            else
                                update_result += "Unit '" + UnitCostIDList[i] + "' does not exist in system";


                            //Update the Program
                            if (OKForUpdate && currentCost != null)
                            {
                                //if (!UnitCostList[i].Equals("0"))
                                //{
                                // var tempID = UnitCostIDList[i];
                                var count = 0;
                                var newUnitCostID = "";
                                if (drag_direction == "left-right")
                                {

                                    for (int k = cellCostId.Length - 1; cellCostId[k] != '_'; k--)
                                    {
                                        count++;
                                    }
                                    var TextboxID = int.Parse(cellCostId.Substring(cellCostId.Length - count));
                                    var firstPartID = cellCostId.Substring(0, cellCostId.Length - count);

                                    NumberOfTextbox = TextboxID - int.Parse(NumberOfTextboxToBeRemoved);
                                    newUnitCostID = firstPartID + NumberOfTextbox.ToString();
                                }
                                else
                                {
                                    newUnitCostID = UnitCostIDList[i];
                                }
                                if (NumberOfTextbox >= 0)
                                {
                                    currentCost.UnitCostID = newUnitCostID;
                                    ctx.Entry<CostUnit>(currentCost).State = System.Data.Entity.EntityState.Modified;
                                    ctx.SaveChanges();

                                    unitTypeId = (unitTypeId == 0) ? currentCost.UnitType_ID : unitTypeId;

                                    Cost.saveUnitCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, newUnitCostID, UnitStartDateList[i], UnitEndDateList[i], Description, UnitCostList[i],
                                          currentCost.MaterialCategoryID.ToString(), currentCost.MaterialID.ToString(), Base, (Convert.ToDouble(UnitCostList[i]) * Convert.ToDouble(Base)).ToString(), Scale, UnitType, unitTypeId.ToString(),
                                         CostTrackTypeID, 0, currentCost.CostLineItemID);
                                }
                                else if (NumberOfTextbox < 0)
                                {

                                    ctx.Entry<CostUnit>(currentCost).State = System.Data.Entity.EntityState.Deleted;
                                    ctx.SaveChanges();
                             
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
                 
                    Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


                }
            }

            var getCtx = new CPPDbContext();
            update_result = "Success";
            Scaling.scaling(Convert.ToInt32(ActivityID), Convert.ToInt16(CostID), Scale, "U");
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Scale);
            // var totalQuantity = UnitCostList.Sum(a => Convert.ToDouble(a));
            //var costRow = getCostRow(ActivityID, Scale, lineId, "U");
            var costRow = getCostRow(ActivityID, Scale, CostLineItemId, "U");   //Manasi 31-08-2020
            var totalQuantity = costRow.Sum(a => Convert.ToDouble(a.UnitQuantity));
            var aId = Convert.ToInt16(ActivityID);
            List<CostUnit> costList = new List<CostUnit>();
            if (Scale == "month")
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "week", aId);
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, getCtx, totalQuantity);
            }
            else
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "month", aId);
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "month", costList, getCtx, totalQuantity);
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "week", aId);
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, getCtx, totalQuantity);
            }


            return update_result;
        }
        public static String updateUnitCostLeftLeft(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String CostID, String StartDate, String EndDate,
                                            String Description, String TextBoxValue, String Base, String Scale, String UnitType, String FTEIDList, int MaterialCategoryID, int MaterialID, String CostLineItemID, int CostTrackTypeID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            bool OKForRegister = false;
            bool isZero = true;
            //List<String> FTEValueList = FTEValue.Split(',').ToList();
            List<String> UnitCostList = TextBoxValue.Split(',').ToList();
            List<String> UnitStartDateList = StartDate.Split(',').ToList();
            List<String> UnitEndDateList = EndDate.Split(',').ToList();
            List<String> UnitCostIDList = FTEIDList.Split(',').ToList();
            var lineId = UnitCostIDList[0].Split('_')[1];
            var ctx = new CPPDbContext();
            var unitTypeId = 0;
            var unit = ctx.UnitType.Where(u => u.UnitName == UnitType).FirstOrDefault();
            if (unit != null)
                unitTypeId = unit.UnitID;
            var material = ctx.Material.Where(u => u.Name == Description).FirstOrDefault();
            var materialId = 0;
            if (material != null)
                materialId = material.ID;
            String currentUser = UserUtil.getCurrentUserName();
            for (int i = 0; i < UnitCostIDList.Count; i++)
            {
                try
                {
                   
                    CostUnit currentCost = null;
                    var cellCostId = UnitCostIDList[i];
                    using(var getCtx = new CPPDbContext())
                    {
                        currentCost = getCtx.CostUnit.Where(a => a.UnitCostID == cellCostId && a.Granularity == Scale).FirstOrDefault();
                        if (currentCost != null)
                            OKForUpdate = true;
                        else
                            OKForRegister = true;


                        if (OKForUpdate)
                        {
                            
                            unitTypeId = (unitTypeId == 0) ? currentCost.UnitType_ID : unitTypeId;
                            Cost.saveUnitCost("2", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, UnitCostIDList[i], UnitStartDateList[i], UnitEndDateList[i], Description, UnitCostList[i],
                                        MaterialCategoryID.ToString(), MaterialID.ToString(), Base, (Convert.ToDouble(UnitCostList[i]) * Convert.ToDouble(Base)).ToString(), Scale, UnitType, unitTypeId.ToString(),
                                        CostTrackTypeID, 0, currentCost.CostLineItemID); //0 Estimated Cost ID

                            OKForUpdate = false;
                        }

                        //Register the Program
                        if (OKForRegister)
                        {
                          
                            Cost.saveUnitCost("1", ProgramID, ProgramElementID, ProjectID, TrendNumber, ActivityID, UnitCostIDList[i], UnitStartDateList[i], UnitEndDateList[i], Description, UnitCostList[i],
                                        MaterialCategoryID.ToString(), MaterialID.ToString(), Base, (Convert.ToDouble(UnitCostList[i]) * Convert.ToDouble(Base)).ToString(), Scale, UnitType, unitTypeId.ToString(),
                                        CostTrackTypeID, 0, CostLineItemID);

                            //}
                            OKForRegister = false;
                        }
                    }

                    //Update the Program
                   

                }
                catch (Exception ex)
                {
                    var stackTrace = new StackTrace(ex, true);
                    var line = stackTrace.GetFrame(0).GetFileLineNumber();
                    Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
                }
                finally
                {
                    if (conn != null) conn.Close();
                    if (reader != null) reader.Close();
                }
                Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);


            }

            update_result = "Success";
            Scaling.scaling(Convert.ToInt32(ActivityID), Convert.ToInt16(CostID), Scale, "U");
            UpdateAcitivtyCost.updateActivityCost(ProjectID, TrendNumber, ActivityID, Scale);
            // var costRow = getCostRow(ActivityID, Scale, lineId, "U");
            var costRow = getCostRow(ActivityID, Scale, CostLineItemID, "U");
            var totalQuantity = costRow.Sum(a => Convert.ToDouble(a.UnitQuantity));
            var aId = Convert.ToInt16(ActivityID);
            List<CostUnit> costList = new List<CostUnit>();
            if (Scale == "month")
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "week", aId);
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }
            else
            {
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "month").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "month", aId);
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "month", costList, ctx, totalQuantity);
                //costList = ctx.CostUnit.Where(l => l.ActivityID == aId && l.Granularity == "week").ToList();
                costList = getCost.getUnitCostByCostID(Convert.ToInt16(lineId), "week", aId);
                if (costList.Count != 0)
                    adjustLastValue(ActivityID, "week", costList, ctx, totalQuantity);
            }


            return update_result;
        }

    }
    //Not using this table for the moment - but might need to add it back if required
    [Table("cost_percentagebasis")]
    public class CostPercentage
    {
        [NotMapped]
        public int Operation { get; set; }
        public String ProgramID { get; set; }
        public String ProgramElementID { get; set; }
        public String ProjectID { get; set; }
        public String TrendNumber { get; set; }
        public String PhaseCode { get; set; }
        public String TextBoxID { get; set; }
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ActivityID { get; set; }

        public String PercentageBasisCostID { get; set; }
        public String PercentageBasisCostStartDate { get; set; }
        public String PercentageBasisCostEndDate { get; set; }
        public String PercentageBasisDescription { get; set; }
        public String PercentageBasisBaseAmount { get; set; }
        public String PercentageBasisPercentageValue { get; set; }
        public String PercentageBasisCost { get; set; }
        public String Granularity { get; set; }

        //public CostPercentage(String id, String st_date, String end_date, String desc, String base_amt, String pc_value, String cost)
        //{ PercentageBasisCostID = id; PercentageBasisCostStartDate = st_date; PercentageBasisCostEndDate = end_date; PercentageBasisDescription = desc; PercentageBasisBaseAmount = base_amt; PercentageBasisPercentageValue = pc_value; PercentageBasisCost = cost; }
        //public CostPercentage() { }

        //From RequestPercentageBasisCostController
        public static List<CostPercentage> getCostPercentage(String ActivityID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            List<CostPercentage> RetreivedPercentageBasisCosts = new List<CostPercentage>();
            //RetreivedLumpsumCosts = null;
            String query = "";
            try
            {
                conn = ConnectionManager.getConnection();
                conn.Open();
                query = "select PercentageBasisCostID, ActivityID, PercentageBasisCostStartDate, PercentageBasisCostEndDate, PercentageBasisDescription, PercentageBasisBaseAmount, PercentageBasisPercentageValue, PercentageBasisCost, Granularity from cost_percentagebasis";
                query += " WHERE 1 = 1";
                if (ActivityID != "null")
                    query += " AND ActivityID = @ActivityID";

                MySqlCommand command = new MySqlCommand(query, conn);
                command.Parameters.AddWithValue("@ActivityID", ActivityID);

                using (reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        CostPercentage MatchedPercentageBasisCost = new CostPercentage();

                        //Split CostID into ActivityID, RowID, TextBoxID
                        String[] PercentageBasisCostID = reader.GetValue(0).ToString().Trim().Split('_');

                        MatchedPercentageBasisCost.ActivityID = Convert.ToInt16(reader.GetValue(1).ToString().Trim());
                        MatchedPercentageBasisCost.TextBoxID = PercentageBasisCostID[2];
                        MatchedPercentageBasisCost.PercentageBasisCostStartDate = reader.GetDateTime(2).ToString("yyyy-MM-dd").Trim();
                        MatchedPercentageBasisCost.PercentageBasisCostEndDate = reader.GetDateTime(3).ToString("yyyy-MM-dd").Trim();
                        MatchedPercentageBasisCost.PercentageBasisDescription = reader.GetValue(4).ToString().Trim();
                        MatchedPercentageBasisCost.PercentageBasisBaseAmount = reader.GetValue(5).ToString().Trim();
                        MatchedPercentageBasisCost.PercentageBasisPercentageValue = reader.GetValue(6).ToString().Trim();
                        MatchedPercentageBasisCost.PercentageBasisCost = reader.GetValue(7).ToString().Trim();
                        MatchedPercentageBasisCost.Granularity = reader.GetValue(8).ToString().Trim();
                        //Find if an entry for this RowID exists
                        int i = RetreivedPercentageBasisCosts.FindIndex(PercentageBasisCost => PercentageBasisCost.PercentageBasisCostID == PercentageBasisCostID[1]);

                        if (i >= 0) //RowID exists
                        {
                            RetreivedPercentageBasisCosts[i].TextBoxID += ", " + PercentageBasisCostID[2];
                            RetreivedPercentageBasisCosts[i].PercentageBasisPercentageValue += ", " + MatchedPercentageBasisCost.PercentageBasisPercentageValue;
                            RetreivedPercentageBasisCosts[i].PercentageBasisCost += ", " + MatchedPercentageBasisCost.PercentageBasisCost;
                            RetreivedPercentageBasisCosts[i].PercentageBasisCostStartDate += ", " + MatchedPercentageBasisCost.PercentageBasisCostStartDate;
                            RetreivedPercentageBasisCosts[i].PercentageBasisCostEndDate += ", " + MatchedPercentageBasisCost.PercentageBasisCostEndDate;
                        }
                        else //RowID does not exist. Add new entry in List
                        {
                            int rowID = int.Parse(PercentageBasisCostID[1]);
                            for (int j = 0; j <= int.Parse(PercentageBasisCostID[1]); j++)
                            {
                                if (RetreivedPercentageBasisCosts.ElementAtOrDefault(j) == null)
                                    RetreivedPercentageBasisCosts.Add(new CostPercentage());
                            }
                            RetreivedPercentageBasisCosts[rowID].TextBoxID = PercentageBasisCostID[2];
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisCostID = rowID.ToString(); ;
                            RetreivedPercentageBasisCosts[rowID].ActivityID = MatchedPercentageBasisCost.ActivityID;
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisCostStartDate = MatchedPercentageBasisCost.PercentageBasisCostStartDate;
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisCostEndDate = MatchedPercentageBasisCost.PercentageBasisCostEndDate;
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisDescription = MatchedPercentageBasisCost.PercentageBasisDescription;
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisBaseAmount = MatchedPercentageBasisCost.PercentageBasisBaseAmount;
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisPercentageValue = MatchedPercentageBasisCost.PercentageBasisPercentageValue;
                            RetreivedPercentageBasisCosts[rowID].PercentageBasisCost = MatchedPercentageBasisCost.PercentageBasisCost;
                            RetreivedPercentageBasisCosts[rowID].Granularity = MatchedPercentageBasisCost.Granularity;
                        }//End else
                    }//End reader read
                }//End executing reader

                for (int j = 0; j < RetreivedPercentageBasisCosts.Count; j++)
                {
                    if (RetreivedPercentageBasisCosts[j].ActivityID == null)
                    {
                        RetreivedPercentageBasisCosts.RemoveAt(j);
                        j = -1;
                    }
                }

                //To sort String arrays based on TextBoxID
                for (int j = 0; j < RetreivedPercentageBasisCosts.Count; j++)
                {
                    //Sort arrays by TextBoxID
                    if (RetreivedPercentageBasisCosts[j].TextBoxID != null)
                    {
                        int[] a_sortTextBoxID = RetreivedPercentageBasisCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] b_sortTextBoxID = RetreivedPercentageBasisCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] c_sortTextBoxID = RetreivedPercentageBasisCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();
                        int[] d_sortTextBoxID = RetreivedPercentageBasisCosts[j].TextBoxID.Split(',').Select(n => int.Parse(n)).ToArray();

                        String[] sortPercentageBasisCost = RetreivedPercentageBasisCosts[j].PercentageBasisCost.ToString().Trim().Split(',');
                        String[] sortPercentageBasisPercentageValue = RetreivedPercentageBasisCosts[j].PercentageBasisPercentageValue.ToString().Trim().Split(',');
                        String[] sortPercentageBasisCostStartDate = RetreivedPercentageBasisCosts[j].PercentageBasisCostStartDate.ToString().Trim().Split(',');
                        String[] sortPercentageBasisCostEndDate = RetreivedPercentageBasisCosts[j].PercentageBasisCostEndDate.ToString().Trim().Split(',');

                        Array.Sort(a_sortTextBoxID, sortPercentageBasisCost);
                        Array.Sort(b_sortTextBoxID, sortPercentageBasisCostStartDate);
                        Array.Sort(c_sortTextBoxID, sortPercentageBasisCostEndDate);
                        Array.Sort(c_sortTextBoxID, sortPercentageBasisPercentageValue);

                        RetreivedPercentageBasisCosts[j].TextBoxID = string.Join(",", a_sortTextBoxID);
                        RetreivedPercentageBasisCosts[j].PercentageBasisCost = string.Join(",", sortPercentageBasisCost);
                        RetreivedPercentageBasisCosts[j].PercentageBasisPercentageValue = string.Join(",", sortPercentageBasisPercentageValue);
                        RetreivedPercentageBasisCosts[j].PercentageBasisCostStartDate = string.Join(",", sortPercentageBasisCostStartDate);
                        RetreivedPercentageBasisCosts[j].PercentageBasisCostEndDate = string.Join(",", sortPercentageBasisCostEndDate);

                    }

                }


            }//End try

            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();

            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return RetreivedPercentageBasisCosts;
        }
        public static String updateCostPercentage(int Operation, String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String ActivityID, String PercentageBasisCostID, String PercentageBasisCostStartDate, String PercentageBasisCostEndDate, String PercentageBasisDescription, String PercentageBasisBaseAmount, String PercentageBasisPercentageValue, String Granularity)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String query = "";
            String result = "Successful Delete";
            MySqlCommand command = new MySqlCommand();
            try
            {
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();

                //First delete all
                List<String> PercentageBasisPercentageValueList = PercentageBasisPercentageValue.Split(',').ToList();
                List<String> PercentageBasisCostStartDateList = PercentageBasisCostStartDate.Split(',').ToList();
                List<String> PercentageBasisCostEndDateList = PercentageBasisCostEndDate.Split(',').ToList();


                if (PercentageBasisPercentageValueList.Count == PercentageBasisCostStartDateList.Count && PercentageBasisCostStartDateList.Count == PercentageBasisCostEndDateList.Count)
                {
                    //for (int i = 0; i < LumpsumCostList.Count; i++)
                    {
                        query = "alter_cost_percentagecost"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;

                        //For delete
                        command.Parameters.Add(new MySqlParameter("_Operation", 3));
                        command.Parameters.Add(new MySqlParameter("_ProgramID", ProgramID));
                        command.Parameters.Add(new MySqlParameter("_ProgramElementID", ProgramElementID));
                        command.Parameters.Add(new MySqlParameter("_ProjectID", ProjectID));
                        command.Parameters.Add(new MySqlParameter("_TrendNumber", TrendNumber));
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        String GeneratedID = ActivityID + "_" + PercentageBasisCostID + "_%";
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisCostID", GeneratedID));
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisCostStartDate", PercentageBasisCostStartDateList[0]));
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisCostEndDate", PercentageBasisCostEndDateList[0]));
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisDescription", PercentageBasisDescription));
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisBaseAmount", PercentageBasisBaseAmount));
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisPercentageValue", PercentageBasisPercentageValueList[0]));
                        command.Parameters.Add(new MySqlParameter("_PercentageBasisCost", ""));
                        command.Parameters.Add(new MySqlParameter("_Granularity", Granularity));

                        command.ExecuteNonQuery();

                    }
                    result = "Successful delete";
                }
                else //Counts are not equal
                    result = "Invalid counts of Costs and dates";


                if (result == "Successful delete" && Operation != 3)
                {
                    //Insert rows
                    for (int i = 0; i < PercentageBasisPercentageValueList.Count; i++)
                    {
                        if (!PercentageBasisPercentageValueList[i].Equals("0"))
                        {
                            query = "alter_cost_percentagecost"; //Stored Procedure
                            command = new MySqlCommand(query, conn);
                            command.CommandType = CommandType.StoredProcedure;

                            //For Create New
                            command.Parameters.Add(new MySqlParameter("_Operation", 1));
                            command.Parameters.Add(new MySqlParameter("_ProgramID", ProgramID));
                            command.Parameters.Add(new MySqlParameter("_ProgramElementID", ProgramElementID));
                            command.Parameters.Add(new MySqlParameter("_ProjectID", ProjectID));
                            command.Parameters.Add(new MySqlParameter("_TrendNumber", TrendNumber));
                            command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                            String GeneratedID = ActivityID + "_" + PercentageBasisCostID + "_" + i;
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisCostID", GeneratedID));
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisCostStartDate", PercentageBasisCostStartDateList[i]));
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisCostEndDate", PercentageBasisCostEndDateList[i]));
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisDescription", PercentageBasisDescription));
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisBaseAmount", PercentageBasisBaseAmount));
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisPercentageValue", PercentageBasisPercentageValueList[i]));
                            command.Parameters.Add(new MySqlParameter("_PercentageBasisCost", (int.Parse(PercentageBasisBaseAmount) * (int.Parse(PercentageBasisPercentageValueList[i]) / 100))));
                            command.Parameters.Add(new MySqlParameter("_Granularity", Granularity));

                            command.ExecuteNonQuery();
                        }
                    }
                    result = "Successful Insert";

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
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();

            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return result;

        }

    }

    [Table("activity")]
    public class Activity : Audit
    {
        [NotMapped]
        public int Operation { get; set; }
        [NotMapped]
        public String ProgramID { get; set; }
        [NotMapped]
        public String ProgramElementID { get; set; }

        //luan experimental
        [NotMapped]
        public Double FTECostForecast { get; set; }
        [NotMapped]
        public Double LumpsumCostForecast { get; set; }
        [NotMapped]
        public Double UnitCostForecast { get; set; }
        [NotMapped]
        public Double OdcCostForecast { get; set; }
        
        [NotMapped]
        public Double FTEBudget { get; set; }
        [NotMapped]
        public Double LumpsumBudget { get; set; }
        [NotMapped]
        public Double UnitBudget { get; set; }
        [NotMapped]
        public Double OdcBudget { get; set; }
        
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ActivityID { get; set; }
        public int ProjectID { get; set; }
        public string TrendNumber { get; set; }
        public int PhaseCode { get; set; }
        public int TrendID { get; set; }
        public String BudgetCategory { get; set; }
        public String BudgetSubCategory { get; set; }
        public String ActivityStartDate { get; set; }
        public String ActivityEndDate { get; set; }
        public String OriginalActivityStartDate { get; set; }
        public String OriginalActivityEndDate { get; set; }

        public String ActualActivityStartDate { get; set; }
        public String ActualActivityEndDate { get; set; }
        public int PercentageCompletion { get; set; }

        public Double FTECost { get; set; }
        public Double LumpsumCost { get; set; }
        public Double UnitCost { get; set; }
        public Double OdcCost { get; set; }


        public Double FTECostActual { get; set; }
        public Double LumpsumCostActual { get; set; }
        public Double UnitCostActual { get; set; }
        public Double OdcCostActual { get; set; }

        public Double PercentageBasisCost { get; set; }
        public int OrganizationID { get; set; }
        public int BudgetID { get; set; }
        //Nivedita 10022022
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }

        //Navigation properties
        [ForeignKey("BudgetID")]
        public virtual ActivityCategory ActivityCategory { get; set; }
        [ForeignKey("ProjectID")]
        public virtual Project Project { get; set; }
        [ForeignKey("TrendID")]
        public virtual Trend Trend { get; set; }
        [ForeignKey("PhaseCode")]
        public virtual PhaseCode Phase { get; set; }

        //1 to many
        public virtual ICollection<CostFTE> FTECosts { get; set; }
        public virtual ICollection<CostLumpsum> LumpsumCosts { get; set; }
        public virtual ICollection<CostUnit> UnitCosts { get; set; }
        public virtual ICollection<CostPercentage> PercentageCosts { get; set; }
        //ODC
        public virtual ICollection<CostODC> ODCCosts { get; set; }

        

        //From RequestActivityController
        //Activity Details
        public static List<Activity> getActivityDetails(String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String PhaseCode, String ActivityID, String BudgetCategory, String BudgetSubCategory)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<Activity> MatchedActivityList = new List<Activity>();
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            try
            {

                using (var ctx = new CPPDbContext())
                {
                    var id = Convert.ToInt16(ProjectID);
                    if (TrendNumber == "2000") //Forecast not stored in the database
                    {
                        //------------Manasi 29-07-2020-----------------------------
                        int aID1 = 0;
                        int pID1 = 0;
                        if (ActivityID != null && ActivityID != "null")
                            aID1 = Convert.ToInt16(ActivityID);
                        if (PhaseCode != null && PhaseCode != "null")
                            pID1 = Convert.ToInt16(PhaseCode);
                        // ---------------------------------------------------

                        //MatchedActivityList = ctx.Database.SqlQuery<Activity>("call get_forecast_activities(@ProjectID)",
                        //                         new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID)).ToList();  

                        //Manasi 10-11-2020
                        MatchedActivityList = ctx.Database.SqlQuery<Activity>("call get_forecast_activities_ForRollUp(@ProjectID)",
                                                 new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID)).ToList();


                        //int i = 1;
                        //foreach (var act in MatchedActivityList)
                        //{
                        //    act.ActivityID = i;
                        //    i++;

                        //}

                        //------------Manasi 29-07-2020-----------------------------
                        if (ActivityID != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.ActivityID == aID1).ToList();
                        }
                        else if (PhaseCode != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.PhaseCode == pID1).ToList();
                        }
                        //MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                        //-------------------Manasi 10-11-2020--------------------------
                        MatchedActivityList = processCostForRollUp(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                        #region old Logic
                        // ---------------------------------------------------
                        //for (int x = 0; x < MatchedActivityList.Count; x++)
                        //{
                        //    List<CostFTE> FTECostList = new List<CostFTE>();
                        //    List<CostLumpsum> LumpsumCostList = new List<CostLumpsum>();
                        //    List<CostUnit> UnitCostList = new List<CostUnit>();
                        //    List<CostODC> ODCCostList = new List<CostODC>();
                        //    List<CostPercentage> PercentageBasisCostList = new List<CostPercentage>();
                        //    FTECostList = WebAPI.Models.CostFTE.getCostFTE(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, MatchedActivityList[x].PhaseCode.ToString(), "", MatchedActivityList[x].BudgetCategory, MatchedActivityList[x].BudgetSubCategory);
                        //    LumpsumCostList = WebAPI.Models.CostLumpsum.getCostLumpsum(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, MatchedActivityList[x].PhaseCode.ToString(), "", MatchedActivityList[x].BudgetCategory, MatchedActivityList[x].BudgetSubCategory);
                        //    UnitCostList = WebAPI.Models.CostUnit.getCostUnit(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, MatchedActivityList[x].PhaseCode.ToString(), "", MatchedActivityList[x].BudgetCategory, MatchedActivityList[x].BudgetSubCategory);
                        //    ODCCostList = WebAPI.Models.CostODC.getCostODC(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, MatchedActivityList[x].PhaseCode.ToString(), "", MatchedActivityList[x].BudgetCategory, MatchedActivityList[x].BudgetSubCategory);

                        //    double totalFTEActual = 0, totalLumpsumActual = 0, totalUnitActual = 0, totalODCActual = 0;
                        //    double totalFTEForecast = 0, totalLumpsumForecast = 0, totalUnitForecast = 0, totalODCForecast = 0;
                        //    double totalFTEBudget = 0, totalLumpsumBudget = 0, totalUnitBudget = 0, totalODCBudget = 0;

                        //    //FTE
                        //    for (int y = 0; y < FTECostList.Count; y++)
                        //    {
                        //        if (FTECostList[y].CostTrackTypeID == 3 || FTECostList[y].CostTrackTypeID == 4)
                        //        {
                        //            var costTrackTypeAr = FTECostList[y].CostTrackTypes.Split(',');
                        //            var costAr = FTECostList[y].OriginalCost.Split(',');
                        //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                        //            {
                        //                if (costTrackTypeAr[z].Trim() == "3")
                        //                {
                        //                    totalFTEActual += Convert.ToDouble(costAr[z]);
                        //                }
                        //                else if (costTrackTypeAr[z].Trim() == "4")
                        //                {
                        //                    totalFTEForecast += Convert.ToDouble(costAr[z]);
                        //                }
                        //            }
                        //        }

                        //        if (true)
                        //        {
                        //            string[] costs = FTECostList[y].FTECost.Split(',');
                        //            double scale = float.Parse(FTECostList[y].RawFTEHourlyRate) / float.Parse(FTECostList[y].FTEHourlyRate);
                        //            foreach (string cost in costs)
                        //            {
                        //                if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                        //                    totalFTEBudget += float.Parse(cost) * scale;
                        //            }
                        //        }
                        //    }

                        //    //Lumpsum
                        //    for (int y = 0; y < LumpsumCostList.Count; y++)
                        //    {
                        //        if (LumpsumCostList[y].CostTrackTypeID == 3 || LumpsumCostList[y].CostTrackTypeID == 4)
                        //        {
                        //            var costTrackTypeAr = LumpsumCostList[y].CostTrackTypes.Split(',');
                        //            var costAr = LumpsumCostList[y].OriginalCost.Split(',');
                        //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                        //            {
                        //                if (costTrackTypeAr[z].Trim() == "3")
                        //                {
                        //                    totalLumpsumActual += Convert.ToDouble(costAr[z]);
                        //                }
                        //                else if (costTrackTypeAr[z].Trim() == "4")
                        //                {
                        //                    totalLumpsumForecast += Convert.ToDouble(costAr[z]);
                        //                }
                        //            }
                        //        }

                        //        if (true)
                        //        {
                        //            string[] costs = LumpsumCostList[y].OriginalCost.Split(',');
                        //            foreach (string cost in costs)
                        //            {
                        //                if(LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                        //                    totalLumpsumBudget += float.Parse(cost);
                        //            }
                        //        }
                        //    }

                        //    //Unit
                        //    for (int y = 0; y < UnitCostList.Count; y++)
                        //    {
                        //        if (UnitCostList[y].CostTrackTypeID == 3 || UnitCostList[y].CostTrackTypeID == 4)
                        //        {
                        //            var costTrackTypeAr = UnitCostList[y].CostTrackTypes.Split(',');
                        //            var costAr = UnitCostList[y].OriginalCost.Split(',');
                        //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                        //            {
                        //                if (costTrackTypeAr[z].Trim() == "3")
                        //                {
                        //                    totalUnitActual += Convert.ToDouble(costAr[z]);
                        //                }
                        //                else if (costTrackTypeAr[z].Trim() == "4")
                        //                {
                        //                    totalUnitForecast += Convert.ToDouble(costAr[z]);
                        //                }
                        //            }
                        //        }

                        //        if (true)
                        //        {
                        //            string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        //            float price = float.Parse(UnitCostList[y].RawUnitPrice);
                        //            //float price = float.Parse(UnitCostList[y].UnitPrice); //Manasi
                        //            foreach (string cost in costs)
                        //            {
                        //                if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                        //                    totalUnitBudget += float.Parse(cost) * price;
                        //            }
                        //        }
                        //    }

                        //    //ODC
                        //    for (int y = 0; y < ODCCostList.Count; y++)
                        //    {
                        //        if (ODCCostList[y].CostTrackTypeID == 3 || ODCCostList[y].CostTrackTypeID == 4)
                        //        {
                        //            var costTrackTypeAr = ODCCostList[y].CostTrackTypes.Split(',');
                        //            var costAr = ODCCostList[y].OriginalCost.Split(',');
                        //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                        //            {
                        //                if (costTrackTypeAr[z].Trim() == "3")
                        //                {
                        //                    totalODCActual += Convert.ToDouble(costAr[z]);
                        //                }
                        //                else if (costTrackTypeAr[z].Trim() == "4")
                        //                {
                        //                    totalODCForecast += Convert.ToDouble(costAr[z]);
                        //                }
                        //            }
                        //        }

                        //        if (true)
                        //        {
                        //            string[] costs = ODCCostList[y].OriginalCost.Split(',');
                        //            foreach (string cost in costs)
                        //            {
                        //                if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                        //                    totalODCBudget += float.Parse(cost);
                        //            }
                        //        }
                        //    }

                        //    MatchedActivityList[x].FTEBudget = totalFTEBudget;
                        //    MatchedActivityList[x].LumpsumBudget = totalLumpsumBudget;
                        //    MatchedActivityList[x].UnitBudget = totalUnitBudget;
                        //    MatchedActivityList[x].OdcBudget = totalODCBudget;
                        //}



                        //foreach (var budget in ActivityBudget)
                        //{
                        //    foreach (var act in MatchedActivityList)
                        //    {
                        //        if (act.PhaseCode == budget.PhaseCode)
                        //        {
                        //            if (act.BudgetSubCategory == budget.BudgetSubCategory)
                        //            {
                        //                act.OriginalCost = budget.OriginalCost;
                        //            }
                        //        }
                        //    }
                        //}
                        #endregion old Logic
                    }

                    //-------------------Manasi 10-11-2020--------------------------
                    else if (TrendNumber == "3000")
                    {
                        //------------Manasi 29-07-2020-----------------------------
                        int aID1 = 0;
                        int pID1 = 0;
                        if (ActivityID != null && ActivityID != "null")
                            aID1 = Convert.ToInt16(ActivityID);
                        if (PhaseCode != null && PhaseCode != "null")
                            pID1 = Convert.ToInt16(PhaseCode);
                        // ---------------------------------------------------

                        MatchedActivityList = ctx.Database.SqlQuery<Activity>("call get_current_activities_ForRollUp(@ProjectID)",
                                                 new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID)).ToList();


                        //int i = 1;
                        //foreach (var act in MatchedActivityList)
                        //{
                        //    act.ActivityID = i;
                        //    i++;

                        //}

                        //------------Manasi 29-07-2020-----------------------------
                        if (ActivityID != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.ActivityID == aID1 && a.IsDeleted==false).ToList();
                        }
                        else if (PhaseCode != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.PhaseCode == pID1).ToList();
                        }
                        MatchedActivityList = processCostForRollUp(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);

                    }
                    else
                    {
                        if (ActivityID == "null" && PhaseCode == "null")
                        {
                            var aID = Convert.ToInt16(ProjectID);
                            var trendId = Convert.ToInt16(TrendNumber);

                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == aID && a.TrendNumber == TrendNumber && a.IsDeleted==false).ToList();

                            if (TrendNumber == "1000")
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000").ToList();

                            MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            //for (int x = 0; x < MatchedActivityList.Count; x++)
                            //{
                            //    List<CostFTE> FTECostList = new List<CostFTE>();
                            //    List<CostLumpsum> LumpsumCostList = new List<CostLumpsum>();
                            //    List<CostUnit> UnitCostList = new List<CostUnit>();
                            //    List<CostODC> ODCCostList = new List<CostODC>();
                            //    List<CostPercentage> PercentageBasisCostList = new List<CostPercentage>();
                            //    FTECostList = WebAPI.Models.CostFTE.getCostFTE(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                            //    LumpsumCostList = WebAPI.Models.CostLumpsum.getCostLumpsum(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                            //    UnitCostList = WebAPI.Models.CostUnit.getCostUnit(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                            //    ODCCostList = WebAPI.Models.CostODC.getCostODC(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);

                            //    double totalFTEActual = 0, totalLumpsumActual = 0, totalUnitActual = 0, totalODCActual = 0;
                            //    double totalFTEForecast = 0, totalLumpsumForecast = 0, totalUnitForecast = 0, totalODCForecast = 0;
                            //    double totalFTEBudget = 0, totalLumpsumBudget = 0, totalUnitBudget = 0, totalODCBudget = 0;

                            //    //FTE
                            //    for (int y = 0; y < FTECostList.Count; y++)
                            //    {
                            //        if (FTECostList[y].CostTrackTypeID == 3 || FTECostList[y].CostTrackTypeID == 4)
                            //        {
                            //            var costTrackTypeAr = FTECostList[y].CostTrackTypes.Split(',');
                            //            var costAr = FTECostList[y].OriginalCost.Split(',');
                            //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                            //            {
                            //                if (costTrackTypeAr[z].Trim() == "3")
                            //                {
                            //                    totalFTEActual += Convert.ToDouble(costAr[z]);
                            //                }
                            //                else if (costTrackTypeAr[z].Trim() == "4")
                            //                {
                            //                    totalFTEForecast += Convert.ToDouble(costAr[z]);
                            //                }
                            //            }
                            //        }

                            //        if (true)
                            //        {
                            //            string[] costs = FTECostList[y].FTECost.Split(',');
                            //            double scale = float.Parse(FTECostList[y].RawFTEHourlyRate) / float.Parse(FTECostList[y].FTEHourlyRate);
                            //            foreach (string cost in costs)
                            //            {
                            //                if (LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                            //                    totalFTEBudget += float.Parse(cost) * scale;
                            //            }
                            //        }
                            //    }

                            //    //Lumpsum
                            //    for (int y = 0; y < LumpsumCostList.Count; y++)
                            //    {
                            //        if (LumpsumCostList[y].CostTrackTypeID == 3 || LumpsumCostList[y].CostTrackTypeID == 4)
                            //        {
                            //            var costTrackTypeAr = LumpsumCostList[y].CostTrackTypes.Split(',');
                            //            var costAr = LumpsumCostList[y].OriginalCost.Split(',');
                            //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                            //            {
                            //                if (costTrackTypeAr[z].Trim() == "3")
                            //                {
                            //                    totalLumpsumActual += Convert.ToDouble(costAr[z]);
                            //                }
                            //                else if (costTrackTypeAr[z].Trim() == "4")
                            //                {
                            //                    totalLumpsumForecast += Convert.ToDouble(costAr[z]);
                            //                }
                            //            }
                            //        }

                            //        if (true)
                            //        {
                            //            string[] costs = LumpsumCostList[y].OriginalCost.Split(',');
                            //            foreach (string cost in costs)
                            //            {
                            //                if(LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                            //                     totalLumpsumBudget += float.Parse(cost);
                            //            }
                            //        }
                            //    }

                            //    //Unit
                            //    for (int y = 0; y < UnitCostList.Count; y++)
                            //    {
                            //        if (UnitCostList[y].CostTrackTypeID == 3 || UnitCostList[y].CostTrackTypeID == 4)
                            //        {
                            //            var costTrackTypeAr = UnitCostList[y].CostTrackTypes.Split(',');
                            //            var costAr = UnitCostList[y].OriginalCost.Split(',');
                            //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                            //            {
                            //                if (costTrackTypeAr[z].Trim() == "3")
                            //                {
                            //                    totalUnitActual += Convert.ToDouble(costAr[z]);
                            //                }
                            //                else if (costTrackTypeAr[z].Trim() == "4")
                            //                {
                            //                    totalUnitForecast += Convert.ToDouble(costAr[z]);
                            //                }
                            //            }
                            //        }

                            //        if (true)
                            //        {
                            //            string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                            //            float price = float.Parse(UnitCostList[y].RawUnitPrice);
                            //            foreach (string cost in costs)
                            //            {
                            //                if (LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                            //                    totalUnitBudget += float.Parse(cost) * price;
                            //            }
                            //        }
                            //    }

                            //    //ODC
                            //    for (int y = 0; y < ODCCostList.Count; y++)
                            //    {
                            //        if (ODCCostList[y].CostTrackTypeID == 3 || ODCCostList[y].CostTrackTypeID == 4)
                            //        {
                            //            var costTrackTypeAr = ODCCostList[y].CostTrackTypes.Split(',');
                            //            var costAr = ODCCostList[y].OriginalCost.Split(',');
                            //            for (int z = 0; z < costTrackTypeAr.Length; z++)
                            //            {
                            //                if (costTrackTypeAr[z].Trim() == "3")
                            //                {
                            //                    totalODCActual += Convert.ToDouble(costAr[z]);
                            //                }
                            //                else if (costTrackTypeAr[z].Trim() == "4")
                            //                {
                            //                    totalODCForecast += Convert.ToDouble(costAr[z]);
                            //                }
                            //            }
                            //        }

                            //        if (true)
                            //        {
                            //            string[] costs = ODCCostList[y].OriginalCost.Split(',');
                            //            foreach (string cost in costs)
                            //            {
                            //                if (LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                            //                    totalODCBudget += float.Parse(cost);
                            //            }
                            //        }
                            //    }

                            //    MatchedActivityList[x].FTECostActual = totalFTEActual;
                            //    MatchedActivityList[x].FTECostForecast = totalFTEForecast;
                            //    MatchedActivityList[x].LumpsumCostActual = totalLumpsumActual;
                            //    MatchedActivityList[x].LumpsumCostForecast = totalLumpsumForecast;
                            //    MatchedActivityList[x].UnitCostActual = totalUnitActual;
                            //    MatchedActivityList[x].UnitCostForecast = totalUnitForecast;
                            //    MatchedActivityList[x].OdcCostActual = totalODCActual;
                            //    MatchedActivityList[x].OdcCostForecast = totalODCForecast;

                            //    MatchedActivityList[x].FTEBudget = totalFTEBudget;
                            //    MatchedActivityList[x].LumpsumBudget = totalLumpsumBudget;
                            //    MatchedActivityList[x].UnitBudget = totalUnitBudget;
                            //    MatchedActivityList[x].OdcBudget = totalODCBudget;
                            //}
                        }
                        else
                        if (ActivityID != "null")
                        {
                            var aID = Convert.ToInt16(ActivityID);
                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == id && a.TrendNumber == TrendNumber && a.ActivityID == aID && a.IsDeleted==false).ToList();
                            if (TrendNumber == "1000")
                            {
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000" && a.ActivityID == aID).ToList();
                                MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            }
                        }
                        else if (PhaseCode != "null")
                        {
                            var phaseCode = Convert.ToInt16(PhaseCode);
                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == id && a.TrendNumber == TrendNumber && a.PhaseCode == phaseCode && a.IsDeleted==false).ToList();
                            if (TrendNumber == "1000")
                            {
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000" && a.PhaseCode == phaseCode).ToList();
                                MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            }
                        }
                        else
                        {
                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == id && a.TrendNumber == TrendNumber && a.IsDeleted==false).ToList();
                            if (TrendNumber == "1000")
                            {
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000").ToList();
                                MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            }
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
            finally
            {

                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return MatchedActivityList;

        }

        public static List<Activity> getGanttViewActivityDetails(String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String PhaseCode, String ActivityID, String BudgetCategory, String BudgetSubCategory)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<Activity> MatchedActivityList = new List<Activity>();
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            try
            {

                using (var ctx = new CPPDbContext())
                {
                    var id = 0;
                    if (ProjectID != "null")
                    {
                        id = Convert.ToInt16(ProjectID);
                    }

                    if (TrendNumber == "2000") //Forecast not stored in the database
                    {
                        //------------Manasi 29-07-2020-----------------------------
                        int aID1 = 0;
                        int pID1 = 0;
                        if (ActivityID != null && ActivityID != "null")
                            aID1 = Convert.ToInt16(ActivityID);
                        if (PhaseCode != null && PhaseCode != "null")
                            pID1 = Convert.ToInt16(PhaseCode);

                        MatchedActivityList = ctx.Database.SqlQuery<Activity>("call get_forecast_activities_ForRollUp(@ProjectID)",
                                                 new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID)).ToList();

                        if (ActivityID != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.ActivityID == aID1).ToList();
                        }
                        else if (PhaseCode != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.PhaseCode == pID1).ToList();
                        }

                        MatchedActivityList = processCostForRollUp(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);

                    }

                    else if (TrendNumber == "3000")
                    {
                        int aID1 = 0;
                        int pID1 = 0;
                        if (ActivityID != null && ActivityID != "null")
                            aID1 = Convert.ToInt16(ActivityID);
                        if (PhaseCode != null && PhaseCode != "null")
                            pID1 = Convert.ToInt16(PhaseCode);

                        MatchedActivityList = ctx.Database.SqlQuery<Activity>("call get_current_activities_ForRollUp(@ProjectID)",
                                                 new MySql.Data.MySqlClient.MySqlParameter("@ProjectID", ProjectID)).ToList();

                        if (ActivityID != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.ActivityID == aID1).ToList();
                        }
                        else if (PhaseCode != "null")
                        {
                            MatchedActivityList = MatchedActivityList.Where(a => a.PhaseCode == pID1).ToList();
                        }
                        MatchedActivityList = processCostForRollUp(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);

                    }
                    else
                    {
                        if (ActivityID == "null" && PhaseCode == "null")
                        {
                            //var aID = Convert.ToInt16(ProjectID);
                            var trendId = Convert.ToInt16(TrendNumber);
                            if (ProgramID != "null" && ProgramElementID == "null" && ProjectID == "null")
                            {
                                var prgID = Convert.ToInt16(ProgramID);
                                var progElementID = ctx.ProgramElement.Where(a => a.ProgramID == prgID && a.IsDeleted==false).Select(b => b.ProgramElementID).ToList();
                                var projectID = ctx.Project.Where(a => progElementID.Contains(a.ProgramElementID) && a.IsDeleted == false).Select(b => b.ProjectID).ToList();
                                MatchedActivityList = ctx.Activity.Where(a => projectID.Contains(a.ProjectID) && a.IsDeleted==false && a.TrendNumber == TrendNumber).ToList();
                            }
                            else if (ProgramID != "null" && ProgramElementID != "null" && ProjectID == "null")
                            {
                                var prgElementID = Convert.ToInt16(ProgramElementID);
                                var projectID = ctx.Project.Where(a => a.ProgramElementID == prgElementID && a.IsDeleted==false).Select(b => b.ProjectID).ToList();
                                MatchedActivityList = ctx.Activity.Where(a => projectID.Contains(a.ProjectID) && a.TrendNumber == TrendNumber && a.IsDeleted==false).ToList();
                            }
                            else if (ProgramID != "null" && ProgramElementID != "null" && ProjectID != "null")
                            {
                                var prjID = Convert.ToInt16(ProjectID);
                                MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == prjID && a.TrendNumber == TrendNumber && a.IsDeleted==false).ToList();
                            }

                            //MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == aID && a.TrendNumber == TrendNumber).ToList();

                            if (TrendNumber == "1000")
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000").ToList();

                            MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);

                        }
                        else
                        if (ActivityID != "null")
                        {
                            var aID = Convert.ToInt16(ActivityID);
                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == id && a.TrendNumber == TrendNumber && a.ActivityID == aID && a.IsDeleted==false).ToList();
                            if (TrendNumber == "1000")
                            {
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000" && a.ActivityID == aID).ToList();
                                MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            }
                        }
                        else if (PhaseCode != "null")
                        {
                            var phaseCode = Convert.ToInt16(PhaseCode);
                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == id && a.TrendNumber == TrendNumber && a.PhaseCode == phaseCode && a.IsDeleted==false).ToList();
                            if (TrendNumber == "1000")
                            {
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000" && a.PhaseCode == phaseCode).ToList();
                                MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            }
                        }
                        else
                        {
                            MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == id && a.TrendNumber == TrendNumber && a.IsDeleted==false).ToList();
                            if (TrendNumber == "1000")
                            {
                                MatchedActivityList = MatchedActivityList.Where(a => a.TrendNumber == "1000").ToList();
                                MatchedActivityList = processCost(MatchedActivityList, TrendNumber, ProjectID, PhaseCode, BudgetCategory, BudgetSubCategory);
                            }
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
            finally
            {

                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return MatchedActivityList;

        }

        public static List<Activity> processCost(List<Activity> MatchedActivityList, string TrendNumber, String ProjectID, String PhaseCode, String BudgetCategory, String BudgetSubCategory )
        {
            List<Activity> result = new List<Activity>();

            for (int x = 0; x < MatchedActivityList.Count; x++)
            {
                List<CostFTE> FTECostList = new List<CostFTE>();
                List<CostLumpsum> LumpsumCostList = new List<CostLumpsum>();
                List<CostUnit> UnitCostList = new List<CostUnit>();
                List<CostODC> ODCCostList = new List<CostODC>();
                List<CostPercentage> PercentageBasisCostList = new List<CostPercentage>();
                FTECostList = WebAPI.Models.CostFTE.getCostFTE(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                LumpsumCostList = WebAPI.Models.CostLumpsum.getCostLumpsum(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                UnitCostList = WebAPI.Models.CostUnit.getCostUnit(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                ODCCostList = WebAPI.Models.CostODC.getCostODC(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);

                double totalFTEActual = 0, totalLumpsumActual = 0, totalUnitActual = 0, totalODCActual = 0;
                double totalFTEForecast = 0, totalLumpsumForecast = 0, totalUnitForecast = 0, totalODCForecast = 0;
                double totalFTEBudget = 0, totalLumpsumBudget = 0, totalUnitBudget = 0, totalODCBudget = 0;

                //FTE
                for (int y = 0; y < FTECostList.Count; y++)
                {
                    if (FTECostList[y].CostTrackTypeID == 3 || FTECostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = FTECostList[y].CostTrackTypes.Split(',');
                        var costAr = FTECostList[y].OriginalCost.Split(',');
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalFTEActual += Convert.ToDouble(costAr[z]);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalFTEForecast += Convert.ToDouble(costAr[z]);
                            }
                        }
                    }
                    //============================ Jignesh-ActivityTotalBudget-04-06-2021 ==========================================
                    //if (true)
                    //{
                    //    //string[] costs = FTECostList[y].FTECost.Split(','); // Jignesh-17-04-2021
                    //    string[] costs = FTECostList[y].OriginalCost.Split(','); // Jignesh-17-04-2021
                    //    double scale = double.Parse(FTECostList[y].RawFTEHourlyRate) / double.Parse(FTECostList[y].FTEHourlyRate);
                    //    foreach (string cost in costs)
                    //    {
                    //        if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                    //            //totalFTEBudget += double.Parse(cost) * scale; // Jignesh-17-04-2021
                    //            totalFTEBudget += double.Parse(cost); // Jignesh-17-04-2021
                    //    }
                    //}
                    //totalFTEBudget += double.Parse(fteHour) * 8 * rawFteHourlyRate; // Jignesh-17-04-2021
                    if (true)
                    {
                        string[] fteHours = FTECostList[y].FTEHours.Split(',');
                        double rawFteHourlyRate = Math.Round( double.Parse(FTECostList[y].RawFTEHourlyRate),2);
						double	totalFteHours = 0;
                        foreach (string fteHour in fteHours)
                        {
                            if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                                totalFteHours += double.Parse(fteHour) * 8 ; // Jignesh-17-04-2021
                        }
						totalFTEBudget += Math.Round(totalFteHours,2) * rawFteHourlyRate;
                    }
                    //============================ Jignesh-ActivityTotalBudget-04-06-2021 ==========================================
                }

                //Lumpsum
                for (int y = 0; y < LumpsumCostList.Count; y++)
                {
                    if (LumpsumCostList[y].CostTrackTypeID == 3 || LumpsumCostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = LumpsumCostList[y].CostTrackTypes.Split(',');
                        var costAr = LumpsumCostList[y].OriginalCost.Split(',');
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalLumpsumActual += Convert.ToDouble(costAr[z]);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalLumpsumForecast += Convert.ToDouble(costAr[z]);
                            }
                        }
                    }

                    if (true)
                    {
                        string[] costs = LumpsumCostList[y].OriginalCost.Split(',');
                        foreach (string cost in costs)
                        {
                            if (LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                                totalLumpsumBudget += float.Parse(cost);
                        }
                    }
                }

                //Unit
                for (int y = 0; y < UnitCostList.Count; y++)
                {
                    if (UnitCostList[y].CostTrackTypeID == 3 || UnitCostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = UnitCostList[y].CostTrackTypes.Split(',');
                        // var costAr = UnitCostList[y].OriginalCost.Split(',');
                        string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        float price = float.Parse(UnitCostList[y].RawUnitPrice);
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalUnitActual += Convert.ToDouble(float.Parse(costs[z]) * price);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalUnitForecast += Convert.ToDouble(float.Parse(costs[z]) * price);
                            }
                        }
                    }
                    //============================ Jignesh-ActivityTotalBudget-04-06-2021 ==========================================
                    //if (true)
                    //{
                    //    //string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                    //    //string[] costs = UnitCostList[y].OriginalCost.Split(',');
                    //    string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                    //    float price = float.Parse(UnitCostList[y].RawUnitPrice);
                    //    foreach (string cost in costs)
                    //    {
                    //        if (UnitCostList[y].CostTrackTypeID == 1 || UnitCostList[y].CostTrackTypeID == 2)
                    //            totalUnitBudget += Math.Round(float.Parse(cost), 2) * price;
                    //        //totalUnitBudget += float.Parse(cost) * price;
                    //    }
                    //}

                    if (true)
                    {
                        //string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        //string[] costs = UnitCostList[y].OriginalCost.Split(',');
                        double totalUnitQuantity = 0;
                        string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        float price = float.Parse(UnitCostList[y].RawUnitPrice);
                        foreach (string cost in costs)
                        {
                            if (UnitCostList[y].CostTrackTypeID == 1 || UnitCostList[y].CostTrackTypeID == 2)
                                totalUnitQuantity += float.Parse(cost);
                                //totalUnitBudget += Math.Round(float.Parse(cost)) * price;
                                //totalUnitBudget += float.Parse(cost) * price;
                        }
                        totalUnitBudget += Math.Round(Math.Round(totalUnitQuantity) * price, 2);
                    }
                    //============================ Jignesh-ActivityTotalBudget-04-06-2021 ==========================================
                }

                //ODC
                for (int y = 0; y < ODCCostList.Count; y++)
                {
                    if (ODCCostList[y].CostTrackTypeID == 3 || ODCCostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = ODCCostList[y].CostTrackTypes.Split(',');
                        var costAr = ODCCostList[y].OriginalCost.Split(',');
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalODCActual += Convert.ToDouble(costAr[z]);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalODCForecast += Convert.ToDouble(costAr[z]);
                            }
                        }
                    }

                    if (true)
                    {
                        string[] costs = ODCCostList[y].OriginalCost.Split(',');
                        foreach (string cost in costs)
                        {
                            if (ODCCostList[y].CostTrackTypeID == 1 || ODCCostList[y].CostTrackTypeID == 2)
                                totalODCBudget += float.Parse(cost);
                        }
                    }
                }

                MatchedActivityList[x].FTECostActual = totalFTEActual;
                MatchedActivityList[x].FTECostForecast = totalFTEForecast;
                MatchedActivityList[x].LumpsumCostActual = totalLumpsumActual;
                MatchedActivityList[x].LumpsumCostForecast = totalLumpsumForecast;
                MatchedActivityList[x].UnitCostActual = totalUnitActual;
                MatchedActivityList[x].UnitCostForecast = totalUnitForecast;
                MatchedActivityList[x].OdcCostActual = totalODCActual;
                MatchedActivityList[x].OdcCostForecast = totalODCForecast;

                MatchedActivityList[x].FTEBudget = totalFTEBudget;
                MatchedActivityList[x].LumpsumBudget = totalLumpsumBudget;
                MatchedActivityList[x].UnitBudget = totalUnitBudget;
                MatchedActivityList[x].OdcBudget = totalODCBudget;
            }

            result = MatchedActivityList;
            return result;
        }


        //----------------------------Manasi 10-11-2020------------------------------------------------------------------
        public static List<Activity> processCostForRollUp(List<Activity> MatchedActivityList, string TrendNumber, String ProjectID, String PhaseCode, String BudgetCategory, String BudgetSubCategory)
        {
            List<Activity> result = new List<Activity>();

            for (int x = 0; x < MatchedActivityList.Count; x++)
            {
                List<CostFTE> FTECostList = new List<CostFTE>();
                List<CostLumpsum> LumpsumCostList = new List<CostLumpsum>();
                List<CostUnit> UnitCostList = new List<CostUnit>();
                List<CostODC> ODCCostList = new List<CostODC>();
                List<CostPercentage> PercentageBasisCostList = new List<CostPercentage>();
                FTECostList = WebAPI.Models.CostFTE.getCostFTE(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                LumpsumCostList = WebAPI.Models.CostLumpsum.getCostLumpsum(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                UnitCostList = WebAPI.Models.CostUnit.getCostUnit(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);
                ODCCostList = WebAPI.Models.CostODC.getCostODC(MatchedActivityList[x].ActivityID.ToString(), "week", TrendNumber, ProjectID, PhaseCode, "", BudgetCategory, BudgetSubCategory);

                double totalFTEActual = 0, totalLumpsumActual = 0, totalUnitActual = 0, totalODCActual = 0;
                double totalFTEForecast = 0, totalLumpsumForecast = 0, totalUnitForecast = 0, totalODCForecast = 0;
                double totalFTEBudget = 0, totalLumpsumBudget = 0, totalUnitBudget = 0, totalODCBudget = 0;

                //FTE
                for (int y = 0; y < FTECostList.Count; y++)
                {
                    if (FTECostList[y].CostTrackTypeID == 3 || FTECostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = FTECostList[y].CostTrackTypes.Split(',');
                        var costAr = FTECostList[y].OriginalCost.Split(',');
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalFTEActual += Convert.ToDouble(costAr[z]);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalFTEForecast += Convert.ToDouble(costAr[z]);
                            }
                        }
                    }
                    //============================ Jignesh-ActivityTotalBudget-04-06-2021 ==========================================
                    //if (true)
                    //{
                    //    string[] costs = FTECostList[y].FTECost.Split(',');
                    //    double scale = float.Parse(FTECostList[y].RawFTEHourlyRate) / float.Parse(FTECostList[y].FTEHourlyRate);
                    //    foreach (string cost in costs)
                    //    {
                    //        if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                    //            totalFTEBudget += float.Parse(cost) * scale;
                    //    }
                    //}
                    if (true)
                    {
                        string[] fteHours = FTECostList[y].FTEHours.Split(',');
                        double rawFteHourlyRate = Math.Round(double.Parse(FTECostList[y].RawFTEHourlyRate), 2);
                        double totalFteHours = 0;
                        foreach (string fteHour in fteHours)
                        {
                            if (FTECostList[y].CostTrackTypeID == 1 || FTECostList[y].CostTrackTypeID == 2)
                                totalFteHours += double.Parse(fteHour) * 8; // Jignesh-17-04-2021
                        }
                        totalFTEBudget += Math.Round(totalFteHours, 2) * rawFteHourlyRate;
                    }
                    //============================ Jignesh-ActivityTotalBudget-04-06-2021 ==========================================
                }

                //Lumpsum
                for (int y = 0; y < LumpsumCostList.Count; y++)
                {
                    if (LumpsumCostList[y].CostTrackTypeID == 3 || LumpsumCostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = LumpsumCostList[y].CostTrackTypes.Split(',');
                        var costAr = LumpsumCostList[y].OriginalCost.Split(',');
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalLumpsumActual += Convert.ToDouble(costAr[z]);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalLumpsumForecast += Convert.ToDouble(costAr[z]);
                            }
                        }
                    }

                    if (true)
                    {
                        string[] costs = LumpsumCostList[y].OriginalCost.Split(',');
                        foreach (string cost in costs)
                        {
                            if (LumpsumCostList[y].CostTrackTypeID == 1 || LumpsumCostList[y].CostTrackTypeID == 2)
                                totalLumpsumBudget += float.Parse(cost);
                        }
                    }
                }

                //Unit
                for (int y = 0; y < UnitCostList.Count; y++)
                {
                    if (UnitCostList[y].CostTrackTypeID == 3 || UnitCostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = UnitCostList[y].CostTrackTypes.Split(',');
                        // var costAr = UnitCostList[y].OriginalCost.Split(',');
                        string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        float price = float.Parse(UnitCostList[y].RawUnitPrice);
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalUnitActual += Convert.ToDouble(float.Parse(costs[z]) * price);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalUnitForecast += Convert.ToDouble(float.Parse(costs[z]) * price);
                            }
                        }
                    }

                    //============================ Jignesh-ActivityTotalBudget-05-06-2021 ==========================================
                    //if (true)
                    //{
                    //    //string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                    //    //string[] costs = UnitCostList[y].OriginalCost.Split(',');
                    //    string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                    //    float price = float.Parse(UnitCostList[y].RawUnitPrice);
                    //    foreach (string cost in costs)
                    //    {
                    //        if (UnitCostList[y].CostTrackTypeID == 1 || UnitCostList[y].CostTrackTypeID == 2)
                    //            totalUnitBudget += Math.Round(float.Parse(cost), 2) * price;
                    //        //totalUnitBudget += float.Parse(cost) * price;
                    //    }
                    //}

                    if (true)
                    {
                        //string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        //string[] costs = UnitCostList[y].OriginalCost.Split(',');
                        double totalUnitQuantity = 0;
                        string[] costs = UnitCostList[y].UnitQuantity.Split(',');
                        float price = float.Parse(UnitCostList[y].RawUnitPrice);
                        foreach (string cost in costs)
                        {
                            if (UnitCostList[y].CostTrackTypeID == 1 || UnitCostList[y].CostTrackTypeID == 2)
                                totalUnitQuantity += float.Parse(cost);
                            //totalUnitBudget += Math.Round(float.Parse(cost)) * price;
                            //totalUnitBudget += float.Parse(cost) * price;
                        }
                        totalUnitBudget = Math.Round(totalUnitBudget + Math.Round(totalUnitQuantity) * price, 2);
                    }
                    //============================ Jignesh-ActivityTotalBudget-05-06-2021 ==========================================
                }

                //ODC
                for (int y = 0; y < ODCCostList.Count; y++)
                {
                    if (ODCCostList[y].CostTrackTypeID == 3 || ODCCostList[y].CostTrackTypeID == 4)
                    {
                        var costTrackTypeAr = ODCCostList[y].CostTrackTypes.Split(',');
                        var costAr = ODCCostList[y].OriginalCost.Split(',');
                        for (int z = 0; z < costTrackTypeAr.Length; z++)
                        {
                            if (costTrackTypeAr[z].Trim() == "3")
                            {
                                totalODCActual += Convert.ToDouble(costAr[z]);
                            }
                            else if (costTrackTypeAr[z].Trim() == "4")
                            {
                                totalODCForecast += Convert.ToDouble(costAr[z]);
                            }
                        }
                    }

                    if (true)
                    {
                        string[] costs = ODCCostList[y].OriginalCost.Split(',');
                        foreach (string cost in costs)
                        {
                            if (ODCCostList[y].CostTrackTypeID == 1 || ODCCostList[y].CostTrackTypeID == 2)
                                totalODCBudget += float.Parse(cost);
                        }
                    }
                }

                MatchedActivityList[x].FTECostActual = totalFTEActual;
                MatchedActivityList[x].FTECostForecast = totalFTEForecast;
                MatchedActivityList[x].LumpsumCostActual = totalLumpsumActual;
                MatchedActivityList[x].LumpsumCostForecast = totalLumpsumForecast;
                MatchedActivityList[x].UnitCostActual = totalUnitActual;
                MatchedActivityList[x].UnitCostForecast = totalUnitForecast;
                MatchedActivityList[x].OdcCostActual = totalODCActual;
                MatchedActivityList[x].OdcCostForecast = totalODCForecast;

                MatchedActivityList[x].FTEBudget = totalFTEBudget;
                MatchedActivityList[x].LumpsumBudget = totalLumpsumBudget;
                MatchedActivityList[x].UnitBudget = totalUnitBudget;
                MatchedActivityList[x].OdcBudget = totalODCBudget;
            }

            result = MatchedActivityList;
            return result;
        }
        //----------------------------------------------------------------------------------------------------------------------------------

        ////Cost Breakdowns
        public static List<Activity> getActivityBreakdowns(String ProgramID, String ProgramElementID, String ProjectID, String TrendNumber, String PhaseCode, String ActivityID, String BudgetCategory, String BudgetSubCategory)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            List<Activity> MatchedActivityList = new List<Activity>();
            try
            {
                var proID = Convert.ToInt16(ProjectID);
                using (var ctx = new CPPDbContext())
                {
                    MatchedActivityList = ctx.Activity.Where(a => a.ProjectID == proID && a.TrendNumber == TrendNumber && a.IsDeleted==false).ToList();
                    List<CostFTE> FTECosts = new List<CostFTE>();
                    List<CostLumpsum> LumpsumCosts = new List<CostLumpsum>();
                    List<CostUnit> UnitCosts = new List<CostUnit>();
                    List<CostPercentage> PercentageCosts = new List<CostPercentage>();
                    foreach (var activity in MatchedActivityList)
                    {
                        FTECosts = ctx.CostFte.Where(f => f.ActivityID == activity.ActivityID && f.IsDeleted==false).ToList();
                        LumpsumCosts = ctx.CostLumpsum.Where(l => l.ActivityID == activity.ActivityID && l.IsDeleted==false).ToList();
                        UnitCosts = ctx.CostUnit.Where(u => u.ActivityID == activity.ActivityID && u.IsDeleted==false).ToList();
                        PercentageCosts = ctx.CostPercentage.Where(p => p.ActivityID == activity.ActivityID).ToList();
                    }
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
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return MatchedActivityList;

        }
        public static ActivityCategory getActivityCategory(Activity activity)
        {

            ActivityCategory category = new ActivityCategory();
            using(var ctx = new CPPDbContext())
            {
                String activityPhase = ActivityCategory.getPhaseNameByCode(activity.PhaseCode.ToString());
                Project project = ctx.Project.Where(a => a.ProjectID == activity.ProjectID && a.IsDeleted==false).FirstOrDefault();
                int versionId = Convert.ToInt32(project.VersionId);
                int orgId = int.Parse(project.OrganizationID);
                category = ctx.ActivityCategory.Where(c => c.CategoryDescription == activity.BudgetCategory
                                                                    && c.SubCategoryDescription == activity.BudgetSubCategory
                                                                    //&& (c.Phase == activityPhase || c.Phase == "All")
                                                                    && c.OrganizationID == orgId  && c.VersionId == versionId).FirstOrDefault();
            }

            return category;

        }
        public static String registerActivity(Activity activity)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);

            String register_result = "";

            bool OKForRegister = false;
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    ////Check if Trend already exists in system
                    var retrievedActivity = new Activity();
                    retrievedActivity = ctx.Activity.Where(a => a.ActivityID == activity.ActivityID && a.IsDeleted==false).FirstOrDefault();

                    //luan here - Check if the activity already exists in older trends
                    Activity alreadyExistActivity = ctx.Activity.Where(a => a.ProjectID == activity.ProjectID
                                        && a.BudgetCategory == activity.BudgetCategory
                                        && a.BudgetSubCategory == activity.BudgetSubCategory
                                        && a.PhaseCode == activity.PhaseCode 
                                        && a.IsDeleted == false).FirstOrDefault();


                    if (retrievedActivity != null)
                    {
                        register_result += activity.BudgetCategory + " - " + activity.BudgetSubCategory + " for Trend " + activity.TrendNumber + " for Project" + activity.ProjectID + " already exists in system";
                    }
                    else
                    {

                        if(alreadyExistActivity != null)
                        {
                            activity.OriginalActivityStartDate = alreadyExistActivity.OriginalActivityStartDate;
                            activity.OriginalActivityEndDate = alreadyExistActivity.OriginalActivityEndDate;
                        }
            

                        var category = getActivityCategory(activity);

                        if (category != null)
                            activity.BudgetID = category.ID;
                        ctx.Activity.Add(activity);
                        ctx.SaveChanges();

                        Activity insertedActivity = ctx.Activity.Where(a => a.ProjectID == activity.ProjectID
                                                                && a.BudgetCategory == activity.BudgetCategory
                                                                && a.BudgetSubCategory == activity.BudgetSubCategory
                                                                && a.PhaseCode == activity.PhaseCode
                                                                && a.TrendNumber == activity.TrendNumber).FirstOrDefault();

                        register_result = "Success," + insertedActivity.ActivityID;
                    }
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
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            return register_result;
        }

        public static String updateActivity(Activity activity)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            String update_result = "";
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    Activity retrievedActivity = ctx.Activity.Where(a => a.ActivityID == activity.ActivityID && a.IsDeleted==false).FirstOrDefault();
                    if (retrievedActivity != null)
                    {
                        //update
                        
                        var category = getActivityCategory(activity);

                        if(activity.BudgetID != retrievedActivity.BudgetID  && activity.TrendNumber != "1000") //1000 - current trend's activity cannot be updated
                        {
                            //Update costlineitem on activity chagne
                            updateCostLineItemOnActivityChange(activity.ActivityID, category.CategoryID, category.SubCategoryID);
                        }

                        //Update activity
                        if (category != null)
                            activity.BudgetID = category.ID;

                        //

                        // retrievedActivity = activity;
                        //using (var dbCtx = new CPPDbContext())
                        //{
                        // CopyUtil.CopyFields<Activity>(activity, retrievedActivity);
                        retrievedActivity.ActivityCategory = activity.ActivityCategory;
                        retrievedActivity.BudgetCategory = activity.BudgetCategory; //Luan here 08192020
                        retrievedActivity.BudgetSubCategory = activity.BudgetSubCategory;
                        retrievedActivity.ActivityStartDate = activity.ActivityStartDate;
                        retrievedActivity.ActivityEndDate = activity.ActivityEndDate;
                        retrievedActivity.ActualActivityStartDate = activity.ActualActivityStartDate;
                        retrievedActivity.ActualActivityEndDate = activity.ActualActivityEndDate;
                        retrievedActivity.BudgetID = activity.BudgetID;
                        retrievedActivity.PercentageCompletion = activity.PercentageCompletion;
                            ctx.Entry(retrievedActivity).State = System.Data.Entity.EntityState.Modified;
                            ctx.SaveChanges();
                            update_result = "Success";
                        //}

                        if (retrievedActivity.TrendNumber != "1000")
                        {
                            MySqlConnection conn = null;
                            MySqlCommand command = null;

                            conn = ConnectionManager.getConnection();
                            conn.Open();
                            var query = "updateActivityCost"; //Stored Procedure
                            command = new MySqlCommand(query, conn);

                            command.Parameters.Add(new MySqlParameter("_ActivityID", activity.ActivityID));
                            command.Parameters.Add(new MySqlParameter("_TrendNumber", activity.TrendID));
                            command.Parameters.Add(new MySqlParameter("_ProjectID", activity.ProjectID));
                            command.Parameters.Add(new MySqlParameter("_Granularity", "week"));

                            command.CommandType = CommandType.StoredProcedure;
                            command.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        update_result += "Activity " + activity.ActivityID + " not found in system";
                    }
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
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            return update_result;
        }
        public static String updateTrend(int projectID, String trendNumber)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForDelete = false;
            try
            {
                conn = ConnectionManager.getConnection();
                conn.Open();

                //Check if activity exists in system
                String query = "Update trend set PostTrendCost = (Select (Sum(IFNULL(act.FTECost,0)) + Sum(IFNULL(act.LumpsumCost,0)) + Sum(IFNULL(act.UnitCost,0)))";
                query += " From activity act Where act.ProjectID = @projectID AND act.TrendNumber = @trendNumber)";

                query += " WHERE 1=1";
                query += " AND ProjectID =  @projectID AND TrendNumber = @trendNumber";
                MySqlCommand command = new MySqlCommand(query, conn);
                command.Parameters.AddWithValue("@projectID", projectID);
                command.Parameters.AddWithValue("@trendNumber", trendNumber);
                command.ExecuteNonQuery();

                update_result = "Success";


            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            return update_result;
        }
        //Entity Framework
        public static String deleteActivity(Activity activity)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);

            String delete_result = "";
            bool OKForDelete = false;
            try
            {

                using (var ctx = new CPPDbContext())
                {
                    Activity retrievedActivity = ctx.Activity.Where(a => a.ActivityID == activity.ActivityID && a.IsDeleted==false).FirstOrDefault();
                    Project project = ctx.Project.Where(a => a.ProjectID == retrievedActivity.ProjectID && a.IsDeleted==false).FirstOrDefault();
                    var projectClass = ctx.ServiceClass.Where(a => a.ID== project.ProjectClassID).FirstOrDefault();
                    ProgramElement programElement = ctx.ProgramElement.Include("ProjectClass").Where(a => a.ProgramElementID == project.ProgramElementID).FirstOrDefault();
                    ActivityCategory category = getActivityCategory(retrievedActivity);
                    var phaseCode = ctx.PhaseCode.Where(a => a.PhaseID == retrievedActivity.PhaseCode).FirstOrDefault();
                    if (retrievedActivity != null)
                    {
                        //Delete
                        List<CostFTE> fteCosts = new List<CostFTE>();
                        List<CostLumpsum> lumpsumCosts = new List<CostLumpsum>();
                        List<CostUnit> unitCosts = new List<CostUnit>();
                        List<CostODC> odcCosts = new List<CostODC>();
                        List<CostPercentage> percentageCosts = new List<CostPercentage>();

                        //Delete FTE
                        fteCosts = ctx.CostFte.Where(f => f.ActivityID == activity.ActivityID && f.IsDeleted==false).ToList();
                        foreach (var fte in fteCosts)
                        {
                            CostLineItemTracker.removeCostLine("F", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phaseCode.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID,
                                                             fte.FTEPositionID.ToString(), fte.EmployeeID.ToString(), null, null, null, null, null, fte.CostLineItemID);
                            //Nivedita 10022022
                            fte.IsDeleted = true;
                            fte.DeletedDate = DateTime.Now;
                            fte.DeletedBy = "";
                            //ctx.CostFte.Remove(fte);
                            ctx.SaveChanges();
                        }

                        //Delete Lumpsum
                        lumpsumCosts = ctx.CostLumpsum.Where(l => l.ActivityID == activity.ActivityID && l.IsDeleted==false).ToList();
                        foreach (var lump in lumpsumCosts)
                        {
                            CostLineItemTracker.removeCostLine("L", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phaseCode.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID,
                                                           null,null,lump.SubcontractorTypeID.ToString(),lump.SubcontractorID.ToString(),null,null,null, lump.CostLineItemID);
                            //Nivedita 10022022
                            lump.IsDeleted = true;
                            lump.DeletedDate = DateTime.Now;
                            lump.DeletedBy = "";
                            //ctx.CostLumpsum.Remove(lump);
                            ctx.SaveChanges();
                        }

                        //Delete Unit
                        unitCosts = ctx.CostUnit.Where(u => u.ActivityID == activity.ActivityID && u.IsDeleted==false).ToList();
                        foreach (var unit in unitCosts)
                        {
                            CostLineItemTracker.removeCostLine("U", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phaseCode.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID,
                                                           null,null,null,null,null,unit.MaterialCategoryID.ToString(),unit.MaterialID.ToString(),unit.CostLineItemID);
                            //Nivedita 10022022
                            unit.IsDeleted = true;
                            unit.DeletedDate = DateTime.Now;
                            unit.DeletedBy = "";
                            //ctx.CostUnit.Remove(unit);
                            ctx.SaveChanges();
                        }


                        //Delete ODC
                        odcCosts = ctx.CostODC.Where(a => a.ActivityID == activity.ActivityID && a.IsDeleted==false).ToList();
                        foreach(var cost in odcCosts)
                        {
                            CostLineItemTracker.removeCostLine("ODC", projectClass.Code.ToString(), project.ProjectNumber,project.ProjectElementNumber, phaseCode.ActivityPhaseCode.ToString(), category.CategoryID, category.SubCategoryID,
                                                           null, null, null,null, cost.ODCTypeID.ToString(), null, null, cost.CostLineItemID);
                            //Nivedita 10022022
                            cost.IsDeleted = true;
                            cost.DeletedDate = DateTime.Now;
                            cost.DeletedBy = "";
                            //ctx.CostODC.Remove(cost);
                            ctx.SaveChanges();
                        }

                        //Delete Percentage
                        //percentageCosts = ctx.CostPercentage.Where(p => p.ActivityID == activity.ActivityID).ToList();
                        //foreach (var perCost in percentageCosts)
                        //{
                        //    ctx.CostPercentage.Remove(perCost);
                        //    ctx.SaveChanges();
                        //}

                        //Delete Activity
                        //Nivedita 10022022
                        retrievedActivity.IsDeleted = true;
                        retrievedActivity.DeletedDate = DateTime.Now;
                        retrievedActivity.DeletedBy = "";
                        //ctx.Activity.Remove(retrievedActivity);
                        ctx.SaveChanges();
                        String s = updateTrend(Convert.ToInt16(activity.ProjectID), activity.TrendNumber);
                        delete_result = "Success";
                    }
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
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            return delete_result;
        }

        public static String updateTaskDate(Activity activity)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";

            bool OKForUpdate = false;

            try
            {

                using (var ctx = new CPPDbContext())
                {
                    //Trend activityTrend = new Trend();
                    //activityTrend = ctx.Trend.Where(t => t.ProjectID == activity.ProjectID && t.TrendNumber == activity.TrendNumber).FirstOrDefault();

                    Activity retrievedActivity = new Activity();
                    retrievedActivity = ctx.Activity.Where(a => a.ActivityID == activity.ActivityID && a.IsDeleted==false).FirstOrDefault();
                    if (retrievedActivity != null)
                    {
                        //Update
                        //retrievedActivity = activity;
                        //using (var dbCtx = new CPPDbContext())
                        //{
                        
                            var category = getActivityCategory(activity);
                            if (activity.BudgetID != retrievedActivity.BudgetID)
                            {
                                //Update costlineitem on activity chagne
                                updateCostLineItemOnActivityChange(activity.ActivityID, category.CategoryID, category.SubCategoryID);
                            }

                            if (category != null)
                                    activity.BudgetID = category.ID;


                            CopyUtil.CopyFields<Activity>(activity, retrievedActivity);
                             retrievedActivity.Trend = null;
                            ctx.Entry(retrievedActivity).State = System.Data.Entity.EntityState.Modified;
                            ctx.SaveChanges();
                            update_result = "Success";
                        //}
                    }
                    else
                    {
                        update_result += "Activity " + activity.ActivityID + " not found in system";
                    }
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
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            return update_result;
        }

        ////Get Activity Object by ID
        public static Activity getActivityByID(String ActivityID)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            Activity MatchedActivity = new Activity();
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    var id = Convert.ToInt16(ActivityID);
                    MatchedActivity = ctx.Activity.Where(a => a.ActivityID == id && a.IsDeleted==false && a.IsDeleted==false).FirstOrDefault();
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
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);
            return MatchedActivity;

        }

        public static void updateCostLineItemOnActivityChange(int ActivityID, String CategoryID, String SubCategoryID)
        {
            using (var ctx = new CPPDbContext())
            {
                try
                {

                    ctx.Database.ExecuteSqlCommand("call update_cost_line_item_on_activity_change(@CategoryID,@SubCategoryID, @ActivityID)",
                                                            new MySql.Data.MySqlClient.MySqlParameter("@CategoryID", CategoryID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@SubCategoryID", SubCategoryID),
                                                            new MySql.Data.MySqlClient.MySqlParameter("@ActivityID", ActivityID));
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
            }
        }

		//Get next main category id
		public static String nextCategoryID(int organizationID, int phaseID)
		{
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
			String nextCategoryID = "";

			try
			{
				using (var ctx = new CPPDbContext())
				{
					String phaseCode = ctx.PhaseCode.Where(u => u.PhaseID == phaseID).FirstOrDefault().Code;
                    // Jignesh-17-11-2021 - For next Category Id
                    nextCategoryID = ctx.ActivityCategory.Where(u => u.OrganizationID == organizationID).ToList().Max(u => u.CategoryID);
                    //nextCategoryID = ctx.ActivityCategory.Where(u => u.Phase == phaseCode && u.OrganizationID == organizationID).ToList().Max(u => u.CategoryID);

                    Boolean validNextCategoryID = false;

					while (!validNextCategoryID)
					{
						int nextCategoryIDNumber = Convert.ToInt16(nextCategoryID);
						nextCategoryIDNumber++;
						nextCategoryID = nextCategoryIDNumber.ToString();

						ActivityCategory category = new ActivityCategory();
						category = ctx.ActivityCategory.Where(u => u.Phase == phaseCode && u.CategoryID == nextCategoryID && u.OrganizationID == organizationID).FirstOrDefault();

						if(category != null)
						{
							validNextCategoryID = false;
						} else {
							validNextCategoryID = true;
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
			finally
			{
			}
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

			return nextCategoryID.PadLeft(4, '0');
		}

		//Get next sub category id
		public static String nextSubCategoryID(int organizationID, int phaseID, String categoryID)
		{
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
			String nextSubCategoryID = "";

			try
			{
				using (var ctx = new CPPDbContext())
				{
					String phaseCode = ctx.PhaseCode.Where(u => u.PhaseID == phaseID).FirstOrDefault().Code;
                    // Jignesh-17-11-2021 - For next Category Id
                    nextSubCategoryID = ctx.ActivityCategory.Where(u => u.CategoryID == categoryID && u.OrganizationID == organizationID).ToList().Max(u => u.SubCategoryID);
                    //nextSubCategoryID = ctx.ActivityCategory.Where(u => u.Phase == phaseCode && u.CategoryID == categoryID && u.OrganizationID == organizationID).ToList().Max(u => u.SubCategoryID);

                    Boolean validNextSubCategoryID = false;

					while (!validNextSubCategoryID)
					{
						int nextCategoryIDNumber = Convert.ToInt16(nextSubCategoryID);
						nextCategoryIDNumber++;
						nextSubCategoryID = nextCategoryIDNumber.ToString();

						ActivityCategory category = new ActivityCategory();
						category = ctx.ActivityCategory.Where(u => u.Phase == phaseCode && u.CategoryID == categoryID && u.SubCategoryID == nextSubCategoryID && u.OrganizationID == organizationID).FirstOrDefault();

						if (category != null)
						{
							validNextSubCategoryID = false;
						}
						else
						{
							validNextSubCategoryID = true;
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
			finally
			{
			}
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

			return nextSubCategoryID.PadLeft(4, '0');
		}
	}
    //Scale the cost - to week, month, and year
    public class Scaling
    {
        public static void scaling(int ActivityID, int lineID, String Granularity, String costType)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            try
            {
                String query = "";
                MySqlCommand command = null;
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();
                if (Granularity == "week")
                {
                    if (costType == "F")
                    {
                        query = "scale_cost_up_fte_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();


                    }
                    else if (costType == "L")
                    {
                        query = "scale_cost_up_lumpsum_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "U")
                    {
                        query = "scale_cost_up_unit_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "ODC")
                    {
                        query = "scale_cost_up_odc_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                }
                else if (Granularity == "month")
                {
                    if (costType == "F")
                    {
                        query = "scale_cost_down_fte_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));

                        command.ExecuteNonQuery();


                        //TEMPORARY SOLUTION
                        //          query = "scale_cost_up_fte_new"; //Stored Procedure
                        //command = new MySqlCommand(query, conn);
                        //command.CommandType = CommandType.StoredProcedure;
                        //command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        //command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        //command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));
                        //command.ExecuteNonQuery();


                        //command.Parameters.Clear();
                        query = "scale_cost_up_fte_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "L")
                    {
                        query = "scale_cost_down_lumpsum_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));

                        command.ExecuteNonQuery();
                        //command.Parameters.Clear();
                        query = "scale_cost_up_lumpsum_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "U")
                    {
                        query = "scale_cost_down_unit_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));

                        command.ExecuteNonQuery();
                        //command.Parameters.Clear();
                        query = "scale_cost_up_unit_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "ODC")
                    {
                        query = "scale_cost_down_odc_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));

                        command.ExecuteNonQuery();
                        //command.Parameters.Clear();
                        query = "scale_cost_up_odc_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        command.ExecuteNonQuery();
                    }
                }
                else if (Granularity == "year")
                {
                    if (costType == "F")
                    {
                        query = "scale_cost_down_fte_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();

                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));
                        command.ExecuteNonQuery();
                        command.Parameters.Clear();

                        //query = "scale_cost_up_fte_new"; //Stored Procedure
                        //command = new MySqlCommand(query, conn);
                        //command.CommandType = CommandType.StoredProcedure;
                        //command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        //command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "week"));
                        //command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        //command.ExecuteNonQuery();
                        //command.Parameters.Clear();

                        //query = "scale_cost_up_fte_new"; //Stored Procedure
                        //command = new MySqlCommand(query, conn);
                        //command.CommandType = CommandType.StoredProcedure;
                        //command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        //command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        //command.Parameters.Add(new MySqlParameter("_ToGranularity", "year"));
                        //command.ExecuteNonQuery();
                    }
                    else if (costType == "L")
                    {
                        query = "scale_cost_down_lumpsum_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();

                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "U")
                    {
                        query = "scale_cost_down_unit_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));
                        command.ExecuteNonQuery();
                    }
                    else if (costType == "ODC")
                    {
                        query = "scale_cost_down_odc_new"; //Stored Procedure
                        command = new MySqlCommand(query, conn);
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "month"));

                        command.ExecuteNonQuery();
                        command.Parameters.Clear();
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                        command.Parameters.Add(new MySqlParameter("_LineItemID", lineID));
                        //command.Parameters.Add(new MySqlParameter("_FromGranularity", "month"));
                        command.Parameters.Add(new MySqlParameter("_FromGranularity", "year"));
                        command.Parameters.Add(new MySqlParameter("_ToGranularity", "week"));
                        command.ExecuteNonQuery();
                    }
                }

            }
            catch (Exception ex)
            {

            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }

        }
    }


    //Update roll up cost for activity
    public class UpdateAcitivtyCost
    {
        String ProjectID { get; set; }
        String TrendNumber { get; set; }
        String ActivityID { get; set; }

        public static void updateActivityCost(String ProjectID, String TrendNumber, String ActivityID, String Granularity)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            MySqlCommand command = null;
            try
            {

                conn = ConnectionManager.getConnection();
                conn.Open();
                var query = "updateActivityCost"; //Stored Procedure
                command = new MySqlCommand(query, conn);
                command.CommandType = CommandType.StoredProcedure;

                //For delete

                command.Parameters.Add(new MySqlParameter("_ActivityID", ActivityID));
                command.Parameters.Add(new MySqlParameter("_TrendNumber", TrendNumber));
                command.Parameters.Add(new MySqlParameter("_ProjectID", ProjectID));
                command.Parameters.Add(new MySqlParameter("_Granularity", Granularity));
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
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
        }
    }

    //getCost - Using SQL Script to query different cost DATA.
    public class getCost
    {

        //Get lumpsum Cost By ID
        //    use sql query language to query a list of lumpsumcost, because modify the left-hand-side-variable of linq is not possible
        // lineItem    - The cost ID (eg => 122_3_0 then cost ID = 3)
        // granularity - week, month, or year
        // acitivtyID  - 
        // Return a List of LumpSumCost Object
        public static List<CostLumpsum> getLumpsumCostByCostID(int lineItem, string granularity, int activityID)
        {
            List<CostLumpsum> lumpsumCostList = new List<CostLumpsum>();
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
           
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    var query = "Select * from cost_lumpsum where ";
                    query += "(select substring_index(substring_index(LumpsumCostID,'_',2),'_',-1) as lineItem) = @lineItem";
                    query += " and granularity = @granularity";
                    query += " and ActivityID = @activityID and IsDeleted=false";

                    lumpsumCostList = ctx.CostLumpsum
                                        .SqlQuery(query,
                                                      new MySql.Data.MySqlClient.MySqlParameter("@lineItem", lineItem),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@granularity", granularity),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@activityID", activityID))
                                        .ToList();
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
          
            return lumpsumCostList;

        }


        //Get Unit Cost By ID
        //    use sql query language to query a list of lumpsumcost, because modify the left-hand-side-variable of linq is not possible
        // lineItem    - The cost ID (eg => 122_3_0 then cost ID = 3)
        // granularity - week, month, or year
        // acitivtyID  - 
        // Return a list UnitCost Object
        public static List<CostUnit> getUnitCostByCostID(int lineItem, string granularity, int activityID)
        {
            List<CostUnit> unitCostList = new List<CostUnit>();
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
           
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    var query = "Select * from cost_unitcost where ";
                    query += "(select substring_index(substring_index(UnitCostID,'_',2),'_',-1) as lineItem) = @lineItem";
                    query += " and granularity = @granularity";
                    query += " and ActivityID = @activityID and IsDeleted=false";

                    unitCostList = ctx.CostUnit
                                        .SqlQuery(query,
                                                      new MySql.Data.MySqlClient.MySqlParameter("@lineItem", lineItem),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@granularity", granularity),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@activityID", activityID))
                                        .ToList();
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
          
            return unitCostList;

        }

        public static List<CostODC> getODCCostByCostID(int lineItem, string granularity, int activityID)
        {
            List<CostODC> odcCostList = new List<CostODC>();
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);

            try
            {
              
                using (var ctx = new CPPDbContext())
                {
                    var query = "Select * from cost_odc where ";
                    query += "(select substring_index(substring_index(ODCCostID,'_',2),'_',-1) as lineItem) = @lineItem";
                    query += " and granularity = @granularity";
                    query += " and ActivityID = @activityID and IsDeleted=false";

                    odcCostList = ctx.CostODC
                                        .SqlQuery(query,
                                                      new MySql.Data.MySqlClient.MySqlParameter("@lineItem", lineItem),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@granularity", granularity),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@activityID", activityID))
                                        .ToList();
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            
            return odcCostList;

        }



        //Get FTE Cost By ID
        //    use sql query language to query a list of lumpsumcost, because modify the left-hand-side-variable of linq is not possible
        // lineItem    - The cost ID (eg => 122_3_0 then cost ID = 3)
        // granularity - week, month, or year
        // acitivtyID  - 
        // Return a list of FTE_COST object
        public static List<CostFTE> getFTECostByCostID(int lineItem, string granularity, int activityID)
        {
            List<CostFTE> fteCostList = new List<CostFTE>();
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
          
            try
            {
                using (var ctx = new CPPDbContext())
                {
                    var query = "Select * from cost_fte where ";
                    query += "(select substring_index(substring_index(FTECostID,'_',2),'_',-1) as lineItem) = @lineItem";
                    query += " and granularity = @granularity";
                    query += " and ActivityID = @activityID and IsDeleted=false";

                    fteCostList = ctx.CostFte
                                        .SqlQuery(query,
                                                      new MySql.Data.MySqlClient.MySqlParameter("@lineItem", lineItem),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@granularity", granularity),
                                                      new MySql.Data.MySqlClient.MySqlParameter("@activityID", activityID))
                                        .ToList();
                }
            }
            catch (Exception ex)
            {
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            
            return fteCostList;

        }
    }

    //Manasi 02-11-2020
    public class LineId
    {
        public int MaxLineID { get; set; }
    }

    
}