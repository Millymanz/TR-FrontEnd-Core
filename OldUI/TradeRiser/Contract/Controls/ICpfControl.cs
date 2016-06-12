using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI.Controls
{
    public interface ICpfControl
    {
        #region  Public Methods

        /// <summary>
        /// Initialises the control with the specified HTML helper.
        /// </summary>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="htmlAttributes">The HTML attributes.</param>
        void Initialise(System.Web.Mvc.HtmlHelper htmlHelper, object htmlAttributes);

        #endregion
    }
}