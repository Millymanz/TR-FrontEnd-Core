namespace TradeRiser.Core.Mail
{
    /// <summary>
    /// Describes the operations on an email client.
    /// </summary>
    public interface IEmailClient
    {
		#region methods 

        /// <summary>
        /// Sends an email with the specified settings.
        /// </summary>
        /// <param name="settings">The client settings.</param>
        /// <param name="email">The email to send.</param>
        void Send(IEmailClientSettings settings, IEmail email);

		#endregion methods 
    }
}
