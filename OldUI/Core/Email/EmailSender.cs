namespace TradeRiser.Core.Mail
{
    using System;
    using TradeRiser.Core.Common;
    using TradeRiser.Core.Director;
    using TradeRiser.Core.Membership;

    
    /// <summary>
    /// Provides ability to send emails.
    /// </summary>
    public class EmailSender
    {
		#region private fields 

        /// <summary>
        /// The email settings.
        /// </summary>
        private readonly IEmailClientSettings emailClientSettings;

        private readonly IEmailClient emailClient;
        
		#endregion private fields 

		#region constructors 

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailSender"/> class.
        /// </summary>
        public EmailSender(IDirector director = null)
        {
            if (director == null)
            {
                director = new Director
                {
                    User = new SystemUser()
                };
            }

            this.emailClient = new SmtpEmailClient(director);

            this.emailClientSettings = new EmailClientSettings()
            {
                Server = director.Configuration.GetConfigItem<string>("Core.SmtpServer"),
                Port = director.Configuration.GetConfigItem("Core.SmtpPort", -1),
                UserName = director.Configuration.GetConfigItem<string>("Core.SmtpAccount"),
                Password = director.Configuration.GetConfigItem<string>("Core.SmtpPassword"),
                UseSsl = director.Configuration.GetConfigItem("Core.SmtpUseSsl", false)
            };
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmailSender"/> class.
        /// </summary>
        /// <param name="clientSettings">The client settings.</param>
        public EmailSender(IEmailClientSettings clientSettings) : this()
        {
            Validate.ArgumentNotNull(clientSettings, "clientSettings");
            this.emailClientSettings = clientSettings;
        }

		#endregion constructors 

		#region properties 

		#endregion properties 

		#region public methods 

        /// <summary>
        /// Sends the specified email.
        /// </summary>
        /// <param name="email">The email to send.</param>
        public void Send(IEmail email)
        {
            Validate.ArgumentNotNull(email, "email");

            string error;

            if (!email.IsValid(out error))
            {
                throw new ArgumentException(error);
            }

            this.emailClient.Send(this.emailClientSettings, email);           
        }

		#endregion public methods 
		
    }
}
