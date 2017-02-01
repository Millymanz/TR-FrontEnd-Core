using System;
using System.Collections.Generic;
using System.Data;
using TradeRiser.Core.Common;
using TradeRiser.Core.Data;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Membership;


namespace TradeRiser.Core.SignOn
{
    public class UserSignOnDataAccess
    {
        /// <summary>
        /// The component
        /// </summary>
        private const string Component = "TradeRiser.Core.SignOn";

        /// <summary>
        /// The sender
        /// </summary>
        private const string Sender = "UserSignOnDataAccess";

        /// <summary>
        /// Gets the data access helper.
        /// </summary>
        public IDataAccess Database
        {
            get
            {
                return new DataAccess();
            }
        }

        /// <summary>
        /// Gets the user by user id.
        /// </summary>
        /// <param name="userId">The users id.</param>
        /// <returns></returns>
        public User GetUserByID(Guid userId)
        {
            DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersSelectByID");
            settings.Parameters.Add("@UserID", userId);

            return this.GetUser(settings);
        }

        /// <summary>
        /// Gets the name of the user by user.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns></returns>
        public User GetUserByUserName(string userName)
        {
            DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersSelectByUserName");
            settings.Parameters.Add("@UserName", userName);

            return this.GetUser(settings);
        }

        /// <summary>
        /// Gets the user by email.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns></returns>
        public User GetUserByEmail(string email)
        {
            DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersSelectByEmail");
            settings.Parameters.Add("@Email", email);

            return this.GetUser(settings);
        }

        /// <summary>
        /// Gets the user by username.
        /// </summary>
        /// <param name="settings"></param>
        private User GetUser(DataSettings settings)
        {
            User user = null;

            if (user == null)
            {
                using (IDataAccess data = this.Database)
                using(  DataResult result = data.ExecuteQuery(settings))
                {
                    if (result.Success)
                    {
                        if (result.Reader.Read())
                        {
                            user = new User();
                            user.UserID = result.Reader.Get<Guid>("UserID");
                            user.UserName = result.Reader.Get<string>("UserName");
                            user.Email = result.Reader.Get<string>("Email");
                            user.FirstName = result.Reader.Get<string>("FirstName");
                            user.LastName = result.Reader.Get<string>("LastName");
                            user.Phone1 = result.Reader.Get<string>("Phone1");
                            user.Phone2 = result.Reader.Get<string>("Phone2");
                            user.LanguageCode = result.Reader.Get<string>("Language");
                            user.TimeZone = result.Reader.Get<string>("TimeZone");
                            user.Locked = result.Reader.Get<bool>("Locked");
                            user.Disabled = result.Reader.Get<bool>("Disabled");
                            user.ChangePassword = result.Reader.Get<bool>("ChangePassword");
                            user.Password = result.Reader.Get<string>("Password");
                            user.LastPasswordReset = result.Reader.Get<DateTime>("LastPasswordReset");
                            user.CreatedDate = result.Reader.Get<DateTime>("CreateDate");
                            user.LastLogOnDate = result.Reader.Get<DateTime>("LastLoginDate");
                            user.LastLockDate = result.Reader.Get<DateTime>("LastLockDate");
                            user.InvalidLogOnAttempts = result.Reader.Get<short>("InvalidLogonAttempts");
                            user.HasPhoto = !result.Reader.IsNull("Photo");
                            user.BrandID = result.Reader.Get<Guid>("BrandID");
                            user.Deleted = result.Reader.Get("Deleted", false);
                          //user.PhysicalRepoRoot = result.Reader.Get("RepoRoot", string.Empty);
                          //  user.PhysicalWorkspaceRoot = result.Reader.Get("WorkspaceRoot", string.Empty);
                            user.EmployeeID = result.Reader.Get<string>("EmployeeID", null);
                            user.OutOfOffice = result.Reader.Get("OutOfOfficeFlg", false);
                            user.DelegateUserID = result.Reader.Get("DelegateUserID", Guid.Empty);
                            user.UserPreferences = result.Reader.Get<string>("UserPreferences", null);
                            user.LastUpdated = result.Reader.Get("LastUpdated", DateTime.MinValue);
                            user.UserType = result.Reader.Get<string>("UserType");
                            user.SendAlertsAsEmail = result.Reader.Get("SendAlertsAsEmail", false);
                            user.EscalationUserID = result.Reader.Get("EscalationUserID", Guid.Empty);
                            user.PrimaryLocationID = result.Reader.Get<string>("PrimaryLocationID");
                            user.Country = result.Reader.Get<string>("Country", null);
                            user.Broker = result.Reader.Get<string>("Broker", null);
                        }
                    }
                    else
                    {
                        Log.Exception("TradeRiser.Core.SignOn", "UserSignOnDataAccess.GetUser", result.Exception);
                    }
                }
            }

            return user;
        }

