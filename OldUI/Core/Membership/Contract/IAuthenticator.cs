using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{

    public interface IAuthenticator
    {
        // <summary>
        /// Ends the users logged on session.
        /// </summary>
        void LogOff();

        /// <summary>
        /// Authenticates the current user request.
        /// </summary>
        /// <param name="uri">The current execution path.</param>
        LoginPageInfoCode Authenticate(string uri);

        /// <summary>
        /// Attempts to verify the user can access the system.
        /// </summary>
        /// <param name="username">The username.</param>
        /// <param name="password">The password for the account.</param>
        /// <param name="timezone">The timezone.</param>
        /// <returns>
        /// A LoginResult value indicating the result of the logon request.
        /// </returns>
        LogOnResult LogOn(string username, string password, string timezone);
    }
}
