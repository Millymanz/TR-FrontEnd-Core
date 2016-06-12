using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.UI;
using TradeRiser.Core;
using TradeRiser.Core.Common;
using TradeRiser.Core.Director;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Membership;
using TradeRiser.UI.Attributes;
using TradeRiser.UI.Security;
//using TradeRiser.Core.Director;
//using TradeRiser.Core.Logging;
//using TradeRiser.Core.Membership;

namespace TradeRiser.UI
{
    public class CpfController : Controller
    {
        // The unprotected actions.
        /// </summary>
        private static readonly string[] unprotectedActions = {
            "logon", "forgotpassword", "changepassword", "vault", "signup", "registersave"
        };

        #region  Fields

        private readonly string[] installedLanguages = null;

        /// <summary>
        /// The current authenticator.
        /// </summary>
        private IAuthenticator authenticator;

        /// <summary>
        /// Installed languages.
        /// </summary>
        private Dictionary<string, string> languages;

        /// <summary>
        /// True if the licence has been checked, otherwise false.
        /// </summary>
        private bool licenceChecked;

        #endregion

        #region  Properties and Indexers

        /// <summary>
        /// Gets the authenticator.
        /// </summary>
        /// <value>The authenticator.</value>
        public IAuthenticator Authenticator
        {
            get { return this.authenticator ?? (this.authenticator = new Authenticator(this.Director, this.Cookie)); }
        }

        /// <summary>
        /// Gets or sets the cookie manager.
        /// </summary>
        /// <value>The cookie manager.</value>
        public CookieManager Cookie { get; set; }

        /// <summary>
        /// Gets or sets the last activity.
        /// </summary>
        public DateTime LastActivity { get; set; }