        public bool UserMustChangePassword(Guid userID, bool changePassword)
        {
            bool updated = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersForcePasswordChange");
                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID });
                settings.Parameters.Add(new DataParameter { ParameterName = "@ChangePasswordFlg", Value = changePassword });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "UserMustChangePassword"), result.Exception);
                    throw result.Exception;
                }

                updated = result.Success;
            }

            return updated;
        }

        /// <summary>
        /// Updates the user in case his attempt was succesful.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="timezone">The timezone of the user</param>
        /// <returns></returns>
        public bool UpdateUserSuccessfulLogin(Guid userID, string timezone)
        {
            bool updated = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UserSuccessfulLoginUpdate");

                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID, DbType = DbType.Guid });
                settings.Parameters.Add(new DataParameter { ParameterName = "@Timezone", Value = timezone, DbType = DbType.String });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "UpdateUserLastLoginSuccessful"), result.Exception);
                    throw result.Exception;
                }

                updated = result.Success;
            }

            return updated;
        }

        /// <summary>
        /// Updates the user in case he failed to login
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <returns></returns>
        public bool UpdateUserInvalidLoginAttempt(Guid userID)
        {
            bool updated = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UserInvalidLoginUpdate");

                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID, DbType = DbType.Guid });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "UpdateUserInvalidLoginAttempt"), result.Exception);
                    throw result.Exception;
                }

                updated = result.Success;
            }

            return updated;
        }

        /// <summary>
        /// Locks the user in case he exceeded the max number of invalid attempts.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        public bool UpdateUserLockAccount(Guid userID)
        {
            bool updated = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UserLockAccountUpdate");

                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID, DbType = DbType.Guid });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "UpdateUserLockAccount"), result.Exception);
                    throw result.Exception;
                }

                updated = result.Success;
            }

            return updated;
        }

        public bool UpdateUserLastLogin(Guid userID, bool locked, DateTime? lastLogin, DateTime? lastLocked, int invalidLoginAttempts)
        {
            bool updated = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersLastLoginUpdate");

                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID, DbType = DbType.Guid });
                settings.Parameters.Add(new DataParameter { ParameterName = "@Locked", Value = locked });

                if (lastLogin.HasValue)
                {
                    settings.Parameters.Add(new DataParameter { ParameterName = "@LastLoginDate", Value = lastLogin.Value, DbType = DbType.DateTime });
                }
                else
                {
                    settings.Parameters.Add(new DataParameter { ParameterName = "@LastLoginDate", Value = DBNull.Value });
                }

                if (lastLocked.HasValue)
                {
                    settings.Parameters.Add(new DataParameter { ParameterName = "@LastLockDate", Value = lastLocked.Value, DbType = DbType.DateTime });
                }
                else
                {
                    settings.Parameters.Add(new DataParameter { ParameterName = "@LastLockDate", Value = DBNull.Value });
                }

                settings.Parameters.Add(new DataParameter { ParameterName = "@InvalidLogonAttempts", Value = invalidLoginAttempts });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "UpdateUserLastLogin"), result.Exception);
                    throw result.Exception;
                }

                updated = result.Success;
            }

            return updated;
        }

        /// <summary>
        /// Resets the users password.
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="newPassword"></param>
        public bool ResetPassword(string userName, string newPassword)
        {
            bool passwordReset = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersPasswordReset");
                settings.Parameters.Add(new DataParameter { ParameterName = "@UserName", Value = userName });
                settings.Parameters.Add(new DataParameter { ParameterName = "@Password", Value = newPassword });

               
                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "ResetPassword"), result.Exception);
                    throw result.Exception;
                }
                               
                passwordReset = result.Success;
            }

            return passwordReset;
        }

        /// <summary>
        /// Inserts the password history.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="historyPassword">The history password.</param>
        public bool UpdatePassword(Guid userID, string newPassword, string historyPassword)
        {
            bool updated = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersPasswordUpdate");
                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID });
                settings.Parameters.Add(new DataParameter { ParameterName = "@Password", Value = newPassword });
                settings.Parameters.Add(new DataParameter { ParameterName = "@HistoryPassword", Value = historyPassword });

                // do not need to purge cache here as this is only called from ChangePassword() which deals with the cache
                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "UpdatePassword"), result.Exception);
                    throw result.Exception;
                }

                updated = result.Success;
            }

            return updated;
        }

        /// <summary>
        /// Gets the password history.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        public List<PasswordHistory> GetPasswordHistory(Guid userID)
        {
            List<PasswordHistory> historyList = new List<PasswordHistory>();

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.PasswordHistorySelect");
                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userID });

                DataResult result = data.ExecuteQuery(settings);

                if (result.Success)
                {
                    while (result.Reader.Read())
                    {
                        PasswordHistory history = new PasswordHistory();
                        history.CreatedDate = result.Reader.Get<DateTime>("CreateDate");
                        history.Password = result.Reader.Get<string>("Password");

                        historyList.Add(history);
                    }
                }
            }

            return historyList;
        }

        /// <summary>
        /// Passwords the policy.
        /// </summary>
        /// <param name="container">The container.</param>
        public List<PolicySetting<int>> GetPasswordPolicy(string container)
        {
            List<PolicySetting<int>> policy = new List<PolicySetting<int>>();

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.PolicySelect");
                settings.Parameters.Add(new DataParameter { ParameterName = "@Container", Value = container });

                DataResult result = data.ExecuteQuery(settings);

                if (result.Success)
                {
                    while (result.Reader.Read())
                    {
                        PolicySetting<int> setting = new PolicySetting<int>();
                        setting.Name = result.Reader.Get<string>("Name");
                        setting.Enabled = result.Reader.Get<bool>("Enabled");
                        setting.Value = result.Reader.Get<int>("Value");

                        policy.Add(setting);
                    }
                }
            }

            return policy;
        }

        /// <summary>
        /// Adds the password reset request.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="resetToken">The reset token.</param>
        /// <returns></returns>
        public bool AddPasswordResetRequest(Guid userId, Guid resetToken)
        {
            bool added = false;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UserPasswordResetInsert");
                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userId });
                settings.Parameters.Add(new DataParameter { ParameterName = "@ResetToken", Value = resetToken });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "AddPasswordResetRequest"), result.Exception);
                    throw result.Exception;
                }

                added = result.Success;
            }

            return added;
        }

        /// <summary>
        /// Gets the password reset request.
        /// </summary>
        /// <param name="resetToken">The reset token.</param>
        /// <returns></returns>
        public PasswordResetRequest GetPasswordResetRequest(Guid resetToken)
        {
            PasswordResetRequest request = null;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UserPasswordResetSelect");
                settings.Parameters.Add(new DataParameter { ParameterName = "@ResetToken", Value = resetToken });

                DataResult result = data.ExecuteQuery(settings);

                if (result.Success)
                {
                    while (result.Reader.Read())
                    {
                        request = new PasswordResetRequest();
                        request.UserID = result.Reader.Get<Guid>("UserID");
                        request.ResetToken = result.Reader.Get<Guid>("ResetToken");
                        request.RequestDateTime = result.Reader.Get<DateTime>("InsertedDateTime");
                        request.UserName = result.Reader.Get<string>("UserName");
                    }
                }
            }

            return request;
        }

        /// <summary>
        /// Gets the password reset request.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public void DeletePasswordResetRequest(Guid userId)
        {
            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UserPasswordResetDelete");
                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userId });

                DataResult result = data.ExecuteNonQuery(settings);

                if (!result.Success)
                {
                    Log.Exception(Component, string.Format("{0}.{1}", Sender, "DeletePasswordResetRequest"), result.Exception);
                    throw result.Exception;
                }
            }
        }
    }
}
