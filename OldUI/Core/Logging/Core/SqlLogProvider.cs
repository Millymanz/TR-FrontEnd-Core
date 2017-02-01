//namespace TradeRiser.Core.Logging
//{
//    using System;
//    using System.Diagnostics;
//    using System.Data.SqlClient;
//    using System.Text.RegularExpressions;
//    using Foundation.Configuration;
//    using TradeRiser.Core.Logging;

//    /// <summary>
//    /// Provides a log provider for the the sql server.
//    /// </summary>
//    public class SqlLogProvider : ILogProvider
//    {
//        #region private fields 

//        private SqlConnection connection = null;

//        private string connectionString = null;

//        private string providerSettings = null;

//        private int timeout = 30;

//        private const string TimeoutSetting = "Command Timeout";

//        private SqlTransaction transaction = null;

//        private bool transactional = false;

//        private const string TransactionalSetting = "Transactional";

//        private bool writingStarted = false;

//        #endregion private fields 

//        #region properties 

//        public string Settings
//        {
//            get
//            {
//                return this.providerSettings;
//            }
//            set
//            {
//                this.providerSettings = value;

//                this.GetSettings();
//            }
//        }

//        #endregion properties 

//        #region public methods 

//        public void BeginWriting()
//        {
//            this.Initialise();
//            this.writingStarted = true;
//        }

//        ~SqlLogProvider()
//        {
//            this.Dispose(false);
//        }

//        public void Dispose()
//        {
//            this.Dispose(true);
//            GC.SuppressFinalize(this);
//        }

//        protected virtual void Dispose(bool disposing)
//        {
//            if (disposing)
//            {
//                try
//                {
//                    if (this.transaction != null)
//                    {
//                        this.transaction.Dispose();
//                    }

//                    this.transaction = null;

//                    if (this.connection != null)
//                    {
//                        this.connection.Close();
//                        this.connection.Dispose();
//                    }

//                    this.connection = null;
//                }
//                catch
//                {
//                }
//            }
//        }

//        public void EndWriting(bool success = true)
//        {
//            if (this.transaction == null)
//            {
//                return;
//            }

//            if (success)
//            {
//                this.transaction.Commit();
//            }
//            else
//            {
//                this.transaction.Rollback();
//            }

//            this.Dispose();
//        }

//        public void WriteMessage(LogMessage message)
//        {
//            if (!this.writingStarted)
//            {
//                this.Initialise();
//            }

//            if (message == null)
//            {
//                throw new ArgumentNullException("message");
//            }

//            try
//            {
//                this.PersistMessage(message);
//            }
//            catch (SqlException)
//            {
//                if (!this.writingStarted)
//                {
//                    this.EndWriting(false);
//                }

//                throw;
//            }

//            if (!this.writingStarted)
//            {
//                this.EndWriting(true);
//            }
//        }

//        #endregion public methods 

//        #region private methods 

//        private string GetSetting(string settings, string name, string defaultValue = null)
//        {
//            if (string.IsNullOrEmpty(settings) || string.IsNullOrWhiteSpace(settings))
//            {
//                return defaultValue;
//            }

//            if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
//            {
//                return defaultValue;
//            }

//            foreach (string s in settings.Split(new char[] { ';' }))
//            {
//                if (s.StartsWith(name))
//                {
//                    return s.Split(new char[] { '=' })[1].Trim();
//                }
//            }

//            return defaultValue;
//        }

//        private void GetSettings()
//        {
//            string connectionName = this.providerSettings;

//            IConfigurationService service = null;

//            this.connectionString = service.GetConnectionString(connectionName);

//            this.timeout = int.Parse(this.GetSetting(this.providerSettings, TimeoutSetting, "30"));
//            this.transactional = bool.Parse(this.GetSetting(this.providerSettings, TransactionalSetting, "false"));
//            this.connectionString = this.StripItemsFromSettings(this.providerSettings, TimeoutSetting, TransactionalSetting);
//        }

//        private void Initialise()
//        {
//            if (this.connection == null || this.connection.State == System.Data.ConnectionState.Closed)
//            {
//                this.OpenConnection();
//            }

//            if (this.transactional)
//            {
//                this.transaction = this.connection.BeginTransaction();
//            }
//        }

//        private void OpenConnection()
//        {
//            if (this.connection == null)
//            {
//                this.connection = new SqlConnection();
//            }

//            this.connection.ConnectionString = this.connectionString;
//            this.connection.Open();
//        }

//        private void PersistMessage(LogMessage message)
//        {
//            using (SqlCommand cmd = new SqlCommand("traderiser.LogInsert", this.connection))
//            {
//                if (this.transaction != null)
//                {
//                    cmd.Transaction = this.transaction;
//                }

//                cmd.CommandType = System.Data.CommandType.StoredProcedure;
//                cmd.CommandTimeout = this.timeout;
//                cmd.Parameters.AddWithValue("@InsertDateTime", message.InsertDateTime);
//                cmd.Parameters.AddWithValue("@MachineName", message.MachineName);
//                cmd.Parameters.AddWithValue("@Component", message.Component);
//                cmd.Parameters.AddWithValue("@Sender", message.Sender);
//                cmd.Parameters.AddWithValue("@MessageType", (byte)message.MessageType);
//                cmd.Parameters.AddWithValue("@Message", message.Message);

//                if (message.UserID.HasValue)
//                {
//                    cmd.Parameters.AddWithValue("@UserID", message.UserID.Value);
//                }

//                if (message.DisplayKey.HasValue)
//                {
//                    cmd.Parameters.AddWithValue("@DisplayKey", message.DisplayKey.Value);
//                }

//                cmd.ExecuteNonQuery();
//            }
//        }

//        private string StripItemsFromSettings(string settings, params string[] items)
//        {
//            foreach (string item in items)
//            {
//                settings = Regex.Replace(settings, item + @"\s{0,}=\s{0,}[a-zA-Z0-9]{1,};{0,}", string.Empty);
//            }

//            return settings;
//        }

//        #endregion private methods 
//    }
//}
