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
using WebAPI.Helper;
using Newtonsoft.Json;

namespace WebAPI.Models
{
    public class UserRole
    {
        readonly static log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public int Operation;
        public String Role;
        public String AccessControlList;
        public String DT_RowId;
        UserRole(String role, String acl)
        { DT_RowId = role; Role = role; AccessControlList = acl;}
        public UserRole() { }

        //From RequestLookupRoleController
        public static List<UserRole> getRole(String Role)
        {
            String guid = Guid.NewGuid().ToString();
            List<UserRole> MatchedRoleList = new List<UserRole>();
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            try
            {
                logger.Debug(string.Format("Getting UserRoles for role {0}",
                                             JsonConvert.SerializeObject(new
                                             {
                                                 SessionID = guid,
                                                 RequestedUser = UserUtil.getCurrentUserName(),
                                                 data = Role
                                             })));
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();
                
                String query = "SELECT * FROM user_roles";
                query += " WHERE 1=1";
                if (Role != "null")
                    query += " AND Role like '%" + Role + "%'";
                query += " order by Role";

                logger.Debug(string.Format(query + "{0}",
                                 JsonConvert.SerializeObject(new
                                 {
                                     SessionID = guid,
                                     RequestedUser = UserUtil.getCurrentUserName(),
                                     data = Role
                                 })));

                MySqlCommand command = new MySqlCommand(query, conn);
                using (reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        UserRole RetreivedRole = new UserRole();
                        RetreivedRole.Role = reader.GetValue(0).ToString().Trim();
                        Object[] values = new Object[reader.FieldCount];
                        int fieldCount = reader.GetValues(values);
                        RetreivedRole.AccessControlList = null;
                        for (int i = 1; i < fieldCount; i++)
                            RetreivedRole.AccessControlList += reader.GetValue(i).ToString().Trim();

                        MatchedRoleList.Add(RetreivedRole);
                    }

                    logger.Debug(string.Format("Retreived UserRoles {0}",
                                                    JsonConvert.SerializeObject(new
                                                    {
                                                        SessionID = guid,
                                                        RequestedUser = UserUtil.getCurrentUserName(),
                                                        data = MatchedRoleList
                                                    })));
                }



            }
            catch (Exception ex)
            {
                logger.Error(string.Format("Unable to retrieve UserRoles for role {0},",
                                                       JsonConvert.SerializeObject(new
                                                       {
                                                           SessionID = guid,
                                                           RequestedUser = UserUtil.getCurrentUserName(),
                                                           data = Role
                                                       })));

                logger.Error(ex.ToString());
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
                
            }
            return MatchedRoleList;

        }


        public static String registerRole(String Role, String AccessControlList)
        {

            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String register_result = "";
            bool OKForRegister = false;
            String guid = Guid.NewGuid().ToString();
            try
            {
                logger.Debug("Creatig new UserRole");
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();

                //Check if PhaseCode already exists in system
                String query = "SELECT Role from user_roles";
                query += " WHERE 1=1";
                query += " AND Role = '" + Role + "'";
                MySqlCommand command = new MySqlCommand(query, conn);
                logger.Debug(string.Format("Check if role already exist \n {0}", Role));

                using (reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        reader.Read();
                        if (reader.GetValue(0).ToString().Trim() == Role)
                        {
                            register_result += Role + " failed to be created, it already exist.\n";
                            logger.Info(string.Format("Role already exists in the system  {0}",
                                                  JsonConvert.SerializeObject(new
                                                  {
                                                      RequestedUser = UserUtil.getCurrentUserName(),
                                                      data = Role
                                                  })));
                        }
                    }
                    else
                        OKForRegister = true;
                }

                //PhaseCode does not already exist in system. Insert new PhaseCode row in 'phase_lookup' table
                if (OKForRegister)
                {
                    //write to DB
                    query = "INSERT INTO user_roles VALUES";
                    query += " (";
                    query += "'" + Role + "'";
                    for (int i = 0; i < AccessControlList.Length; i++)
                        query += " ," + AccessControlList[i];
                    query += ")";

                    logger.Debug(string.Format("Query to insert new role \n {0}", query));

                    command = new MySqlCommand(query, conn);
                    command.ExecuteNonQuery();

                    register_result += Role + " has been created successfully.\n";
                    logger.Info(string.Format("New UserRole Created {0}",
                                 JsonConvert.SerializeObject(new
                                 {
                                     RequestedUser = UserUtil.getCurrentUserName(),
                                     Role = Role,
                                     data = AccessControlList
                                 })));
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex.ToString());
                logger.Error(string.Format("Unable to create new UserRole {0}",
                              JsonConvert.SerializeObject(new
                              {
                                  RequestedUser = UserUtil.getCurrentUserName(),
                                  Role = Role,
                                  data = AccessControlList
                              })));
                register_result = string.Format("Unable to create UserRole {0}", Role);
            }
            finally
            {
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }


