namespace TradeRiser.Core.Logging
{
    using System;
    using System.Diagnostics;

    /// <summary>
    /// Provides a log provider for the the windows event log.
    /// </summary>
    public class EventLogProvider : ILogProvider
    {
        #region properties

        /// <summary>
        /// Gets or sets the settings.
        /// </summary>
        /// <value>
        /// The settings.
        /// </value>
        public string Settings
        {
            get;
            set;
        }

        #endregion properties

        #region public methods

        public void BeginWriting()
        {
        }

        public void Dispose()
        {
        }

        public void EndWriting(bool success = true)
        {
        }

        public void WriteMessage(LogMessage message)
        {
            string source = string.Format("{0}.{1}", message.Component, message.Sender);
            string logMessage = message.Message.Length > 31839 ? message.Message.Substring(0, 31800) : message.Message;

            switch (message.MessageType)
            {
                case LogMessageType.Exception:
                    {
                        EventLog.WriteEntry(source, logMessage, EventLogEntryType.Error, 0, 0, null);
                        break;
                    }

                case LogMessageType.Warning:
                    {
                        EventLog.WriteEntry(source, logMessage, EventLogEntryType.Warning, 0, 0, null);
                        break;
                    }

                default:
                    {
                        EventLog.WriteEntry(source, logMessage, EventLogEntryType.Information, 0, 0, null);
                        break;
                    }
            }
        }

        #endregion public methods
    }
}
