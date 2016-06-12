using System;
using System.Diagnostics;
using System.Web;
using System.Web.Security;
using TradeRiser.Core;
using TradeRiser.Core.Common;
using TradeRiser.Core.Director;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Membership;
using TradeRiser.Core.SignOn;



namespace TradeRiser.UI.Security
{
    /// <summary>
    /// CPF Authentication.
    /// </summary>
    public class Authenticator : IAuthenticator
    {
        #region  Fields

        /// <summary>
        /// The cookie manager.
        /// </summary>
        private readonly CookieManager cookies;

        /// <summary>
        /// The current director.
        /// </summary>
        private readonly IDirector director;

        private readonly HttpContext httpContext;

        /// <summary>
        /// Membership Policy
        /// </summary>
        private MembershipPolicy policy;

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="Authenticator"/> class.
        /// </summary>
        /// <param name="director">The director.</param>
        /// <param name="cookies">The cookies manager.</param>
        public Authenticator(IDirector director, CookieManager cookies)
        {
            this.director = director;
            this.cookies = cookies;
            this.httpContext = HttpContext.Current;
        }

        #endregion

        #region IAuthenticator Members

        /// <summary>
        /// Ends the users logged on session.
        /// </summary>
        public void LogOff()
        {
            this.cookies.LogOff();
        }

        /// <summary>
        /// Authenticates the current user request.
        /// </summary>
        /// <param name="uri">The current execution path.</param>
        public LoginPageInfoCode Authenticate(string uri)
        {
            try
            {
                if (this.cookies != null)
                {
                    string cookieValue = this.cookies.Get(CoreConstants.CookieName, string.Empty);
                    if (string.IsNullOrEmpty(cookieValue))
                    {
                        return LoginPageInfoCode.NotAuthenticated;
                    }

                    FormsAuthenticationTicket fat = FormsAuthentication.Decrypt(cookieValue);
                    FormsIdentity fi = new FormsIdentity(fat);

                    if (fat.Expired)
                    {
                        return LoginPageInfoCode.SessionTimeout;
                    }

                    try
                    {
                        this.httpContext.User = new System.Security.Principal.GenericPrincipal(fi, null);
                    }
                    catch (Exception ex)
                    {
                        // Log exception but carry on
                        Log.Warning("UI.Contract", "Authenticator.Authenticate", ex.Message);
                    }

                    if (!fi.IsAuthenticated)
                    {
                        return LoginPageInfoCode.NotAuthenticated;
                    }

                    CpfFatInfo fatInfo = CpfFatInfo.Deserialize(fi.Ticket.UserData);
                    if (fatInfo != null)
                    {
                        User user = new UserSignOnService(this.director.Configuration).GetUserById(fatInfo.UserId);

                        if (user == null || !string.Equals(user.UserName, fatInfo.UserName, StringComparison.InvariantCultureIgnoreCase))
                        {
                            return LoginPageInfoCode.NotAuthenticated;
                        }

                        DateTime currentIssueDate = DateTime.UtcNow;

                        if (this.httpContext != null && this.httpContext.Request.Headers["Timestamp-Update"] != null)
                        {
                            bool updateTimestamp = true;

                            if (bool.TryParse(this.httpContext.Request.Headers.Get("Timestamp-Update"), out updateTimestamp))
                            {
                                if (!updateTimestamp)
                                {
                                    currentIssueDate = fat.IssueDate;
                                }
                            }
                        }

                        this.director.User = user;
                        this.cookies.SetAuthenticationCookie(user, fatInfo.Domain, currentIssueDate);
                    }
                }
                else
                {
                    return LoginPageInfoCode.MissingCookie;
                }

                return LoginPageInfoCode.Successful;
            }
            catch (Exception ex)
            {
                string message = string.Format("Authenticate failed. Cookie value is invalid and connot be decrypted. Requested url:'{0}'.", uri);
                Log.Exception("CPF", "Authenticator.Authenticate", new Exception(message, ex));

                return LoginPageInfoCode.NotAuthenticated;
            }
        }

        /// <summary>
        /// Attempts to verify the user can access the system.
        /// </summary>
        /// <param name="username">The username.</param>
        /// <param name="password">The password for the account.</param>
        /// <param name="timezone">The timezone.</param>
        /// <returns>
        /// A LoginResult value indicating the result of the logon request.
        /// </returns>
        public LogOnResult LogOn(string username, string password, string timezone)
        {
            this.EnsureMembershipPolicy();

            Debug.Assert(!string.IsNullOrEmpty(username), "!String.IsNullOrEmpty(username)");

            UserSignOnService signOnService = new UserSignOnService(this.director.Configuration);
            User user = signOnService.GetUserByUserName(username);

            if (user == null)
            {
                // invalid username specified
                string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedInvalidAccount, Resx.Format(TradeRiserUIResource.AuditLoginInvalidAccount, username));
                Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message, username);

