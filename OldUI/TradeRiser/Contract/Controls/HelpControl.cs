using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI.Controls
{
    /// <summary>
    /// Help Control
    /// </summary>
    public class HelpControl
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets the target ID.
        /// </summary>
        /// <value>
        /// The target ID.
        /// </value>
        public string TargetID { get; set; }

        /// <summary>
        /// Gets or sets the width.
        /// </summary>
        /// <value>
        /// The width.
        /// </value>
        public string Width { get; set; }

        /// <summary>
        /// Gets or sets the CSS class.
        /// </summary>
        /// <value>
        /// The CSS class.
        /// </value>
        public string CSSClass { get; set; }

        /// <summary>
        /// Gets or sets the content.
        /// </summary>
        /// <value>
        /// The content.
        /// </value>
        public string Content { get; set; }

        #endregion
    }
}