        /// <summary>
        /// Gets or sets the director.
        /// </summary>
        /// <value>The director.</value>
        public IDirector Director { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="T:System.Web.HttpRequestBase"/> object for the current HTTP request.
        /// New implementation to enable better unit testing.
        /// </summary>
        /// <value></value>
        /// <returns>The request object.</returns>
        public new HttpRequestBase Request
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the <see cref="T:System.Web.HttpResponseBase"/> object for the current HTTP response.
        /// New implementation to enable better unit testing.
        /// </summary>
        /// <value></value>
        /// <returns>The response object.</returns>
        public new HttpResponseBase Response
        {
            get;
            set;
        }

        ///// <summary>
        ///// Gets the languages.
        ///// </summary>
        //public Dictionary<string, string> Languages
        //{
        //    get
        //    {
        //        if (this.languages == null)
        //        {
        //            this.languages = new Dictionary<string, string>();
        //            string[] languageList = this.InstalledLanguages;
        //            foreach (string languageItem in languageList)
        //            {
        //                CultureInfo cultureInfo = new CultureInfo(languageItem);
        //                this.languages.Add(languageItem, cultureInfo.NativeName);
        //            }
        //        }

        //        return this.languages;
        //    }
        //}

        /// <summary>
        /// Gets the installed languages.
        /// </summary>
        /// <value>The installed languages.</value>
        internal string[] InstalledLanguages
        {
            get
            {
                if (this.installedLanguages == null)
                {
                    string langueCodeList = this.Director.Configuration.GetConfigItem("Core.InstalledLanguages", "en-GB");
                    return langueCodeList.Split(';');
                }

                return this.installedLanguages;
            }
        }

        /// <summary>
        /// Gets the default language code for this installataion.
        /// </summary>
        /// <value>The default language code.</value>
        public string DefaultLanguageCode
        {
            get
            {
                return this.Director.Configuration.GetConfigItem("Core.DefaultLanguage", "en-GB");
            }
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Render PartialView and return string.
        /// </summary>
        /// <param name="partialViewName">Partial name of the view.</param>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        public virtual string RenderPartialToString(string partialViewName, object model)
        {
            return this.RenderPartialToStringMethod(partialViewName, model);
        }

        /// <summary>
        /// render PartialView and return string
        /// </summary>
        /// <param name="partialViewName">Partial name of the view.</param>
        /// <param name="viewData">The view data.</param>
        /// <param name="tempData">The temporary data.</param>
        /// <returns></returns>
        public string RenderPartialToString(string partialViewName, ViewDataDictionary viewData, TempDataDictionary tempData)
        {
            return this.RenderPartialToStringMethod(partialViewName, viewData, tempData);
        }

        /// <summary>
        /// Renders the partial to string method.
        /// </summary>
        /// <param name="partialViewName">Partial name of the view.</param>
        /// <param name="viewData">The view data.</param>
        /// <param name="tempData">The temp data.</param>
        /// <returns></returns>
        public string RenderPartialToStringMethod(string partialViewName, ViewDataDictionary viewData, TempDataDictionary tempData)
        {
            ViewEngineResult result = ViewEngines.Engines.FindPartialView(this.ControllerContext, partialViewName);

            if (result.View != null)
            {
                StringBuilder sb = new StringBuilder();
                using (StringWriter sw = new StringWriter(sb))
                {
                    using (HtmlTextWriter output = new HtmlTextWriter(sw))
                    {
                        viewData.Add(new KeyValuePair<string, object>("Director", this.Director));
                        ViewContext viewContext = new ViewContext(this.ControllerContext, result.View, viewData, tempData, output);

                        //Stopwatch timer = new Stopwatch();
                        //timer.Start();
                        result.View.Render(viewContext, output);

                        //timer.Stop();

                        if (this.ControllerContext.HttpContext.Response.StatusCode == 500)
                        {
                            Exception ex = new Exception("Failed to load view: " + partialViewName);
                            ex.Data.Add("view", partialViewName);
                            ex.Data.Add("errorDetails", this.ControllerContext.HttpContext.Response.StatusDescription);
                            ex.Data.Add("controller", this.ControllerContext.Controller.GetType());
                            throw ex;
                        }
                    }
                }

                return sb.ToString();
            }
            return string.Empty;
        }

        /// <summary>
        /// Renders the partial to string method.
        /// </summary>
        /// <param name="partialViewName">Partial name of the view.</param>
        /// <param name="model">The model.</param>
        /// <returns></returns>
        public string RenderPartialToStringMethod(string partialViewName, object model)
        {
            ViewDataDictionary viewData = new ViewDataDictionary(model);
            TempDataDictionary tempData = new TempDataDictionary();
            return this.RenderPartialToStringMethod(partialViewName, viewData, tempData);
        }

        /// <summary>
        /// Initializes the culture.
        /// </summary>
        /// <param name="requestContext">The request context.</param>
        public void InitialiseCulture(RequestContext requestContext)
        {
            string languageCode = null;

            // do we have a language code in the cookie?
            string languageFromCookie = this.Cookie.Get(CoreConstants.CookieLanguageCode, string.Empty);

            // have we just requested a language change?
            if (this.Director.Request.Querystring.Get<string>("lc") != null)
            {
                languageCode = this.Director.Request.Querystring.Get<string>("lc");
            }
            else if (!string.IsNullOrEmpty(languageFromCookie))
            {
                languageCode = languageFromCookie;
            }
            else
            {
                 if (requestContext.HttpContext.Request.UserLanguages != null && requestContext.HttpContext.Request.UserLanguages.Length > 0)
                {
                    // if not, ask the browser
                    if (this.Request != null && this.Request.UserLanguages != null)
                    {
                        foreach (string preferredLanguage in this.Request.UserLanguages)
                        {
                            string code = preferredLanguage.Contains(';') ? preferredLanguage.Substring(0, preferredLanguage.IndexOf(';')) : preferredLanguage;

                            if (this.InstalledLanguages.Contains(code))
                            {
                                languageCode = code;
                                break;
                            }
                        }
                    }
                }

                // now write it back to the cookie for next time
                requestContext.HttpContext.Response.Cookies.Add(new HttpCookie(CoreConstants.CookieLanguageCode, languageCode));
            }

            string cultureName = null;
            if (languageCode != null)
            {
                // is the language we now have installed on this system?
                if (this.InstalledLanguages.Contains(languageCode))
                {
                    cultureName = languageCode;
                    this.Cookie.Set(CoreConstants.CookieLanguageCode, languageCode);
                }
                else
                {
                    cultureName = this.DefaultLanguageCode;
                    this.Cookie.Set(CoreConstants.CookieLanguageCode, cultureName);
                }
            }
            else
            {
                // look up defaultCultureCode
                cultureName = this.DefaultLanguageCode;
                this.Cookie.Set(CoreConstants.CookieLanguageCode, cultureName);
            }

            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(cultureName);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(cultureName);
            this.Director.CultureCode = cultureName;
           // this.Director.User.LanguageCode = languageCode;

            this.ViewBag.CurrentCulture = cultureName;
            this.ViewBag.InstalledLanguages = this.InstalledLanguages;
        }

        #endregion

        #region  Private Methods

        private void EvaluateQueryStringOptions()
        {
            this.ViewBag.HideChrome = this.Director.Querystring("hidechrome", false);
            // displaying debugger tools
            this.ViewBag.EnableDebug = this.Director.Querystring("debug", false);
        }

        /// <summary>
        /// Gets the request protection from attribytes, urls and routes.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        private bool GetRequestProtection(ActionExecutingContext filterContext)
        {
            bool allowUnprotected = false;
            bool isProtected = true;

            // if not log on page or img, css or js, let's check the web.config to see if this server allows the use of the UnprotectedAttribute
            // bool skip = this.Director.Request.Url.ToString().Contains("logon") || this.Request.FilePath.Contains(".js") || this.Request.FilePath.Contains(".png") || this.Request.FilePath.Contains(".css");
            //if (this.Director.Request.Url.ToString().ToLower().Contains("logon") || this.Director.Request.Url.ToString().ToLower().Contains("forgotpassword") || this.Director.Request.Url.ToString().ToLower().Contains("changepassword"))
            string url = this.Director.Request.Url.ToString().ToLower();
            if (CpfController.unprotectedActions.Any(unprotectedAction => url.Contains(unprotectedAction)))
            {
                return false;
            }

            if (ConfigurationManager.AppSettings["AllowAnonymous"] != null)
            {
                if (ConfigurationManager.AppSettings["AllowAnonymous"].Equals("true"))
                {
                    allowUnprotected = true;
                }
            }

            // check to see if the UnprotectedAttribute has been applied to the controller or the action
            bool forceUnprotected = false;
            object unprotectedAttribute = this.GetType().GetCustomAttributes(typeof(UnprotectedAttribute), true).FirstOrDefault() ?? filterContext.ActionDescriptor.GetCustomAttributes(typeof(UnprotectedAttribute), true).FirstOrDefault();

            UnprotectedAttribute attribute = unprotectedAttribute as UnprotectedAttribute;
            if (attribute != null)
            {
                forceUnprotected = attribute.Force;
            }

            // only look for UnprotectedAttribute if the web.config says we can allow it
            if (allowUnprotected || forceUnprotected)
            {
                if (unprotectedAttribute != null)
                {
                    isProtected = false;
                }
                else
                {
                    // nothing on the controller, lets check the action too
                    isProtected = filterContext.ActionDescriptor.GetCustomAttributes(typeof(UnprotectedAttribute), false).Count() < 1;
                }
            }

            return isProtected;
        }

        /// <summary>
        /// Authorizes the permission.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        /// <returns></returns>
        private bool AuthorizePermission(ActionExecutingContext filterContext)
        {
            bool isAuthorized = true;
            object attribute = this.GetType().GetCustomAttributes(typeof(AuthorisedPermissionAttribute), true).FirstOrDefault();
            if (attribute != null)
            {
                AuthorisedPermissionAttribute permissionAttribute = attribute as AuthorisedPermissionAttribute;
                isAuthorized = permissionAttribute.Authorize(this.Director);
                filterContext.Controller.ViewBag.ApplicationName = permissionAttribute.ApplicationName;
            }

            object actionAttribute = filterContext.ActionDescriptor.GetCustomAttributes(typeof(AuthorisedPermissionAttribute), false).FirstOrDefault();
            if (actionAttribute != null)
            {
                AuthorisedPermissionAttribute permissionAttribute = actionAttribute as AuthorisedPermissionAttribute;
                bool actionIsAuthorized = permissionAttribute.Authorize(this.Director);
                isAuthorized = isAuthorized && actionIsAuthorized;

                filterContext.Controller.ViewBag.ApplicationName = permissionAttribute.ApplicationName;
            }

            if (attribute == null && actionAttribute == null)
            {
                isAuthorized = true;
            }

            return isAuthorized;
        }

        /// <summary>
        /// Return a redirect result for invalid logins.
        /// </summary>
        /// <param name="code">The login code.</param>
        private RedirectResult LogoffUser(LoginPageInfoCode code)
        {
            string url = this.Request.RawUrl.Replace("&", "%26");
            return new RedirectResult(string.Format("{0}core/logon?i={1}&url={2}", this.Director.ApplicationPath, (int)code, url));
        }    

        /// <summary>
        /// Hydrates the director ensuring properties like the request descriptor.
        /// </summary>
        private void HydrateDirector()
        {
            if (this.RouteData != null)
            {
                this.Director.Request = new RequestDescriptor(this.Request);
            }
        }

        /// <summary>
        /// Determines whether the  licence is valid.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        private bool IsValidLicence(ActionExecutingContext filterContext)
        {
            if (!this.licenceChecked)
            {
                this.licenceChecked = true;

                //MemoryVaultManager vault = new MemoryVaultManager();
                //object lisenced = vault.Get("Licence");
                //if (lisenced == null)
                //{
                //    try
                //    {
                //        LicenceConfig.Start(HostingEnvironment.ApplicationPhysicalPath);
                //        vault.Add("Licence", true, TimeSpan.FromHours(1));
                //    }
                //    catch (Exception ex)
                //    {
                //        ContentResult licError = new ContentResult();
                //        licError.ContentType = "text/html";
                //        licError.Content = string.Format("<style>body {{ font-family: open_sans, Tahoma, Verdana; font-size: 13px; font-style: normal; letter-spacing: 0.03em; }}</style><h1>TradeRiser</h1><p>{0}</p>", ex.Message);
                //        filterContext.Result = licError;
                //        return false;
                //    }
                //}
            }

            return true;
        }

        #endregion

        /// <summary>
        /// Initializes data that might not be available when the constructor is called.
        /// </summary>
        /// <param name="requestContext">The HTTP context and route data.</param>
        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);

            if (this.Request == null)
            {
                this.Request = base.Request;
            }

            if (this.Response == null)
            {
                this.Response = base.Response;
            }

            if (this.Director == null)
            {
                this.Director = new Director(); ;
            }

            this.HydrateDirector();
        }

