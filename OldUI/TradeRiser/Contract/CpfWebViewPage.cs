namespace TradeRiser.UI
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Web;
    using TradeRiser.Core.Director;

    /// <summary>
    /// Cpf Web View Page.
    /// </summary>
    [SuppressMessage("Microsoft.StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Generic version of the same class")]
    public abstract class CpfWebViewPage : System.Web.Mvc.WebViewPage
    {
        /// <summary>
        /// Gets or sets the director.
        /// </summary>
        /// <value>The director.</value>
        public IDirector Director { get; set; }

        /// <summary>
        /// Initializes the <see cref="T:System.Web.Mvc.AjaxHelper"/>, <see cref="T:System.Web.Mvc.HtmlHelper"/>, and <see cref="T:System.Web.Mvc.UrlHelper"/> classes.
        /// </summary>
        public override void InitHelpers()
        {
            base.InitHelpers();
            this.Director = (IDirector)this.ViewBag.Director;
        }
    }

    /// <summary>
    /// Cpf Web View Page.
    /// </summary>
    /// <typeparam name="T">Generic Model.</typeparam>
    [SuppressMessage("Microsoft.StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Generic version of the same class")]
    public abstract class CpfWebViewPage<T> : System.Web.Mvc.WebViewPage<T>
    {
        /// <summary>
        /// Gets or sets the director.
        /// </summary>
        /// <value>The director.</value>
        public IDirector Director { get; set; }

        /// <summary>
        /// Inits the helpers.
        /// </summary>
        public override void InitHelpers()
        {
            base.InitHelpers();
            this.Director = (IDirector)this.ViewBag.Director;
        }
    }
}