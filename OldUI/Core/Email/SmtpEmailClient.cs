namespace TradeRiser.Core.Mail
{
    using System;
    using System.Net;
    using System.Net.Mail;
    using TradeRiser.Core.Common;
    using TradeRiser.Core.Director;


    /// <summary>
	/// Provides ability to send emails via SMTP.
	/// </summary>
	public class SmtpEmailClient : IEmailClient
	{
		private readonly MultipartEmail multipartEmail;
        
		/// <summary>
		///  assign MultipartEmail
		/// </summary>
		public SmtpEmailClient(IDirector director)
		{
			this.multipartEmail = new MultipartEmail(director.Configuration);
		}
		
		#region public methods 

		/// <summary>
		/// Sends an email with the specified settings.
		/// </summary>
		/// <param name="settings">The client settings.</param>
		/// <param name="email">The email to send.</param>
		public void Send(IEmailClientSettings settings, IEmail email)
		{
			Validate.ArgumentNotNull(settings, "settings");
			Validate.ArgumentNotNull(email, "email");
			
			if (string.IsNullOrEmpty(settings.Server))
			{
				throw new ArgumentException(TradeRiserCoreResource.ValidateServer);
			}

			using (SmtpClient mailClient = new SmtpClient(settings.Server, settings.Port))
			{
				mailClient.EnableSsl = settings.UseSsl;

				if (!string.IsNullOrEmpty(settings.UserName))
				{
					mailClient.UseDefaultCredentials = false;
					mailClient.Credentials = new NetworkCredential(settings.UserName, settings.Password);
				}
			    using (MailMessage message = this.multipartEmail.CreateMultipartEmail(email))
                {
                    if (settings.Priority > 0)
                    {
                        try
                        {
                            message.Priority = (MailPriority)settings.Priority;
                        }
                        catch
                        {
                            message.Priority = MailPriority.Normal;
                        }
                    }

                    if (!string.IsNullOrEmpty(email.ReplyTo))
                    {
                        message.ReplyToList.Add(new MailAddress(email.ReplyTo, email.ReplyToDisplayName));
                    }

                    try
                    {
                        mailClient.Send(message);
                    }
                    catch (Exception e)
                    {
                        Logging.Log.Exception("Mail", "SmtpEmailClient.Send", e);
                    }
			    }
            }
		}

		#endregion public methods 
		
	}
}