        /// <summary>
        /// Called when an unhandled exception occurs in the action.
        /// </summary>
        /// <param name="filterContext">Information about the current request and action.</param>
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
            ErrorDetails error = new ErrorDetails
            {
                Exception = filterContext.Exception,
                ErrorType = ErrorType.Error,
                ShowDetails = this.Director.Configuration.GetConfigItem("Core.FullErrorDetails", false)
            };

            if (filterContext.Exception.InnerException != null && filterContext.Exception is AggregateException)
            {
                error.Exception = filterContext.Exception.InnerException;
            }

            bool isAjax = filterContext.HttpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest";
            bool logAsWarning = false;

            if (filterContext.Exception is PermissionException)
            {
                filterContext.Result = this.View("~/views/shared/PermissionError.cshtml", error);
                logAsWarning = true;
            }
            else if (isAjax)
            {
                Alert alert = new Alert
                {
                    Type = AlertType.Error,
                    Message = filterContext.Exception.Message
                };

                string statusDescription = filterContext.Exception.Message;
                if (statusDescription.Length > 100)
                {
                    statusDescription = statusDescription.Substring(0, 100);
                }

                filterContext.HttpContext.Response.StatusDescription = statusDescription;

                ResultBag resultBag = new ResultBag(alert, false, filterContext.Exception.Message, true, new { stackTrace = filterContext.Exception.StackTrace });
                JsonActionResult exceptionResult = new JsonActionResult(resultBag);
                filterContext.Result = exceptionResult;
            }
            else if (filterContext.IsChildAction)
            {
              //  filterContext.Result = this.View("~/views/shared/_ErrorDetails.cshtml", error);
                filterContext.Result = this.View("~/views/shared/_ErrorDetails.cshtml");
            }
            else
            {
              //  filterContext.Result = this.View("~/views/shared/Error.cshtml", error);
                filterContext.Result = this.View("~/views/shared/Error.cshtml");
            }

            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.Clear();

