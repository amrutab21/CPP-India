﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web;

namespace WebAPI.Models
{
    [Table("contract_modification")]
    public class ContractModification
    {
        public int Id { get; set; }
        public string ModificationNo { get; set; } //Jignesh-ModificationPopUpChanges
		public string Title { get; set; }
        public string Reason { get; set; }
		public string Description { get; set; } //Jignesh-ModificationPopUpChanges
		public DateTime Date { get; set; }
		public int ModificationType { get; set; }
		public string Value { get; set; } //Jignesh-ModificationPopUpChanges
		public DateTime? DurationDate { get; set; } //Jignesh-ModificationPopUpChanges
		public int ProgramID { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
		public int ScheduleImpact { get; set; }

		public static void SaveModificationData(ContractModification contractModification)
		{

			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
			List<ContractModification> contractModificationsList = new List<ContractModification>();
			try
			{
				using (var ctx = new CPPDbContext())
				{
					var modificationNumber = from cm in ctx.ContractModification
											 orderby cm.ModificationNo descending //Jignesh-ModificationPopUpChanges
											 where cm.ProgramID == contractModification.ProgramID
										     select cm.ModificationNo;

					var ProjectCreatedBy = from pr in ctx.Program
										   where pr.ProgramID == contractModification.ProgramID
										   select pr.CreatedBy;
					var modNum = modificationNumber.FirstOrDefault();
					if (modNum != null)
					{
						contractModification.ModificationNo = Convert.ToString(Convert.ToInt32(modNum) + 1);
					}
					else {
						contractModification.ModificationNo = "1";
					}
                    if (contractModification.Value == "" || contractModification.Value == null)
                    {
						contractModification.Value = Convert.ToString(0);
                    }
					//contractModification.Value = Convert.ToDecimal(contractModification.Value);
					contractModification.CreatedBy = ProjectCreatedBy.FirstOrDefault();
					contractModification.CreatedDate = DateTime.Now;
					ctx.ContractModification.Add(contractModification);
					ctx.SaveChanges();

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
		}

		public static List<ContractModification> GetContractModificationList(int programId)
		{
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
			Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
			List<ContractModification> contractModificationsList = new List<ContractModification>();
			List<Program> programList = new List<Program>();
			try
			{
				using (var ctx = new CPPDbContext())
				{
					contractModificationsList = ctx.ContractModification.Where(u => u.ProgramID == programId).OrderByDescending(u => u.ModificationNo).ToList();
				//	programList = ctx.Program.Where(s => s.ProgramID == programId).ToList();

				//List<ContractModification> contractModList = new List<ContractModification>();
				//	foreach (var plist in programList)
				//	{

				//		//var cvalue = plist.ContractValue.Substring(1);
				//		var cvalue = plist.ContractValue.Trim('$');

				//		contractModList.Add(new ContractModification() { ModificationNo = "0", Title = "Original Contract Value", ModificationType = 0, Value = cvalue.ToString(), ScheduleImpact = 0, Date = plist.CurrentStartDate??DateTime.Now});
				//	};

				//	contractModificationsList.AddRange(contractModList);


					return contractModificationsList;

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
			return contractModificationsList;
		}

	}
}