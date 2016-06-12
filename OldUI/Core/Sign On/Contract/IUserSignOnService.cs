namespace TradeRiser.Core.SignOn
{
    using System;
    using System.Collections.Generic;
    using TradeRiser.Core.Membership;

    /// <summary>
    /// User Sign On Service interface.
    /// </summary>
    public interface IUserSignOnService
    {
        /// <summary>
        /// Changes the password.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="oldPassword">The old password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <returns></returns>
        PasswordActionResult ChangePassword(string userName, string oldPassword, string newPassword);

        /// <summary>
        /// Deletes the password reset request.
        /// </summary>
        /// <param name="userID">The user identifier.</param>
        /// <param name="userName">Name of the user.</param>
        void DeletePasswordResetRequest(Guid userID, string userName);

        /// <summary>
        /// Generates the password.
        /// </summary>
        /// <returns></returns>
        string GeneratePassword();

        /// <summary>
        /// Gets the password history.
        /// </summary>
        /// <param name="userID">The user identifier.</param>
        /// <returns></returns>
        List<PasswordHistory> GetPasswordHistory(Guid userID);

        ///// <summary>
        ///// Gets the password policy.
        ///// </summary>
        ///// <param name="container">The container.</param>
        ///// <returns></returns>
        //List<PolicySetting<int>> GetPasswordPolicy(string container);

        /// <summary>
        /// Gets the password reset request.
        /// </summary>
        /// <param name="resetToken">The reset token.</param>
        /// <returns></returns>
        PasswordResetRequest GetPasswordResetRequest(Guid resetToken);

        /// <summary>
        /// Gets the user by email.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns></returns>
        User GetUserByEmail(string email);

        /// <summary>
        /// Gets the user by identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="ignoreCache">if set to <c>true</c> [ignore cache].</param>
        /// <returns></returns>
        User GetUserById(Guid userId, bool ignoreCache);

        /// <summary>
        /// Gets the user by identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        User GetUserById(Guid userId);

        /// <summary>
        /// Gets the name of the user by user.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns></returns>
        User GetUserByUserName(string userName);

        /// <summary>
        /// Gets the membership policy.
        /// </summary>
        /// <value>
        /// The membership policy.
        /// </value>
        MembershipPolicy MembershipPolicy { get; }

        /// <summary>
        /// Requests the password reset.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        bool RequestPasswordReset(User user);

        /// <summary>
        /// Resets the password.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="confirmPassword">The confirm password.</param>
        /// <returns></returns>
        PasswordActionResult ResetPassword(Guid userId, string userName, string newPassword, string confirmPassword);

        ///// <summary>
        ///// Resets the password.
        ///// </summary>
        ///// <param name="userName">Name of the user.</param>
        ///// <param name="newPassword">The new password.</param>
        ///// <returns></returns>
        //bool ResetPassword(string userName, string newPassword);

        /// <summary>
        /// Updates the password.
        /// </summary>
        /// <param name="userID">The user identifier.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="historyPassword">The history password.</param>
        /// <returns></returns>
        bool UpdatePassword(Guid userID, string userName, string newPassword, string historyPassword);

        /// <summary>
        /// Updates the user last login.
        /// </summary>
        /// <param name="userID">The user identifier.</param>
        /// <param name="locked">if set to <c>true</c> [locked].</param>
        /// <param name="lastLogin">The last login.</param>
        /// <param name="lastLocked">The last locked.</param>
        /// <param name="invalidLoginAttempts">The invalid login attempts.</param>
        void UpdateUserLastLogin(Guid userID, bool locked, DateTime? lastLogin, DateTime? lastLocked, int invalidLoginAttempts);

        /// <summary>
        /// Updates the user in case his attempt was succesful.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="timezone">The timezone of the user.</param>
        /// <returns></returns>
        void UpdateUserSuccessfulLogin(Guid userID, string timezone);

        /// <summary>
        /// Updates the user in case he failed to login
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <returns></returns>
        void UpdateUserInvalidLoginAttempt(Guid userID);

         /// <summary>
        /// Locks the user in case he exceeded the max number of invalid attempts.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <returns></returns>
        void UpdateUserLockAccount(Guid userID);

        /// <summary>
        /// Users the exists.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns></returns>
        bool UserExists(string userName);

        /// <summary>
        /// Users the must change password.
        /// </summary>
        /// <param name="userID">The user identifier.</param>
        /// <param name="changePassword">if set to <c>true</c> [change password].</param>
        void UserMustChangePassword(Guid userID, bool changePassword);
    }
}
