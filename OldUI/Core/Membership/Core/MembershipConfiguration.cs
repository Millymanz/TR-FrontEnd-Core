using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Configuration;

namespace TradeRiser.Core.Membership
{
       /// <summary>
    /// Provides access to the configuration items used by the membership service.
    /// </summary>
    public class MembershipConfiguration
    {
        #region  Fields

        private readonly ConfigurationService configuration;

        #endregion

        #region  Properties and Indexers

        /// <summary>
        /// Gets the email from address.
        /// </summary>
        /// <value>The email from address.</value>
        public string EmailFromAddress
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailFromAddress"); }
        }

        /// <summary>
        /// Gets the display name of the email from.
        /// </summary>
        /// <value>The display name of the email from.</value>
        public string EmailFromDisplayName
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailFromDisplayName"); }
        }

        /// <summary>
        /// Gets a value indicating whether email integration is enabled.
        /// </summary>
        /// <value><c>True</c> if [email integration]; otherwise, <c>false</c>.</value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic", Justification = "Non static for consistency.")]
        public bool EmailIntegration
        {
            get { return this.configuration.GetConfigItem<bool>("Core.EmailIntegration"); }
        }

        /// <summary>
        /// Gets the email new integrated user message.
        /// </summary>
        /// <value>The email new integrated user message.</value>
        public string EmailNewIntegratedUserMessage
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailNewIntegratedUserTemplate"); }
        }

        /// <summary>
        /// Gets the email new user message.
        /// </summary>
        /// <value>The email new user message.</value>
        public string EmailNewUserMessage
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailNewUserTemplate"); }
        }

        /// <summary>
        /// Gets the email new user subject.
        /// </summary>
        /// <value>The email new user subject.</value>
        public string EmailNewUserSubject
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailNewUserSubject"); }
        }

        /// <summary>
        /// Gets the email reply to address.
        /// </summary>
        /// <value>The email reply to address.</value>
        public string EmailReplyToAddress
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailReplyToAddress"); }
        }

        /// <summary>
        /// Gets the display name of the email reply to.
        /// </summary>
        /// <value>The display name of the email reply to.</value>
        public string EmailReplyToDisplayName
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailReplyToDisplayName"); }
        }

        /// <summary>
        /// Gets the email reset password message.
        /// </summary>
        /// <value>The email reset password message.</value>
        public string EmailResetPasswordMessage
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailResetPasswordTemplate"); }
        }

        /// <summary>
        /// Gets the email password reset confirmation message.
        /// </summary>
        /// <value>
        /// The email password reset confirmation message.
        /// </value>
        public string EmailPasswordResetConfirmationMessage
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailPasswordResetConfirmation"); }
        }

        /// <summary>
        /// Gets the email password reset confirmation subject.
        /// </summary>
        /// <value>
        /// The email password reset confirmation subject.
        /// </value>
        public string EmailPasswordResetConfirmationSubject
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailPasswordResetConfirmationSubject"); }
        }

        /// <summary>
        /// Gets the email reset password subject.
        /// </summary>
        /// <value>The email reset password subject.</value>
        public string EmailResetPasswordSubject
        {
            get { return this.configuration.GetConfigItem<string>("Core.EmailResetPasswordSubject"); }
        }

        /// <summary>
        /// Gets a value indicating whether SSL is used to connect to the SMTP server.
        /// </summary>
        /// <value><c>True</c> if SSL is to be used to connect to the SMTP server; otherwise, <c>false</c>.</value>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic", Justification = "Non static for consistency.")]
        public string ExternalAppAddress
        {
            get { return this.configuration.GetConfigItem<string>("Core.ExternalApplicationAddress"); }
        }

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="MembershipConfiguration"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public MembershipConfiguration(ConfigurationService configuration)
        {
            this.configuration = configuration;
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Gets the email tokens.
        /// </summary>
        /// <param name="tokenGroup">The token group.</param>
        /// <returns>A dictionary of email tokens used to replace in the email.</returns>
        public Dictionary<string, string> GetEmailTokens(string tokenGroup)
        {
            string logonUrl = this.configuration.GetConfigItem<string>("Core.EmailToken.{LOGONURL}", string.Empty);
            string phone = this.configuration.GetConfigItem<string>("Core.EmailToken.{SERVICEPHONE}", string.Empty);

            Dictionary<string, string> tokens = new Dictionary<string, string>(2);
            tokens.Add("{LOGONURL}", logonUrl);
            tokens.Add("{SERVICEPHONE}", phone);

            return tokens;
        }

        #endregion
    }

}
