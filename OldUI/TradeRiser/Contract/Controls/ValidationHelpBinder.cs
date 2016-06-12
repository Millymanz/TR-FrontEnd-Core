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
    public class ValidationHelpBinder : IModelBinder
    {
        #region IModelBinder Members

        /// <summary>
        /// Binds the model to a value by using the specified controller context and binding context.
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="bindingContext">The binding context.</param>
        /// <returns>The bound value.</returns>
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            return bindingContext.ValueProvider.GetValue("model").RawValue as ValidationHelp;
        }

        #endregion
    }
}