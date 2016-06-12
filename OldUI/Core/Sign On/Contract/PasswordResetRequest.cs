namespace TradeRiser.Core.SignOn
{
    using System;

    /// <summary>
    /// Password Reset Request
    /// </summary>
    public class PasswordResetRequest
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets the password reset request date time.
        /// </summary>
        /// <value>
        /// The request date time.
        /// </value>
        public DateTime RequestDateTime { get; set; }

        /// <summary>
        /// Gets or sets the reset token.
        /// </summary>
        /// <value>
        /// The reset token.
        /// </value>
        public Guid ResetToken { get; set; }

        /// <summary>
        /// Gets or sets the user id
        /// </summary>
        /// <value>
        /// The user identifier.
        /// </value>
        public Guid UserID { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; }

        #endregion Public Properties

        /// <summary>
        /// Determines whether the Password reset request is still valid.
        /// </summary>
        /// <param name="hours">The hours.</param>
        /// <returns></returns>
        public bool IsValid(int hours)
        {
            return this.RequestDateTime.AddHours(hours) > DateTime.UtcNow;    
        }
    }
}
