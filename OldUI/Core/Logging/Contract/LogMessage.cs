namespace TradeRiser.Core.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// A log message to log audits, warnings and errors.
    /// </summary>
    [Serializable]
    public class LogMessage
    {
        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="LogMessage"/> class.
        /// </summary>
        public LogMessage()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="LogMessage"/> class.
        /// </summary>
        /// <param name="component">The component.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="message">The message.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="userDisplayName">Display name of the user.</param>
        /// <param name="userId">The user id.</param>
        public LogMessage(string component, string sender, string message, string userName, string userDisplayName, Guid? userId)
        {
            this.Component = component.ToUpper();
            this.Sender = sender;
            this.InsertDateTime = DateTime.UtcNow;
            this.MachineName = Environment.MachineName;
            this.Message = message;
            this.UserName = string.IsNullOrEmpty(userName) ? string.Empty : userName;
            this.UserDisplayName = string.IsNullOrEmpty(userDisplayName) ? string.Empty : userDisplayName;
            this.UserID = userId;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>The username.</value>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the display name of the user.
        /// </summary>
        /// <value>The display name of the user.</value>
        public string UserDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the inserted date time.
        /// </summary>
        /// <value>The inserted date time.</value>
        public DateTime InsertDateTime { get; set; }

        /// <summary>
        /// Gets or sets the name of the machine raising the error.
        /// </summary>
        /// <value>The name of the machine.</value>
        public string MachineName { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>The message.</value>
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the type of the message.
        /// </summary>
        /// <value>The type of the message.</value>
        public LogMessageType MessageType { get; set; }

        /// <summary>
        /// Gets or sets the component.
        /// </summary>
        /// <value>The sender.</value>
        public string Component { get; set; }

        /// <summary>
        /// Gets or sets the sender.
        /// </summary>
        /// <value>The sender.</value>
        public string Sender { get; set; }

        /// <summary>
        /// Gets or sets the key presented to the user to look up this error on later.
        /// </summary>
        /// <value>The user key.</value>
        public Guid? DisplayKey { get; set; }

        /// <summary>
        /// Gets or sets the ID of the current user.
        /// </summary>
        /// <value>The user ID.</value>
        public Guid? UserID { get; set; }

        /// <summary>
        /// Returns a <see cref="System.String"/> that represents this instance.
        /// </summary>
        /// <returns>
        /// A <see cref="System.String"/> that represents this instance.
        /// </returns>
        public override string ToString()
        {
            StringBuilder log = new StringBuilder();

            switch (this.MessageType)
            {
                case LogMessageType.Audit:
                    log.AppendLine("TradeRiser Core has registered an audit message.");
                    break;
                case LogMessageType.Warning:
                    log.AppendLine("TradeRiser Core has registered a warning message.");
                    break;
                case LogMessageType.Exception:
                    log.AppendLine("TradeRiser Core has raised an exception.");
                    break;
                case LogMessageType.Debug:
                    log.AppendLine("TradeRiser Core has raised a debug message.");
                    break;
                default:
                    log.AppendLine("TradeRiser Core has registered a message.");
                    break;
            }

            log.AppendLine(Environment.NewLine);

            if (!string.IsNullOrEmpty(this.UserName))
            {
                log.AppendLine(Environment.NewLine);
                log.AppendFormat("User Name : {0}", this.UserName);
            }

            if (!string.IsNullOrEmpty(this.UserDisplayName))
            {
                log.AppendLine(Environment.NewLine);
                log.AppendFormat("User Display Name : {0}", this.UserDisplayName);
            }

            if (this.UserID.HasValue)
            {
                log.AppendLine(Environment.NewLine);
                log.AppendFormat("User ID : {0}", this.UserID.Value.ToString());
            }

            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Machine Name : {0}", this.MachineName);
            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Date Time : {0}", this.InsertDateTime);
            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Message Type : {0}", this.MessageType);
            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Component: {0}", this.Component);
            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Sender : {0}", this.Sender);
            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Key : {0}", this.DisplayKey);
            log.AppendLine(Environment.NewLine);
            log.AppendFormat("Message : {0}", this.Message);

            return log.ToString();
        }

        #endregion properties
    }
}
