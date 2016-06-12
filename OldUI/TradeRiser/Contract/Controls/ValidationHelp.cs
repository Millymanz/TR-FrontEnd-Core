using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI.Controls
{
    using System.Web.Mvc;

    /// <summary>
    /// Validation Help binder.
    /// </summary>
    [ModelBinder(typeof(ValidationHelpBinder))]
    public class ValidationHelp
    {
        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidationHelp"/> class.
        /// </summary>
        public ValidationHelp()
        {
        }

        #endregion Constructors

        #region Properties

        /// <summary>
        /// Gets or sets the input control.
        /// </summary>
        /// <value>
        /// The input control.
        /// </value>
        public string InputControl { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ValidationHelp"/> is required.
        /// </summary>
        /// <value>
        ///   <c>True</c> if required; otherwise, <c>false</c>.
        /// </value>
        public bool Required { get; set; }

        #endregion Properties
    }
}