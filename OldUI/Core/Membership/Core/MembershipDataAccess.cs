using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Configuration;
using TradeRiser.Core.Data;
using TradeRiser.Core.Logging;


namespace TradeRiser.Core.Membership
{
    /// <summary>
    /// Data access for membership and roles.
    /// </summary>
    public class MembershipDataAccess //: IMembershipDataAccess
    {
        #region private fields

        /// <summary>
        /// The component.
        /// </summary>
        private const string Component = "TradeRiser.Core.Membership";

        /// <summary>
        /// The sender.
        /// </summary>
        private const string Sender = "MembershipDataAccess";

        #endregion private fields

        #region properties

        /// <summary>
        /// Gets the data access helper.
        /// </summary>
        public IDataAccess Database
        {
            get
            {
                return new DataAccess();
                // return Dependency.Get<IDataAccess>();
            }
        }

        #endregion properties

        #region public methods

        /// <summary>
        /// Creates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="userId">The user id.</param>
        public bool CreateUser(User user, out Guid userId)
        {
            userId = Guid.Empty;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersUpdate", string.Format("users,{0}", MembershipConstants.AdhocUserAppPermissionCacheContainer));
                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserName", Value = user.UserName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Email", Value = user.Email });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@FirstName", Value = user.FirstName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastName", Value = user.LastName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Phone1", Value = user.Phone1 });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Phone2", Value = user.Phone2 });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Language", Value = user.LanguageCode });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@TimeZone", Value = user.TimeZone });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Locked", Value = false });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Disabled", Value = false });

                settings.Parameters.Add(new DataParameter() { ParameterName = "@ChangePassword", Value = user.ChangePassword });
                user.CreatedDate = DateTime.UtcNow;
                user.LastPasswordReset = user.CreatedDate;
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Password", Value = user.Password });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastPasswordReset", Value = user.LastPasswordReset, DbType = DbType.DateTime });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@CreateDate", Value = user.CreatedDate, DbType = DbType.DateTime });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLoginDate", DbType = DbType.DateTime, Value = default(DateTime) });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLockDate", DbType = DbType.DateTime, Value = default(DateTime) });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@InvalidLogonAttempts", DbType = DbType.Int32, Value = 0 });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@BrandID", DbType = DbType.Guid, Value = user.BrandID });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@EmployeeID", Value = user.EmployeeID });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@outofofficeflg", Value = user.OutOfOffice });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@delegateuserid", DbType = DbType.Guid, Value = Guid.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserPreferences", Value = user.UserPreferences ?? string.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@usertype", Value = user.UserType });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@sendalertsasemail", Value = user.SendAlertsAsEmail });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@escalationuserid", DbType = DbType.Guid, Value = Guid.Empty });

                settings.Parameters.Add(new DataParameter() { ParameterName = "@PrimaryLocationID", Value = user.PrimaryLocationID ?? string.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Country", Value = user.Country ?? string.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Broker", Value = user.Broker ?? string.Empty });

                DataParameter userIdParameter = new DataParameter() { ParameterName = "@UserID", Value = user.UserID, DbType = DbType.Guid, Direction = ParameterDirection.InputOutput };

                settings.Parameters.Add(userIdParameter);

                DataResult result = data.ExecuteNonQuery(settings);
                if (!result.Success)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "CreateUser"), result.Exception);
                    throw result.Exception;
                }

                Guid.TryParse(userIdParameter.Value.ToString(), out userId);
            }

            return userId != Guid.Empty;
        }

        /// <summary>
        /// Deletes the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>
        /// True if user removed successfully.
        /// </returns>
        public bool DeleteUser(List<Guid> userIds)
        {
            bool hasRemoved = false;
            string userIdsParameter = string.Join(",", userIds);

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersDelete", "users");

                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserID", Value = userIdsParameter });

                DataResult result = data.ExecuteNonQuery(settings);
                hasRemoved = result.Success;
                if (!hasRemoved)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "DeleteUser"), result.Exception);
                    throw result.Exception;
                }
            }

            return hasRemoved;
        }

        /// <summary>
        /// Disables the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>
        /// True if user disabled successfully.
        /// </returns>
        public bool DisableUser(List<string> userIds)
        {
            bool hasDisabled = false;
            string userIdsParameter = string.Join(",", userIds);

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersDisable", "users");

                settings.Parameters.Add(new DataParameter { ParameterName = "@UserID", Value = userIdsParameter });

                DataResult result = data.ExecuteNonQuery(settings);
                hasDisabled = result.Success;
                if (!hasDisabled)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "DisableUser"), result.Exception);
                    throw result.Exception;
                }
            }

            return hasDisabled;
        }

        /// <summary>
        /// Enables the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>
        /// True if user enabled successfully.
        /// </returns>
        public bool EnableUser(List<string> userIds)
        {
            bool hasEnabled = false;
            string userIdsParameter = string.Join(",", userIds);

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersEnable", "users");

                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserID", Value = userIdsParameter });

                DataResult result = data.ExecuteNonQuery(settings);
                hasEnabled = result.Success;
                if (!hasEnabled)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "EnableUser"), result.Exception);
                    throw result.Exception;
                }
            }

            return hasEnabled;
        }





        /// <summary>
        /// Gets all users.
        /// </summary>
        public List<User> GetAllUsers()
        {
            List<User> users = null;

            using (IDataAccess data = this.Database)
            {
                users = data.Get<User>(new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersSelect", "users"));
            }

            return users;
        }






        /// <summary>
        /// Gets the password history.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        public List<PasswordHistory> GetPasswordHistory(Guid userID)
        {
            List<PasswordHistory> historyList = null;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.PasswordHistorySelect");
                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserID", Value = userID });

                historyList = data.Get<PasswordHistory>(settings);
            }

            return historyList;
        }

        /// <summary>
        /// Passwords the policy.
        /// </summary>
        /// <param name="container">The container.</param>
        public List<ConfigPolicySetting> GetPasswordPolicy(string container)
        {
            List<ConfigPolicySetting> policy = null;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.PolicySelect");
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Container", Value = container });

                policy = data.Get<ConfigPolicySetting>(settings);
            }

            return policy;
        }

        /// <summary>
        /// Inserts the password history.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="historyPassword">The history password.</param>
        public void UpdatePassword(Guid userID, string newPassword, string historyPassword)
        {
            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersPasswordUpdate", "users");
                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserID", Value = userID });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Password", Value = newPassword });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@HistoryPassword", Value = historyPassword });

                DataResult result = data.ExecuteNonQuery(settings);
                if (!result.Success)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "UpdatePassword"), result.Exception);
                    throw result.Exception;
                }
            }
        }

        /// <summary>
        /// Updates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="userId">The user id.</param>
        public bool UpdateUser(User user, out Guid userId)
        {
            userId = Guid.Empty;

            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersUpdate", string.Format("users,groups,{0}", MembershipConstants.AdhocUserAppPermissionCacheContainer));
                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserName", Value = user.UserName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Email", Value = user.Email });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@FirstName", Value = user.FirstName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastName", Value = user.LastName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Phone1", Value = user.Phone1 });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Phone2", Value = user.Phone2 });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Language", Value = user.LanguageCode });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@TimeZone", Value = user.TimeZone });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Locked", Value = user.Locked });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Disabled", Value = user.Disabled });

                settings.Parameters.Add(new DataParameter() { ParameterName = "@ChangePassword", Value = user.ChangePassword });
                user.CreatedDate = DateTime.UtcNow;
                user.LastPasswordReset = user.CreatedDate;
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Password", Value = user.Password });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastPasswordReset", Value = user.LastPasswordReset, DbType = DbType.DateTime });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@CreateDate", Value = user.CreatedDate, DbType = DbType.DateTime });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLoginDate", DbType = DbType.DateTime, Value = default(DateTime) });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLockDate", DbType = DbType.DateTime, Value = default(DateTime) });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@InvalidLogonAttempts", DbType = DbType.Int32, Value = 0 });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@BrandID", DbType = DbType.Guid, Value = user.BrandID });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@EmployeeID", Value = user.EmployeeID });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@outofofficeflg", Value = user.OutOfOffice });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@delegateuserid", DbType = DbType.Guid, Value = Guid.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserPreferences", Value = user.UserPreferences ?? string.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@usertype", Value = user.UserType });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@sendalertsasemail", Value = user.SendAlertsAsEmail });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@escalationuserid ", DbType = DbType.Guid, Value = Guid.Empty });

                settings.Parameters.Add(new DataParameter() { ParameterName = "@PrimaryLocationID", Value = user.PrimaryLocationID ?? string.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Country", Value = user.Country ?? string.Empty });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Broker", Value = user.Broker ?? string.Empty });

                DataParameter userIdParameter = new DataParameter() { ParameterName = "@UserID", Value = user.UserID, DbType = DbType.Guid, Direction = ParameterDirection.InputOutput };

                DataResult result = data.ExecuteNonQuery(settings);
                if (!result.Success)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "UpdateUser"), result.Exception);
                    throw result.Exception;
                }

                Guid.TryParse(userIdParameter.Value.ToString(), out userId);
            }

            return userId != Guid.Empty;
        }


        /// <summary>
        /// Updates the user's last login details.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="locked">If set to <c>true</c>, the user is locked.</param>
        /// <param name="lastLogin">The last login date time.</param>
        /// <param name="lastLocked">The last locked date time.</param>
        /// <param name="invalidLoginAttempts">The invalid login attempts.</param>
        public void UpdateUserLastLogin(Guid userID, bool locked, DateTime? lastLogin, DateTime? lastLocked, int invalidLoginAttempts)
        {
            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "membership.UsersLastLoginUpdate");

                settings.Parameters.Add(new DataParameter() { ParameterName = "@UserID", Value = userID, DbType = DbType.Guid });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Locked", Value = locked });

                if (lastLogin.HasValue)
                {
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLoginDate", Value = lastLogin.Value, DbType = DbType.DateTime });
                }
                else
                {
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLoginDate", Value = DBNull.Value, DbType = DbType.DateTime });
                }

                if (lastLocked.HasValue)
                {
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLockDate", Value = lastLocked.Value, DbType = DbType.DateTime });
                }
                else
                {
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@LastLockDate", Value = DBNull.Value, DbType = DbType.DateTime });
                }

                settings.Parameters.Add(new DataParameter() { ParameterName = "@InvalidLogonAttempts", Value = invalidLoginAttempts });

                DataResult result = data.ExecuteNonQuery(settings);
                if (!result.Success)
                {
                    Log.Exception(MembershipDataAccess.Component, string.Format("{0}.{1}", MembershipDataAccess.Sender, "UpdateUserLastLogin"), result.Exception);
                    throw result.Exception;
                }
            }
        }



        #endregion public methods

        #region private methods


        #endregion private methods
    }
}
