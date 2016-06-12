namespace TradeRiser.Core.Mail
{
    using System;
    
    
    /// <summary>
    /// Describes the settings for the email client.
    /// </summary>
    [Serializable]
    public class EmailClientSettings : IEmailClientSettings
    {
		#region constants 

        /// <summary>
        /// The default port.
        /// </summary>
        private const int DefaultSmtpPort = 25;

		#endregion constants 

		#region constructors 

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailClientSettings"/> class.
        /// </summary>
        public EmailClientSettings()
        {
            this.Port = DefaultSmtpPort;
            this.UseHTMLBody = false;
            this.Priority = 0;
        }

		#endregion constructors 

		#region properties 

        /// <summary>
        /// Gets or sets the password for the user.
        /// </summary>
        /// <value>The password for the user.</value>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the port number.
        /// This is usually port 25.
        /// </summary>
        /// <value>The port number.</value>
        public int Port { get; set; }

        /// <summary>
        /// Gets or sets the server name used to send emails.
        /// </summary>
        /// <value>The server name.</value>
        public string Server { get; set; }

        /// <summary>
        /// Gets or sets the username used to authenticate to the email server.
        /// Set this to null to connect anonymously.
        /// </summary>
        /// <value>The username used to authenticate to the email server.</value>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether SSL is used when connecting to the SMTP server.
        /// </summary>
        /// <value><c>True</c> if using SSL; otherwise, <c>false</c>.</value>
        public bool UseSsl { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [use HTML body].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [use HTML body]; otherwise, <c>false</c>.
        /// </value>
        public bool UseHTMLBody { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        public int Priority { get; set; }

		#endregion properties 
    }
}
