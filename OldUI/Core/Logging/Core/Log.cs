namespace TradeRiser.Core.Logging
{
    using System;
    using System.Data;
    using System.Diagnostics;
    using System.Text;
    using Configuration;
    using Data;
    using Director;

    /// <summary>
    /// Exposes methods to log audit, debug, warnings and errors.
    /// </summary>
    public class Log
    {
        private const string DefaultEventLogSource = "TradeRiser Core Logging";

        /// <summary>
        /// Configuration Settings.
        /// </summary>
        private static LogConfigurationSection config;

        #region  Properties and Indexers

        /// <summary>
        /// Gets the config.
        /// </summary>
        /// <value>
        /// The config.
        /// </value>
        private static LogConfigurationSection Config
        {
            get
            {
                return Log.config ?? (Log.config = ConfigurationProvider.GetConfigurationSettings());
            }
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Sets the static log configuration section. This is for unit test DI only. Configuration Section is read from .config file at runtime.
        /// </summary>
        /// <param name="configurationSection">The configuration section.</param>
        public static void SetLogConfigurationSection(LogConfigurationSection configurationSection)
        {
            Log.config = configurationSection;
        }

        /// <summary>
        /// Logs an audits.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="director">The director.</param>
        public static void Audit(string component, string sender, string message, IDirector director)
        {
            string userName = null;
            string displayName = null;
            Guid userId = Guid.Empty;

            if (director.User != null)
            {
                userName = director.User.UserName;
                displayName = director.User.UserDisplayName;
                userId = director.User.UserID;
            }

            LogMessage logMessage = Log.Create(component, sender, message, userName, displayName, userId);
            logMessage.MessageType = LogMessageType.Audit;
            Log.LogMessage(logMessage);
        }

        /// <summary>
        /// Logs an audits.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        public static void Audit(string component, string sender, string message, string userName = null, string userDisplayName = null, Guid? userId = null)
        {
            LogMessage logMessage = Log.Create(component, sender, message, userName, userDisplayName, userId);
            logMessage.MessageType = LogMessageType.Audit;
            Log.LogMessage(logMessage);
        }

        /// <summary>
        /// Logs an audits.
        /// </summary>
        /// <param name="userKey">The user key.</param>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="exception">The exception.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        public static void Exception(Guid userKey, string component, string sender, Exception exception, string userName = null, string userDisplayName = null, Guid? userId = null)
        {
            LogMessage logMessage = Log.Create(component, sender, Log.ExceptionToString(exception), userName, userDisplayName, userId, userKey);
            logMessage.MessageType = LogMessageType.Exception;
            Log.LogMessage(logMessage);
        }

        /// <summary>
        /// Logs an Exception.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="exception">The exception.</param>
        /// <param name="director">The director.</param>
        public static void Exception(string component, string sender, Exception exception, IDirector director)
        {
            string userName = null;
            string displayName = null;
            Guid userId = Guid.Empty;

            if (director != null)
            {
                if (director.User != null)
                {
                    userName = director.User.UserName;
                    displayName = director.User.UserDisplayName;
                    userId = director.User.UserID;
                }
            }

            LogMessage logMessage = Log.Create(component, sender, Log.ExceptionToString(exception), userName, displayName, userId);
            logMessage.MessageType = LogMessageType.Exception;
            Log.LogMessage(logMessage);
        }

        /// <summary>
        /// Exceptions the specified domain.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="exception">The exception.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        public static void Exception(string component, string sender, Exception exception, string userName = null, string userDisplayName = null, Guid? userId = null)
        {
            Log.Exception(Guid.Empty, component, sender, exception, userName, userDisplayName, userId);
        }

        /// <summary>
        /// Writes to windows event log.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="primaryLogFault">The primary log fault.</param>
        public static void WriteToWindowsEventLog(LogMessage message, Exception primaryLogFault = null)
        {
            if (!Log.Config.UseWindowsEventLogAsBackup)
            {
                return;
            }

            try
            {
                EventLogEntryType logType;

                switch (message.MessageType)
                {
                    case LogMessageType.Audit:
                        logType = EventLogEntryType.Information;
                        break;
                    case LogMessageType.Warning:
                        logType = EventLogEntryType.Warning;
                        break;
                    case LogMessageType.Exception:
                        logType = EventLogEntryType.Error;
                        break;
                    default:
                        logType = EventLogEntryType.Information;
                        break;
                }

                string source = Log.DefaultEventLogSource;

                if (!string.IsNullOrEmpty(message.Component + message.Sender))
                {
                    source = string.Format("{0}.{1}", message.Component, message.Sender);
                }

                string logText = message.ToString();

                if (primaryLogFault != null)
                {
                    logText += "\n\nPLEASE NOTE: Primary logging failed. Reason:-\n\n" + Log.ExceptionToString(primaryLogFault);
                }

                EventLog.WriteEntry(source, logText, logType, 199, 1);
            }
            catch
            {
                // ignored
            }
        }

        /// <summary>
        /// Logs the full message to the data store.
        /// </summary>
        /// <param name="message">The full message.</param>
        public static void LogMessage(LogMessage message)
        {
            if (!Log.Config.EnableLogging)
            {
                return;
            }

            DataSettings settings = new DataSettings(Log.Config.LogProviderSettings, "[traderiser].[LogInsert]");
            settings.Parameters.Add("@InsertDateTime", message.InsertDateTime);
            settings.Parameters.Add("@MachineName", message.MachineName);
            settings.Parameters.Add("@Component", message.Component);
            settings.Parameters.Add("@Sender", message.Sender);
            settings.Parameters.Add("@MessageType", (byte)message.MessageType);
            settings.Parameters.Add("@Message", message.Message);

            if (message.UserID.HasValue)
            {
                settings.Parameters.Add("@UserID", message.UserID.Value, DbType.Guid);
            }

            if (message.DisplayKey.HasValue)
            {
                settings.Parameters.Add("@DisplayKey", message.DisplayKey.Value, DbType.Guid);
            }

            using (IDataAccess data  = new DataAccess())
            {
                DataResult result = data.ExecuteNonQuery(settings);

                if (result.Success) return;

                Log.WriteToWindowsEventLog(message, result.Exception);
            }
        }

        /// <summary>
        /// Logs a warning.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="director">The director.</param>
        public static void Warning(string component, string sender, string message, IDirector director)
        {

            string userName = null;
            string displayName = null;
            Guid userId = Guid.Empty;

            if (director.User != null)
            {
                userName = director.User.UserName;
                displayName = director.User.UserDisplayName;
                userId = director.User.UserID;
            }

            Log.Warning(Guid.Empty, component, sender, message, userName, displayName, userId);
        }

        /// <summary>
        /// Logs a warning.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        public static void Warning(string component, string sender, string message, string userName = null, string userDisplayName = null, Guid? userId = null)
        {
            Log.Warning(Guid.Empty, component, sender, message, userName, userDisplayName, userId);
        }

        /// <summary>
        /// Logs a warning.
        /// </summary>
        /// <param name="userKey">The user key.</param>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        public static void Warning(Guid userKey, string component, string sender, string message, string userName = null, string userDisplayName = null, Guid? userId = null)
        {
            LogMessage logMessage = Log.Create(component, sender, message, userName, userDisplayName, userId, userKey);
            logMessage.MessageType = LogMessageType.Warning;
            Log.LogMessage(logMessage);
        }

        /// <summary>
        /// Logs a debug message.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        public static void Debug(string component, string sender, string message, string userName = null, string userDisplayName = null, Guid? userId = null)
        {
#if DEBUG
            LogMessage logMessage = Log.Create(component, sender, message, userName, userDisplayName, userId, Guid.Empty);
            logMessage.MessageType = LogMessageType.Debug;
            Log.LogMessage(logMessage);
#endif
        }

        #endregion

        #region  Private Methods

        /// <summary>
        /// Creates a new log message.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user ID.</param>
        /// <param name="userKey">The user key.</param>
        private static LogMessage Create(string component, string sender, string message, string userName = null, string userDisplayName = null, Guid? userId = null, Guid? userKey = null)
        {
            LogMessage logMessage = new LogMessage
            {
                InsertDateTime = DateTime.UtcNow,
                MachineName = Environment.MachineName,
                Component = component,
                Sender = sender,
                Message = message,
                UserName = string.IsNullOrEmpty(userName) ? string.Empty : userName,
                UserDisplayName = string.IsNullOrEmpty(userDisplayName) ? string.Empty : userDisplayName,
                UserID = userId,
                DisplayKey = userKey == Guid.Empty ? null : userKey
            };


            return logMessage;
        }

        /// <summary>
        /// Returns the full exception details as a string.
        /// </summary>
        /// <param name="exception">The exception.</param>
        private static string ExceptionToString(Exception exception)
        {
            StringBuilder sb = new StringBuilder();
            while (exception != null)
            {
                sb.Append(exception);
                sb.Append(Environment.NewLine);
                sb.Append(Environment.NewLine);

                exception = exception.InnerException;
            }

            return sb.ToString();
        }

        /// <summary>
        /// Writes to windows event log.
        /// </summary>
        /// <param name="e">The exception.</param>
        private static void WriteToWindowsEventLog(Exception e)
        {
            if (!Log.Config.UseWindowsEventLogAsBackup)
            {
                return;
            }
            try
            {
                EventLog.WriteEntry(Log.DefaultEventLogSource, e.ToString(), EventLogEntryType.Error, 199, 1);
            }
            catch
            {
                // ignored
            }
        }

        #endregion
    }
}
