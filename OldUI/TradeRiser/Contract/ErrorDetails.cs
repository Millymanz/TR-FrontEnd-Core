using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI
{

    /// <summary>
    /// Error Details.
    /// </summary>
    public class ErrorDetails
    {
        /// <summary>
        /// Gets or sets the exception.
        /// </summary>
        /// <value>
        /// The exception.
        /// </value>
        public Exception Exception { get; set; }

        /// <summary>
        /// Gets or sets the type of the error.
        /// </summary>
        /// <value>
        /// The type of the error.
        /// </value>
        public ErrorType ErrorType { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [show details].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [show details]; otherwise, <c>false</c>.
        /// </value>
        public bool ShowDetails { get; set; }

        /// <summary>
        /// Gets the json.
        /// </summary>
        public string Json
        {
            get
            {
                return JsonConvert.SerializeObject(new
                {
                    message = this.Exception.Message,
                    source = this.Exception.Source,
                    stackTrace = this.Exception.StackTrace
                });
            }
        }
    }
}