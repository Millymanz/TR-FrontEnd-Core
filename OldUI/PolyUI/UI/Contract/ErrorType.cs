using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI
{
    public enum ErrorType
    {
        /// <summary>
        /// An error has occurred.
        /// </summary>
        Error = 1,

        /// <summary>
        /// A warning needs to be reported.
        /// </summary>
        Warning = 2,

        /// <summary>
        /// A forbidden action has been attempted.
        /// </summary>
        Forbidden = 3,

        /// <summary>
        /// An informational message needs to be reported.
        /// </summary>
        Information = 4
    }
}