                return LogOnResult.AccessDeniedInvalidAccount;
            }

            bool validPassword = false;
            if (!string.IsNullOrEmpty(password))
            {
                validPassword = PasswordHash.VerifyHash(password, user.Password);
            }

            if (!validPassword)
            {
                int invalidAttempts = user.InvalidLogOnAttempts + 1;

                // password policy
                if (this.policy.LockAccount.Evaluate(invalidAttempts))
                {
                    // lockout policySet enabled and max number of invalid logon attempts made so lockout the account
                    signOnService.UpdateUserLockAccount(user.UserID);

                    string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedInvalidPasswordAccountLocked, Resx.Format(TradeRiserUIResource.AuditLoginInvalidPasswordAccountLocked, username));
                    Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);

                    return LogOnResult.AccessDeniedInvalidPasswordAccountLocked;
                }
                else
                {
                    if (this.policy.LockAccount.Enabled)
                    {
                        signOnService.UpdateUserInvalidLoginAttempt(user.UserID);
                    }

                    string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedInvalidPassword, Resx.Format(TradeRiserUIResource.AuditLoginInvalidPassword, username));
                    Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);

                    return LogOnResult.AccessDeniedInvalidPassword;
                }
            }

            if (user.Disabled)
            {
                string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedAccountDisabled, Resx.Format(TradeRiserUIResource.AuditLoginAccountDisabled, username));
                Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message);

                return LogOnResult.AccessDeniedAccountDisabled;
            }

            if (user.Locked)
            {
                //// users password is valid but account is locked
                //// check the account locked timout policy settings
                if (!this.policy.AccountLockedTimeout.Enabled || (this.policy.AccountLockedTimeout.Enabled && this.policy.AccountLockedTimeout.Limit == 0))
                {
                    // account lock policy is not enabled or is enabled and set to infinite timeout (0 minutes)
                    // do not allow the user to access the system
                    string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedAccountLocked, Resx.Format(TradeRiserUIResource.AuditLoginAccountLocked, username));
                    Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);

                    return LogOnResult.AccessDeniedAccountLocked;
                }
                DateTime allowLogOnAt = new DateTime();

                // test for timeout value
                if (user.LastLockDate.HasValue)
                {
                    // account lockout timeout
                    allowLogOnAt = user.LastLockDate.Value.AddMinutes(this.policy.AccountLockedTimeout.Limit);
                }
                else
                {
                    ArgumentException ex = new ArgumentException(Resx.Format(TradeRiserUIResource.UserAccountLockedLockedDateNotSet, username));
                    Log.Exception(MembershipConstants.LogComponentKey, "Authenticator.LogOn", ex, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);
                    throw ex;
                }

                if (allowLogOnAt > DateTime.UtcNow)
                {
                    // timeout has not yet elapsed. Account still locked, user cannot logon yet
                    string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedAccountLocked, Resx.Format(TradeRiserUIResource.AuditLoginAccountLocked, username));
                    Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);

                    return LogOnResult.AccessDeniedAccountLocked;
                }

                // timeout has elapsed. Allow user to logon again
                // (code falls through to statements below)
            }

            // user password is ok, reset flags and update details
            this.director.User = user;

            signOnService.UpdateUserSuccessfulLogin(user.UserID, timezone);

            // password is valid; check it hasn't expired
            if (this.policy.PasswordExpiry.Evaluate(user.LastPasswordReset))
            {
                string message = string.Format("LogOnResult: {0}. ", LogOnResult.AccessDeniedUserMustChangePassword);//, TradeRiserUIResource.AuditLoginPasswordExpired, username));

               // string message = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessDeniedUserMustChangePassword, Resx.Format(TradeRiserUIResource.AuditLoginPasswordExpired, username));
                Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", message, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);

                signOnService.UserMustChangePassword(user.UserID, true);

                return LogOnResult.AccessDeniedUserMustChangePassword;
            }

            // all is ok
            string successMessage = string.Format("LogOnResult: {0}. {1}", LogOnResult.AccessAllowedUserNamePasswordVerified, Resx.Format(TradeRiserUIResource.AuditLoginVerified, username));
            Log.Audit(MembershipConstants.LogComponentKey, "Authenticator.LogOn", successMessage, user.UserName, string.Format("{0} {1}", user.FirstName, user.LastLockDate), user.UserID);

            return LogOnResult.AccessAllowedUserNamePasswordVerified;
        }

        #endregion

        #region  Private Methods

        /// <summary>
        /// Ensures the membership policy is loaded.
        /// </summary>
        private void EnsureMembershipPolicy()
        {
            if (this.policy == null)
            {
                this.policy = new MembershipPolicy(new MembershipPolicyLoader());
            }
        }

        #endregion
    }
}