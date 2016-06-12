using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{ /// <summary>
    /// The reason the logon page has been shown again.
    /// </summary>
    public enum LoginPageInfoCode
    {
        /// <summary>
        /// The cookie was missing.
        /// </summary>
        MissingCookie = 1,

        /// <summary>
        /// The user logged off ok.
        /// </summary>
        LoggedOffOk = 2,

        /// <summary>
        /// The session timed out.
        /// </summary>
        SessionTimeout = 3,

        /// <summary>
        /// The user was not authenticated.
        /// </summary>
        NotAuthenticated = 4,

        /// <summary>
        /// Do not allow a return after login.
        /// </summary>
        NoLoginReturn = 5,

        /// <summary>
        /// Users password have been successfully reset.
        /// </summary>
        PasswordReset = 6,

        /// <summary>
        /// Users password have been successfully reset.
        /// </summary>
        PasswordResetFailed = 7,

        /// <summary>
        /// The authentication was successful.
        /// </summary>
        Successful = 8
    }
}
