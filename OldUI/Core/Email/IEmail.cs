using System.Collections.Generic;

namespace TradeRiser.Core.Mail
{
    public interface IEmail
    {
        /// <summary>
        /// Gets or sets the From address.
        /// </summary>
        /// <value>The From address.</value>
        string From { get; set; }

        /// <summary>
        /// Gets or sets the From display name.
        /// </summary>
        /// <value>The From display name.</value>
        string FromDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the message to send.
        /// </summary>
        /// <value>The message to send.</value>
        string Message { get; set; } 

        /// <summary>
        /// Gets or sets the subject of the message.
        /// </summary>
        /// <value>The message subject.</value>
        string Subject { get; set; }

        /// <summary>
        /// Gets or sets the To address.
        /// </summary>
        /// <value>The To address.</value>
        string To { get; set; }

        /// <summary>
        /// Gets or sets the reply to address.
        /// </summary>
        /// <value>The reply to address.</value>
        string ReplyTo { get; set; }

        /// <summary>
        /// Gets or sets the display name of the reply to address.
        /// </summary>
        /// <value>The display name of the reply to address.</value>
        string ReplyToDisplayName { get; set; }

        /// <summary>
        /// Gets or sets the priority.
        /// </summary>
        /// <value>
        /// The priority.
        /// </value>
        int Priority { get; set; }

        /// <summary>
        /// Determines whether the specified message is valid.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <returns>
        /// 	<c>True</c> if the specified message is valid; otherwise, <c>false</c>.
        /// </returns>
        bool IsValid(out string message);

        /// <summary>
        /// Gets or sets the attachments.
        /// </summary>
        /// <value>
        /// The attachments.
        /// </value>
        List<EmailAttachment> Attachments { get; set; }
    }
}