namespace TradeRiser.Core.Mail
{
    public interface IEmailClientSettings
    {
        /// <summary>
        /// Gets or sets the password for the user.
        /// </summary>
        /// <value>The password for the user.</value>
        string Password { get; set; }

        /// <summary>
        /// Gets or sets the port number.
        /// This is usually port 25.
        /// </summary>
        /// <value>The port number.</value>
        int Port { get; set; }

        /// <summary>
        /// Gets or sets the server name used to send emails.
        /// </summary>
        /// <value>The server name.</value>
        string Server { get; set; }

        /// <summary>
        /// Gets or sets the username used to authenticate to the email server.
        /// Set this to null to connect anonymously.
        /// </summary>
        /// <value>The username used to authenticate to the email server.</value>
        string UserName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether SSL is used when connecting to the SMTP server.
        /// </summary>
        /// <value><c>True</c> if using SSL; otherwise, <c>false</c>.</value>
        bool UseSsl { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [use HTML body].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [use HTML body]; otherwise, <c>false</c>.
        /// </value>
        bool UseHTMLBody { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        int Priority { get; set; }
    }
}