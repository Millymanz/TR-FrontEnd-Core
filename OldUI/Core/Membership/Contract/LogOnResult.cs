using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{
    // <summary>
    /// Defines the possible outcomes of the login process.
    /// </summary>
    public enum LogOnResult
    {
        /// <summary>
        /// Access denied : The account name is invalid.
        /// </summary>
        AccessDeniedInvalidAccount,

        /// <summary>
        /// Access denied : The account has been disabled.
        /// </summary>
        AccessDeniedAccountDisabled,

        /// <summary>
        /// Access denied : The account is locked out.
        /// </summary>
        AccessDeniedAccountLocked,

        /// <summary>
        /// Access denied : The password is invalid for the account.
        /// </summary>
        AccessDeniedInvalidPassword,

        /// <summary>
        /// Access denied : The password is invalid for the account and the maximum number of attempts has been exceeded.  The users account has been locked.
        /// </summary>
        AccessDeniedInvalidPasswordAccountLocked,

        /// <summary>
        /// Access denied : Integrated logon is not allowed for this user.
        /// </summary>
        AccessDeniedIntegratedLogOnNotAllowed,

        /// <summary>
        /// Access denied : User authentictaed ok but must change password before accessing system.
        /// </summary>
        AccessDeniedUserMustChangePassword,

        /// <summary>
        /// Access allowed : User authenticated with integrated security.
        /// </summary>
        AccessAllowedIntegratedLogOnVerified,

        /// <summary>
        /// Access allowed : User authenticated with username and password.
        /// </summary>
        AccessAllowedUserNamePasswordVerified
    }
}