            return register_result;
        }

        public static String updateRole(String Role, String AccessControlList)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String update_result = "";
            bool OKForUpdate = false;
            try
            {
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();

                //Check if program exists in system
                String query = "SELECT Role from user_roles";
                query += " WHERE 1=1";
                query += " AND Role = '" + Role + "'";
                MySqlCommand command = new MySqlCommand(query, conn);
                using (reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        reader.Read();

                        if (reader.GetValue(0).ToString().Trim() == Role)
                            OKForUpdate = true;

                    }
                    else
                        update_result += Role + " failed to be updated, it does not exist.\n";
                }

                //Update the Program
                if (OKForUpdate)
                {
                    //Delete role first
                    //String result = deleteRole(Role);
                    conn = ConnectionManager.getConnection();
                    conn.Open();
                    query = "UPDATE user_roles Set";
                    //query += " Role = " + Role + ",";
                    query += " ViewProgram = " + AccessControlList[0] + ",";
                    query += " ModifyProgram = " + AccessControlList[1] + ",";
                    query += " ViewProgramElement = " + AccessControlList[2] + ",";

                    query += " ModifyProgramElement = " + AccessControlList[3] + ",";
                    query += " ViewProject = " + AccessControlList[4] + ",";
                    query += " ModifyProject = " + AccessControlList[5] + ",";

                    query += " ViewTrend = " + AccessControlList[6] + ",";
                    query += " ModifyTrend = " + AccessControlList[7] + ",";
                    query += " ViewActivity = " + AccessControlList[8] + ",";

                    query += " ModifyActivity = " + AccessControlList[9] + ",";
                    query += " MemberManagement = " + AccessControlList[10] + ",";
                    query += " RoleManagement = " + AccessControlList[11] + ",";

                    query += " LookupsManagement = " + AccessControlList[12] + ",";
                    query += " ViewReports = " + AccessControlList[13] + ",";
                    query += " ViewCharts = " + AccessControlList[14] + ",";
                    query += " ViewLabor = " + AccessControlList[15];
                    query += " where role = '" + Role + "'";
                    command = new MySqlCommand(query, conn);
                    command.ExecuteNonQuery();

                    update_result += Role + " has been updated successfully.\n";
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

            return update_result;
        }

        public static String deleteRole(String Role)
        {
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Entry Point", Logger.logLevel.Info);
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "", Logger.logLevel.Debug);
            MySqlConnection conn = null;
            MySqlDataReader reader = null;
            String delete_result = "";
            bool OKForDelete = false;
            bool isCaughtException = true;
            try
            {
                // create and open a connection object
                conn = ConnectionManager.getConnection();
                conn.Open();

                //Check if program exists in system
                String query = "SELECT Role from user_roles";
                query += " WHERE 1=1";
                query += " AND Role = '" + Role + "'";
                MySqlCommand command = new MySqlCommand(query, conn);
                using (reader = command.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        reader.Read();

                        if (reader.GetValue(0).ToString().Trim() == Role)
                            OKForDelete = true;

                    }
                    else
                        delete_result += Role + " failed to be deleted, it does not exist.\n";
                    isCaughtException = false;
                }

                //Delete the Program
                if (OKForDelete)
                {
                    //write to DB
                    query = "DELETE FROM user_roles";
                    query += " WHERE";
                    query += " Role = '" + Role + "'";
                    command = new MySqlCommand(query, conn);
                    command.ExecuteNonQuery();
                    delete_result += Role + " has been deleted successfully.\n";
                    isCaughtException = false;
                }

            }
            catch (Exception ex)
            {
                isCaughtException = true;
                var stackTrace = new StackTrace(ex, true);
                var line = stackTrace.GetFrame(0).GetFileLineNumber();
                Logger.LogExceptions(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, ex.Message, line.ToString(), Logger.logLevel.Exception);
            }
            finally
            {
                if(isCaughtException)
                {
                    delete_result += Role + " failed to be deleted due to dependencies.\n";
                }
                if (conn != null) conn.Close();
                if (reader != null) reader.Close();
            }
            Logger.LogDebug(MethodBase.GetCurrentMethod().DeclaringType.ToString(), MethodBase.GetCurrentMethod().Name, "Exit Point", Logger.logLevel.Debug);

            return delete_result;
        }
    
    }
}