            // set status code 500 when it is ajax or it is not child request
            if (!filterContext.IsChildAction || isAjax)
            {
                filterContext.HttpContext.Response.StatusCode = 500;
            }

            filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;


            string component = filterContext.Controller.ToString().Substring(0, filterContext.Controller.ToString().LastIndexOf("."));
            string sender = filterContext.Controller.ToString().Substring(filterContext.Controller.ToString().LastIndexOf(".") + 1);
            if (this.Director.User != null)
            {
                if (logAsWarning)
                {
                    Log.Warning(component, sender, filterContext.Exception.Message, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                }
                else
                {
                    Log.Exception(component, sender, filterContext.Exception, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                }
            }
            else
            {
                if (logAsWarning)
                {
                    Log.Warning(component, sender, filterContext.Exception.Message);
                }
                else
                {
                    Log.Exception(component, sender, filterContext.Exception);
                }
            }
        }

        /// <summary>
        /// Called before the action method is invoked.
        /// </summary>
        /// <param name="filterContext">Information about the current request and action.</param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // check the licence.
            if (this.ControllerContext.IsChildAction == false)
            {
                if (this.IsValidLicence(filterContext) == false)
                {
                    return;
                }
            }

            base.OnActionExecuting(filterContext);
            bool skipAppAuthorization = false;

            RequestContext requestContext = filterContext.RequestContext;

            this.Director.ApplicationPath = filterContext.RequestContext.HttpContext.Request.ApplicationPath;
            if (!this.Director.ApplicationPath.EndsWith("/"))
            {
                this.Director.ApplicationPath += "/";
            }

            // if this is a child action, take the values from the parent and finish up
            if (this.ControllerContext.IsChildAction)
            {
                this.Director = ((CpfController)filterContext.ParentActionViewContext.Controller).Director;
                this.ViewBag.Director = this.Director;

                //this.ViewBag.IsProtected = isProtected;
                return;
            }

            // used to check for options that maybe specified on the querystring to control the page.
            this.EvaluateQueryStringOptions();

            bool isProtected = this.GetRequestProtection(filterContext);

            this.ViewBag.IsProtected = isProtected;
            this.ViewBag.Director = this.Director;

            this.Cookie = new CookieManager(requestContext.HttpContext.Request.Cookies, requestContext.HttpContext.Response.Cookies, this.Director);

            if (this.Cookie != null)
            {
                string cookieValue = this.Cookie.Get(CoreConstants.CookieName, string.Empty);
                if (!string.IsNullOrEmpty(cookieValue))
                {
                    try
                    {
                        FormsAuthenticationTicket fat = FormsAuthentication.Decrypt(cookieValue);
                        if (fat != null)
                        {
                            this.LastActivity = fat.IssueDate.ToUniversalTime();
                        }
                    }
                    catch (CryptographicException)
                    {
                    }
                }
            }

            string action = string.Empty;

            if (this.Url != null)
            {
                action = this.Url.RequestContext.RouteData.Values["action"].ToString();
            }

            try
            {
                // try to authenticate the user anyway, even if it is an unproteced page
                LoginPageInfoCode authentication = this.Authenticator.Authenticate(requestContext.HttpContext.Request.CurrentExecutionFilePath);
                ////this.ViewBag.Director = this.Director;
                // if it's all OK, or we are unprotected
                if (authentication == LoginPageInfoCode.Successful || !isProtected)
                {
                    this.ViewBag.Director = this.Director;
                    this.ViewBag.AppName = this.Director.Configuration.GetConfigItem("Core.Branding.ProductName", "TradeRiser");

                    if (isProtected)
                    {
                        // check for change password
                        if (this.Director.User.ChangePassword)
                        {
                            skipAppAuthorization = true;

                            // check if we are already on the password page. if not redirect to it.
                            if (string.IsNullOrWhiteSpace(action) || (action.ToLower() != "changepassword" && action.ToLower() != "logoff" && !this.ControllerContext.IsChildAction && (action.ToLower() != "password" && filterContext.HttpContext.Request.Headers["X-Requested-With"] != "XMLHttpRequest")))
                            {
                                filterContext.Result = new RedirectResult(this.Director.ApplicationPath + "user/changepassword?i=" + this.Url.Encode(this.Director.ApplicationRelativeUrl));
                            }
                        }
                    }
                }

                // if something is up and we are protected
                if (authentication != LoginPageInfoCode.Successful && isProtected)
                {
                    skipAppAuthorization = true;
                    filterContext.Result = this.LogoffUser(authentication);
                }
            }
            catch (Exception logonEx)
            {
                Log.Exception("Core", "CpfController.OnActionExecuting", logonEx);
                filterContext.Result = this.LogoffUser(LoginPageInfoCode.NotAuthenticated);
            }

            this.ViewBag.Version = this.Director.Configuration.GetConfigItem("Core.ApplicationVersion", "0.0.0.0");
            //this.Director.BuildVersion = this.Director.Configuration.GetConfigItem("Core.ApplicationVersion", "0.0.0.0");
            this.InitialiseCulture(requestContext);

            if (!skipAppAuthorization)
            {
                bool authorizedToApplication = this.AuthorizePermission(filterContext);
                if (authorizedToApplication == false)
                {
                    filterContext.Result = new RedirectResult(this.Director.ApplicationPath + "core/nopermissions");
                }
            }
        }
    }
}
