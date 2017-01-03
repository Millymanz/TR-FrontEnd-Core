using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using TradeRiser.Core.Director;
using TradeRiser.Core.Membership;
using TradeRiser.UI.Security;


namespace TradeRiser.UI
{
    /// <summary>
    /// Manage browsers cookie.
    /// </summary>
    public class CookieManager
    {
        #region private fields

        /// <summary>
        /// The current director.
        /// </summary>
        private IDirector director;

        /// <summary>
        /// The http request cookies.
        /// </summary>
        private HttpCookieCollection requestCookies;

        /// <summary>
        /// The http response cookies.
        /// </summary>
        private HttpCookieCollection responseCookies;

        #endregion private fields

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="CookieManager"/> class.
        /// </summary>
        /// <param name="request">The request cookies.</param>
        /// <param name="response">The response cookies.</param>
        /// <param name="director">The director.</param>
        public CookieManager(HttpCookieCollection request, HttpCookieCollection response, IDirector director)
        {
            this.requestCookies = request;
            this.responseCookies = response;
            this.director = director;
        }

        #endregion constructors

        #region public methods

        /// <summary>
        /// Gets the remember me value.
        /// </summary>
        public string GetRememberMe()
        {
            string username = string.Empty;
            string rememberMeEncrypted = this.Get(CoreConstants.CookieRememberMe, string.Empty);
            if (!string.IsNullOrEmpty(rememberMeEncrypted))
            {
                try
                {
                    LosFormatter los = new LosFormatter();
                    string unformatted = los.Deserialize(rememberMeEncrypted).ToString();

                    // make new cookie to read deserialised values
                    HttpCookie read = new HttpCookie("read", unformatted);
                    username = read.Values["x"];
                }
                catch (Exception)
                {
                    // any error, clear the cookie and continue
                    this.ClearRememberMe();
                }
            }

            return username;
        }

        /// <summary>
        /// Clears the remember me cookie.
        /// </summary>
        public void ClearRememberMe()
        {
            HttpCookie remember = this.requestCookies[CoreConstants.CookieRememberMe];
            if (remember != null)
            {
                remember.Value = string.Empty;
                remember.Expires = DateTime.MinValue;
                this.responseCookies.Add(remember);
            }
        }

        /// <summary>
        /// Gets the specified cookie.
        /// </summary>
        /// <param name="name">The cookie name.</param>
        /// <param name="defaultValue">The default value.</param>
        public string Get(string name, string defaultValue = null)
        {
            HttpCookie cookie = this.requestCookies[name];
            string value = defaultValue;
            if (cookie != null)
            {
                value = cookie.Value;
            }

            return value;
        }

        /// <summary>
        /// Adds a cookie.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="value">The value.</param>
        /// <param name="expires">The expiry date.</param>
        public void Set(string name, string value, DateTime? expires = null)
        {
            if (this.responseCookies[name] != null)
            {
                this.responseCookies.Remove(name);
            }

            HttpCookie cookie = new HttpCookie(name);
            cookie.Value = value;

            if (expires.HasValue)
            {
                cookie.Expires = expires.Value;
            }

            this.responseCookies.Add(cookie);
        }

        /// <summary>
        /// Sets the authentication cookie.
        /// </summary>
        /// <param name="user">The user.</param>
        public void SetAuthenticationCookie(User user)
        {
            this.SetAuthenticationCookie(user, null);
        }

        public void SetAuthenticationCookie(User user, string domain)
        {
            this.SetAuthenticationCookie(user, domain, DateTime.UtcNow);
        }

        /// <summary>
        /// Sets the authentication cookie.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="domain">The domain.</param>
        /// <param name="formsAuthTicketIssueDate">The forms authentication ticket issue date. If specified this value will be used for the issue date else the currect datetime.</param>
        public void SetAuthenticationCookie(User user, string domain, DateTime formsAuthTicketIssueDate)
        {
            int logOnTimeoutMinutes = this.director.Configuration.GetConfigItem<int>("Core.LogOnTimeoutMinutes", 30);
            bool persistCookie = this.director.Configuration.GetConfigItem<bool>("Core.PersistCookie", false);
            int cookieExpiryHours = this.director.Configuration.GetConfigItem<int>("Core.CookieExpiryHours", 8);
            bool enableSecureCookie = this.director.Configuration.GetConfigItem<bool>("Core.EnableSecureCookie", false);
            string SecurityModeConfig = this.director.Configuration.GetConfigItem<string>("Core.SecurityMode", "Forms");

            string cookiePath = this.director.Configuration.GetConfigItem<string>("Core.CookiePath", "/");

            if (string.IsNullOrWhiteSpace(domain))
            {
                domain = this.director.Configuration.GetConfigItem<string>("HSO.Domain", "TradeRiser");
            }

            HttpCookie cookie = new HttpCookie(CoreConstants.CookieName);

            CpfFatInfo fatInfo = new CpfFatInfo();
            fatInfo.UserId = this.director.User.UserID;
            fatInfo.UserName = this.director.User.UserName;
            fatInfo.Domain = domain;
            fatInfo.SecurityMode = (SecurityMode)Enum.Parse(typeof(SecurityMode), SecurityModeConfig);

            FormsAuthenticationTicket fat = new FormsAuthenticationTicket(
                4,
                user.UserName,
                formsAuthTicketIssueDate,
                DateTime.UtcNow.AddMinutes(logOnTimeoutMinutes),
                persistCookie,
                fatInfo.ToString(),
                cookiePath);

            cookie.Value = FormsAuthentication.Encrypt(fat);

            if (cookieExpiryHours > 0 && persistCookie)
            {
                cookie.Expires = DateTime.UtcNow.AddHours(cookieExpiryHours);
            }

            cookie.Secure = enableSecureCookie;

            if (this.responseCookies[CoreConstants.CookieName] != null)
            {
                this.responseCookies.Remove(CoreConstants.CookieName);
            }

            this.responseCookies.Add(cookie);
            //this.Set(CoreConstants.CookieLanguageCode, user.LanguageCode);
        }

        /// <summary>
        /// Sets the remember me cookie.
        /// </summary>
        /// <param name="username">The username.</param>
        /// <param name="password">The password.</param>
        public void SetRememberMe(string username, string password)
        {
            HttpCookie remember = new HttpCookie(CoreConstants.CookieRememberMe);
            remember.Values.Add("x", username);
            remember.Expires = DateTime.UtcNow.AddDays(365);

            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb, CultureInfo.CurrentCulture);
            LosFormatter los = new LosFormatter();
            los.Serialize(sw, remember.Value);

            remember.Value = sb.ToString();

            this.responseCookies.Add(remember);
        }

        #endregion public methods

        #region internal methods

        /// <summary>
        /// Logs the the user by removing cookies.
        /// </summary>
        public void LogOff()
        {
            if (this.responseCookies[CoreConstants.CookieName] != null)
            {
                this.responseCookies[CoreConstants.CookieName].Value = string.Empty;
                this.responseCookies[CoreConstants.CookieName].Expires = DateTime.MinValue;
            }
        }

        #endregion internal methods
    }
}