namespace TradeRiser.Core.Mail
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    /// <summary>
	/// Represents an email to send through the email sender.
	/// </summary>
	[Serializable]
    public class Email : IEmail,IDisposable
    {
        public Email()
        {
            this.Attachments = new List<EmailAttachment>();
        }

		#region properties 

		/// <summary>
		/// Gets or sets the From address.
		/// </summary>
		/// <value>The From address.</value>
		public string From { get; set; }

		/// <summary>
		/// Gets or sets the From display name.
		/// </summary>
		/// <value>The From display name.</value>
		public string FromDisplayName { get; set; }

		/// <summary>
		/// Gets or sets the message to send.
		/// </summary>
		/// <value>The message to send.</value>
		public string Message { get; set; }

		/// <summary>
		/// Gets or sets the subject of the message.
		/// </summary>
		/// <value>The message subject.</value>
		public string Subject { get; set; }

		/// <summary>
		/// Gets or sets the To address.
		/// </summary>
		/// <value>The To address.</value>
		public string To { get; set; }

		/// <summary>
		/// Gets or sets the reply to address.
		/// </summary>
		/// <value>The reply to address.</value>
		public string ReplyTo { get; set; }

		/// <summary>
		/// Gets or sets the display name of the reply to address.
		/// </summary>
		/// <value>The display name of the reply to address.</value>
		public string ReplyToDisplayName { get; set; }

		/// <summary>
		/// Gets or sets the priority.
		/// </summary>
		/// <value>
		/// The priority.
		/// </value>
		public int Priority { get; set; }

        /// <summary>
        /// Gets or sets the attachments.
        /// </summary>
        /// <value>
        /// The attachments.
        /// </value>
        public List<EmailAttachment> Attachments
        {
            get;
            set;
        }

		#endregion properties 

		#region internal methods 

		/// <summary>
		/// Determines whether the specified message is valid.
		/// </summary>
		/// <param name="message">The message.</param>
		/// <returns>
		/// 	<c>True</c> if the specified message is valid; otherwise, <c>false</c>.
		/// </returns>
		public bool IsValid(out string message)
		{
			if (string.IsNullOrEmpty(this.From))
			{
				message = TradeRiserCoreResource.ValidateFromAddress;
				return false;
			}

			if (string.IsNullOrEmpty(this.To))
			{
                message = TradeRiserCoreResource.ValidateToAddress;
				return false;
			}

			if (string.IsNullOrEmpty(this.Subject))
			{
                message = TradeRiserCoreResource.ValidateSubject;
				return false;
			}

			if (string.IsNullOrEmpty(this.Message))
			{
                message = TradeRiserCoreResource.ValidateEmailMessage;
				return false;
			}

			message = null;

			return true;
		}

        #endregion internal methods 

        public void Dispose()
        {
            if (this.Attachments != null && this.Attachments.Any())
            {
                foreach (EmailAttachment attachment in this.Attachments)
                {
                    if (attachment.ContentStream != null)
                    {
                        attachment.ContentStream.Dispose();
                    }
                }
            }
        }
    }
}
