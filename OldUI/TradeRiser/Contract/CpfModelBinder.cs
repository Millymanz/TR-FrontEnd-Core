using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TradeRiser.Core.Director;
using TradeRiser.Core.Membership;
using TradeRiser.UI.Security;
using TradeRiser.Core.Common;
namespace TradeRiser.UI
{
    public class CpfModelBinder : IModelBinder
    {
        #region private fields

        /// <summary>
        /// The binding context value provider.
        /// </summary>
        private IValueProvider provider;

        private IAuthenticator authenticator;

        private ControllerContext controllerContext;

        #endregion private fields

        #region properties

        /// <summary>
        /// Gets or sets the current director.
        /// </summary>
        /// <value>The director.</value>
        public IDirector Director
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the authenticator.
        /// </summary>
        /// <value>The authenticator.</value>
        public IAuthenticator Authenticator
        {
            get
            {
                if (this.authenticator == null)
                {
                    this.authenticator = new Authenticator(this.Director, new CookieManager(this.controllerContext.RequestContext.HttpContext.Request.Cookies, this.controllerContext.RequestContext.HttpContext.Response.Cookies, this.Director));
                }

                return this.authenticator;
            }
            set
            {
                this.authenticator = value;
            }
        }

        #endregion properties

        #region public methods

        /// <summary>
        /// Binds the model to a value by using the specified controller context and binding context.
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="bindingContext">The binding context.</param>
        /// <returns>The bound value.</returns>
        public virtual object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            this.controllerContext = controllerContext;

            CpfController controller = controllerContext.Controller as CpfController;

            if (controller == null)
            {
                throw new ArgumentException(string.Format("Unexpected controller type '{0}'. Controller must inherit from CpfController.", controllerContext.Controller.GetType().Name));
            }

            this.Director = controller.Director;
            this.provider = bindingContext.ValueProvider;
            this.Authenticator.Authenticate(controllerContext.RequestContext.HttpContext.Request.CurrentExecutionFilePath);

            return null;
        }

        /// <summary>
        /// Gets the raw value form the binding context.
        /// </summary>
        /// <param name="key">The key.</param>
        /// <returns></returns>
        public object GetRaw(string key)
        {
            ValueProviderResult value = this.provider.GetValue(key);

            if (value != null)
            {
                return value.RawValue;
            }

            return null;
        }

        /// <summary>
        /// Gets the specified value from the binding context.
        /// </summary>
        /// <param name="key">The key.</param>
        public string Get(string key)
        {
            return this.Get<string>(key, string.Empty);
        }

        /// <summary>
        /// Gets the specified value from the binding context.
        /// </summary>
        /// <typeparam name="T">The type to return as.</typeparam>
        /// <param name="key">The key.</param>
        /// <param name="defaultValue">The default value.</param>
        public T Get<T>(string key, T defaultValue)
        {
            ValueProviderResult value = this.provider.GetValue(key);

            if (value != null)
            {
                return TypeConverter.ChangeType<T>(value.AttemptedValue, defaultValue);
            }

            return defaultValue;
        }

        #endregion public methods
    }
}