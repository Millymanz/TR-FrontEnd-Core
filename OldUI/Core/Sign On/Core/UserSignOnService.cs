﻿namespace TradeRiser.Core.SignOn
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Configuration;
    using Logging;
    using Membership;
    using TradeRiser.Core.Common;
    using TradeRiser.Core.Mail;
    using TradeRiser.Core.Configuration.Core;

    /// <summary>
    /// User sign on service.
    /// </summary>
    public class UserSignOnService : IUserSignOnService
    {
        private readonly MemoryManager cacheStore;
        private readonly UserSignOnDataAccess dataAccess;
        private PasswordGenerator passwordGenerator;
        private MembershipPolicy membershipPolicy;

        public MembershipPolicy MembershipPolicy
        {
            get
            {
                if (this.membershipPolicy == null)
                {
                    this.membershipPolicy = new MembershipPolicy(new MembershipPolicyLoader());
                }

                return this.membershipPolicy;
            }
        }

        private const string AdhocUserCacheContainer = "AdhocUserCache";

        private readonly ConfigurationService config;

        public UserSignOnService(ConfigurationService config)
        {
            this.cacheStore = new MemoryManager();
            this.config = config;
            this.dataAccess = new UserSignOnDataAccess();
        }

        public void PurgeCache(Guid userId)
        {
            string cacheKey = GetCacheKey(userId);
        }

        public void PurgeCache(Guid[] userIds)
        {
            for (int i = 0, ii = userIds.Length; i < ii; i++)
            {
                string cacheKey = UserSignOnService.GetCacheKey(userIds[i]);
            }
        }

        private void AddCache(Guid userId, User user)
        {
            int expiry = this.config.GetConfigItem("Cache.AdhocUserCacheExpiryInMinutes", 30);
            this.cacheStore.Add(UserSignOnService.GetCacheKey(userId), user, TimeSpan.FromMinutes(expiry));
        }

        public User GetUserById(Guid userId)
        {
            return this.GetUserById(userId, false);
        }

        public User GetUserById(Guid userId, bool ignoreCache)
        {
            if (userId == Guid.Empty)
            {
                return null;
            }

            if (userId.ToString().Equals(SystemUser.Id)) return new SystemUser();

            User user = null;

            if (!ignoreCache)
            {
                user = this.GetCache(userId);
            }

            if (user == null)
            {
                user = this.dataAccess.GetUserByID(userId);

                if (user != null)
                {
                    this.AddCache(userId, user);
                }
            }

            return user;
        }

        private User GetCache(Guid userId)
        {
            return this.cacheStore.Get(UserSignOnService.GetCacheKey(userId)) as User;
        }

        public User GetUserByUserName(string userName)
        {
            User user = this.dataAccess.GetUserByUserName(userName);

            if (user != null)
            {
                this.AddCache(user.UserID, user);
            }

            return user;
        }

        public User GetUserByEmail(string email)
        {
            User user = this.dataAccess.GetUserByEmail(email);

            if (user != null)
            {
                this.AddCache(user.UserID, user);
            }

            return user;
        }

        public void UserMustChangePassword(Guid userId, bool changePassword)
        {
            bool updated = this.dataAccess.UserMustChangePassword(userId, changePassword);

            if (!updated)
            {
                Log.Exception("UserSignOnService", "UserMustChangePassword", new Exception("Task UsersForcePasswordChange failed. Unexpected response of 0 from stored procedure."));
            }

            this.PurgeCache(userId);
        }

        public void UpdateUserLastLogin(Guid userID, bool locked, DateTime? lastLogin, DateTime? lastLocked, int invalidLoginAttempts)
        {
            bool updated = this.dataAccess.UpdateUserLastLogin(userID, locked, lastLogin, lastLocked, invalidLoginAttempts);

            if (!updated)
            {
                Log.Exception("UserSignOnService", "UpdateUserLastLogin", new Exception("Task UsersLastLoginUpdate failed. Unexpected response of 0 from stored procedure."));
            }

            this.PurgeCache(userID);
        }

        public void UpdateUserSuccessfulLogin(Guid userID, string timezone)
        {
            if (userID == Guid.Empty)
            {
                string exceptionMessage = "Task UpdateUserSuccessfulLogin failed. The parameter UserID was NULL.";
                Log.Exception("UserSignOnService", "UpdateUserSuccessfulLogin", new Exception(exceptionMessage));

                throw new ArgumentException(exceptionMessage);
            }


            bool updated = this.dataAccess.UpdateUserSuccessfulLogin(userID, timezone);

            if (!updated)
            {
                Log.Exception("UserSignOnService", "UpdateUserSuccessfulLogin", new Exception("Task UpdateUserSuccessfulLogin failed. Unexpected response of 0 from stored procedure."));
            }

            this.PurgeCache(userID);
        }

        /// <summary>
        /// Updates the user in case he failed to login
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="lastLogin">The date when the user attempted to log in.</param>
        /// <param name="invalidLoginAttempts">Number of invalid attempts.</param>
        /// <returns></returns>
        public void UpdateUserInvalidLoginAttempt(Guid userID)
        {
            if (userID == Guid.Empty)
            {
                string exceptionMessage = "Task UpdateUserInvalidLoginAttempt failed. The parameter UserID was NULL.";
                Log.Exception("UserSignOnService", "UpdateUserInvalidLoginAttempt", new Exception(exceptionMessage));

                throw new ArgumentException(exceptionMessage);
            }

            bool updated = this.dataAccess.UpdateUserInvalidLoginAttempt(userID);

            if (!updated)
            {
                Log.Exception("UserSignOnService", "UpdateUserInvalidLoginAttempt", new Exception("Task UpdateUserInvalidLoginAttempt failed. Unexpected response of 0 from stored procedure."));
            }

            this.PurgeCache(userID);
        }


        /// <summary>
        /// Locks the user in case he exceeded the max number of invalid attempts.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="lastLocked">The date when the user was last locked</param>
        /// <param name="invalidLoginAttempts">The number of invalid attempts.</param>
        public void UpdateUserLockAccount(Guid userID)
        {
            if (userID == Guid.Empty)
            {
                string exceptionMessage = "Task UpdateUserLockAccount failed. The parameter UserID was NULL.";
                Log.Exception("UserSignOnService", "UpdateUserLockAccount", new Exception(exceptionMessage));

                throw new ArgumentException(exceptionMessage);
            }

            bool updated = this.dataAccess.UpdateUserLockAccount(userID);

            if (!updated)
            {
                Log.Exception("UserSignOnService", "UpdateUserLockAccount", new Exception("Task UpdateUserLockAccount failed. Unexpected response of 0 from stored procedure."));
            }

            this.PurgeCache(userID);
        }
        /// <summary>
        /// Checks if the user exists.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns>
        /// True if the user exists in the CPF database for the given application roleName.
        /// </returns>
        public bool UserExists(string userName)
        {
            return this.GetUserByUserName(userName) != null;
        }

        /// <summary>
        /// Resets the password.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="userName"></param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="confirmPassword">The confirm password.</param>
        /// <returns></returns>
        public PasswordActionResult ResetPassword(Guid userId, string userName, string newPassword, string confirmPassword)
        {
            string passwordHash = string.Empty;
            PasswordActionResult validationResult = this.ValidatePassword(userId, newPassword, out passwordHash);

            bool updated = false;


            if (validationResult == PasswordActionResult.Ok)
            {
                string newPasswordHash = CpfHash.ComputeHash(newPassword);
                updated = this.UpdatePassword(userId, userName, newPasswordHash, passwordHash);
            }

            if (updated)
            {
                User user = this.GetUserByUserName(userName);
                Log.Audit("UserSignOnService", "ResetPassword", string.Format("Password was reset for user: {0}", userName));
                this.SendPasswordResetConfirmationEmail(user);

            }

            return validationResult;
        }

        /// <summary>
        /// Changes the users password.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <param name="oldPassword">The old password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <returns>
        /// A PasswordActionResult enumeration containing the result of the operation.
        /// </returns>
        public PasswordActionResult ChangePassword(string userName, string oldPassword, string newPassword)
        {
            User user = this.GetUserByUserName(userName);

            if (user == null)
            {
                return PasswordActionResult.FailedUserDoesNotExist;
            }

            // not allowed if passwords are the same
            if (oldPassword.Equals(newPassword))
            {
                return PasswordActionResult.FailedNewPasswordSameAsOldPassword;
            }

            if (!CpfHash.VerifyHash(oldPassword, user.Password))
            {
                return PasswordActionResult.FailedIncorrectPassword;
            }

            string passwordHash = string.Empty;
            PasswordActionResult validationResult = this.ValidatePassword(user.UserID, newPassword, out passwordHash);

            if (validationResult == PasswordActionResult.Ok)
            {
                string newPasswordHash = CpfHash.ComputeHash(newPassword);
                this.UpdatePassword(user.UserID, user.UserName, newPasswordHash, passwordHash);

                this.PurgeCache(user.UserID);
            }

            return validationResult;
        }

        /// <summary>
        /// Validates the password.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="passwordHash">The password hash.</param>
        /// <returns></returns>
        private PasswordActionResult ValidatePassword(Guid userId, string newPassword, out string passwordHash)
        {
            // check against configured policySet
            PasswordValidator passwordValidator = new PasswordValidator(this.MembershipPolicy);
            PasswordActionResult validationResult;
            bool validated = passwordValidator.ValidatePassword(newPassword, out validationResult);
            string passwordHashTest = string.Empty;

            if (!validated)
            {
                passwordHash = passwordHashTest;
                return validationResult;
            }

            // check that the new password is not present in the users password history
            if (this.MembershipPolicy.PasswordHistory.Enabled)
            {
                passwordHashTest = Hash.ComputeKeyedHash(newPassword, userId.ToString());

                List<PasswordHistory> history = this.GetPasswordHistory(userId);

                if (history.Count(a => a.Password == passwordHashTest) > 0)
                {
                    passwordHash = passwordHashTest;
                    // password in password history, so return false                    
                    return PasswordActionResult.FailedPasswordAlreadyUsed;
                }
            }

            passwordHash = passwordHashTest;
            return PasswordActionResult.Ok;
        }

        /// <summary>
        /// Inserts the password history.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="userName"></param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="historyPassword">The history password.</param>
        public bool UpdatePassword(Guid userID, string userName, string newPassword, string historyPassword)
        {
            bool updated = this.dataAccess.UpdatePassword(userID, newPassword, historyPassword);

            if (!updated)
            {
                Exception dataAccessException = new Exception("Task UsersPasswordUpdate failed. Unexpected response of 0 from stored procedure.");
                Log.Exception("UserSignOnService", "UpdateUserLastLogin", dataAccessException);

                throw dataAccessException;
            }

            this.DeletePasswordResetRequest(userID, userName);

            return true;
        }

        /// <summary>
        /// Requests the password reset.
        /// </summary>
        /// <param name="user">The user.</param>
        public bool RequestPasswordReset(User user)
        {
            Guid resetToken = Guid.NewGuid();

            bool result = this.dataAccess.AddPasswordResetRequest(user.UserID, resetToken);

            if (result)
            {
                Log.Audit("UserSignOnService", "RequestPasswordReset", string.Format("Password reset was requested for user: '{0}'", user.UserName), user.UserName, user.UserDisplayName, user.UserID);
                // send the user an email with password reset link.

                this.SendResetPasswordEmail(user, resetToken);

                Log.Audit("UserSignOnService", "RequestPasswordReset", string.Format("Password reset email sent for user: '{0}'", user.UserName), user.UserName, user.UserDisplayName, user.UserID);
            }

            return result;
        }

        public PasswordResetRequest GetPasswordResetRequest(Guid resetToken)
        {
            PasswordResetRequest request = this.dataAccess.GetPasswordResetRequest(resetToken);

            if (request == null)
            {
                Log.Audit("UserSignOnService", "GetPasswordResetRequest", string.Format("Attempt to get a password reset request with an invalid resetToken ({0})", resetToken));
            }

            return request;
        }

        public void DeletePasswordResetRequest(Guid userID, string userName)
        {
            this.dataAccess.DeletePasswordResetRequest(userID);
            Log.Audit("UserSignOnService", "DeletePasswordResetRequest", string.Format("All password reset requests for user: '{0}' have been deleted.", userName));
        }

        public string GeneratePassword()
        {
            if (this.passwordGenerator == null)
            {
                this.passwordGenerator = new PasswordGenerator(this.MembershipPolicy);
            }

            return this.passwordGenerator.GeneratePassword();
        }

        public List<PasswordHistory> GetPasswordHistory(Guid userID)
        {
            List<PasswordHistory> historyList = this.dataAccess.GetPasswordHistory(userID);
            return historyList;
        }

        public List<PolicySetting<int>> GetPasswordPolicy(string container)
        {
            List<PolicySetting<int>> policy = this.dataAccess.GetPasswordPolicy(container);

            return policy;
        }

        private void SendResetPasswordEmail(User user, Guid resetToken)
        {
            MembershipConfiguration membershipConfig = new MembershipConfiguration(this.config);

            if (!membershipConfig.EmailIntegration)
            {
                return;
            }

            string resetPasswordLink = string.Format("{0}/core/changepassword/{1}", membershipConfig.ExternalAppAddress, resetToken);

            Dictionary<string, string> tokens = new Dictionary<string, string>
                                                    {
                                                        {
                                                            "{RESETLINK}", resetPasswordLink
                                                        }
                                                    };
            string message = UserSignOnService.BuildEmail(membershipConfig, membershipConfig.EmailResetPasswordMessage, "Core.EmailToken", tokens);

            UserSignOnService.SendEmail(membershipConfig, membershipConfig.EmailResetPasswordSubject, message, user.Email);
        }

        private void SendPasswordResetConfirmationEmail(User user)
        {
            MembershipConfiguration membershipConfig = new MembershipConfiguration(this.config);

            if (!membershipConfig.EmailIntegration)
            {
                return;
            }

            string message = UserSignOnService.BuildEmail(membershipConfig, membershipConfig.EmailPasswordResetConfirmationMessage, "Core.EmailToken", null);

            UserSignOnService.SendEmail(membershipConfig, membershipConfig.EmailPasswordResetConfirmationSubject, message, user.Email);
        }

        private static string BuildEmail(MembershipConfiguration config, string messageTemplate, string tokenGroup, Dictionary<string, string> tokens)
        {
            Dictionary<string, string> existingTokens = config.GetEmailTokens(tokenGroup);

            if (tokens != null)
            {
                foreach (KeyValuePair<string, string> item in tokens)
                {
                    if (existingTokens.ContainsKey(item.Key))
                    {
                        existingTokens[item.Key] = item.Value;
                    }
                    else
                    {
                        existingTokens.Add(item.Key, item.Value);
                    }
                }
            }

            foreach (KeyValuePair<string, string> token in existingTokens)
            {
                messageTemplate = messageTemplate.Replace(token.Key.ToUpperInvariant(), token.Value);
            }

            messageTemplate = messageTemplate.Replace("\\n", Environment.NewLine);

            return messageTemplate;
        }

        private static void SendEmail(MembershipConfiguration config, string subject, string message, string emailAddress)
        {
            Email email = new Email
            {
                From = config.EmailFromAddress,
                FromDisplayName = config.EmailFromDisplayName,
                To = emailAddress,
                Subject = subject,
                Message = message,
                ReplyTo = config.EmailReplyToAddress,
                ReplyToDisplayName = config.EmailReplyToDisplayName
            };

            EmailSender sender = new EmailSender();
            sender.Send(email);
        }

        private static string GetCacheKey(Guid userId)
        {
            return string.Format("{0}_{1}", UserSignOnService.AdhocUserCacheContainer, userId.ToString().ToLower());
        }
    }
}
