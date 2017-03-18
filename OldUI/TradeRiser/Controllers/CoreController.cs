using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Util;
using TradeRiser.Core.Data;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Membership;
using TradeRiser.Core.SignOn;
using TradeRiser.UI.Attributes;
using TradeRiser.UI.Models;
using TradeRiser.UI.Security;

namespace TradeRiser.UI.Controllers
{
  //  [RouteArea("cpf")]
    //[Route("core/{action}")]
    public class CoreController : CpfController
    {
        /// <summary>
        /// Log component string.
        /// </summary>
        private const string COMPONENT = "CPF";

        /// <summary>
        /// Log sender string.
        /// </summary>
        private const string SENDER = "CoreController";

        #region  Fields

        #endregion

        #region  Properties and Indexers

        public IDataAccess DataAccess
        {
            get { return new DataAccess(this.Director); }
        }

        

     
        #endregion

        #region  Public Methods

        /// <summary>
        /// Tests the translate.
        /// </summary>
        /// <returns></returns>
        public ActionResult TestTranslate()
        {
            return this.View();
        }

          /// <summary>
        /// Action for the inactivity timer to call to keep cookies alive.
        /// </summary>
        public JsonResult TimerStep()
        {
            this.ViewBag.Layout = null;
            return this.Json(true);
        }

        public JsonResult PromptBoxIsInactive()
        {
            this.ViewBag.Layout = null;

            int logOffPromptMinutes = this.Director.Configuration.GetConfigItem("Core.LogOffPromptMinutes", 50);
            // int thoughtFlowSaveDelayMinutes = this.Director.Configuration.GetConfigItem<int>("ThoughtFlow.SaveDelayInMinutes", 1);

            DateTime now = DateTime.UtcNow;

            // thoughtflow save happens after the page has loaded, add this time delay to the prompt date.
            // Added extra 30 secs in case of slow networks.
            // NOTE - If delay is set too high, new activity may not be detected (thoughtFlowSaveDelayMinutes = number of minutes new activity not counted).
            DateTime promptDateTime = now.AddMinutes(-logOffPromptMinutes); //.AddMinutes(thoughtFlowSaveDelayMinutes).AddSeconds(30);

            if (this.LastActivity != DateTime.MinValue && this.LastActivity > promptDateTime)
            {
                return this.Json(false);
            }

            return this.Json(true);
        }

        /////// <summary>
        /////// The account view.
        /////// </summary>
        ////[AcceptVerbs(HttpVerbs.Get)]
        ////public ActionResult Account()
        ////{
        ////    User user = this.Director.Membership.GetUserByID(this.Director.User.UserID);

        ////    if (user == null)
        ////    {
        ////        throw new Exception(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID));
        ////    }

        ////    UserModel model = new UserModel
        ////    {
        ////        FirstName = user.FirstName,
        ////        LastName = user.LastName,
        ////        EmailAddress = user.Email,
        ////        Phone1 = user.Phone1,
        ////        Phone2 = user.Phone2,
        ////        TimeZone = user.TimeZone
        ////    };

        ////    return this.View(model);
        ////}

        [AcceptVerbs(HttpVerbs.Get), Unprotected(true)]
        public JsonActionResult SwitchCulture()
        {
            return new JsonActionResult(true, true);
        }

        /// <summary>
        /// PDFs the test.
        /// </summary>
        /// <returns>Pdf view.</returns>
        public ViewResult PdfTest()
        {
            return this.View();
        }

        ///// <summary>
        ///// Returns a PDF rendering of the specified url in the settings.
        ///// </summary>
        ///// <param name="settings">The settings.</param>
        //[Unprotected]
        //public ActionResult Pdf(PdfSettings settings)
        //{
        //    //TODO: UPDATE TO USE NEW RENDERISER

        //    //int startIndex = settings.Url.IndexOf(this.Director.ApplicationPath);
        //    //if (startIndex > 0)
        //    //{
        //    //    string url = settings.Url.Substring(startIndex);
        //    //    string machineName = Environment.MachineName;
        //    //    settings.Url = string.Format("{0}{1}", machineName, url);
        //    //}

        //    //                        IPdfGenerator pdf = PdfFactory.GetGenerator(this.Response.Cookies);
        //    //            byte[] pdfbytes = pdf.Generate(settings, this.Director.CultureCode);

        //    //this.ViewBag.Layout = null;
        //    return RedirectToAction("RenderToFile", "Renderer", new { area = "Render", url = settings.Url, impersonate = settings.Impersonate, delay = settings.Delay, fileName = settings.FileName, format = "Pdf" });
        //    //return this.File(pdfbytes, "application/pdf", settings.FileName);
        //}

        /// <summary>
        /// Details this instance.
        /// </summary>
        /// <returns>View result.</returns>
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult Password()
        {
            User user = this.Director.Membership.GetUserByID(this.Director.User.UserID);

            if (user == null)
            {
                throw new Exception(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID));
            }

            ViewBag.PolicyMessage = this.Director.Membership.BuildPasswordCreationPolicyMessage();
            return this.View();
        }

        /// <summary>
        /// Preferences this instance.
        /// </summary>
        /// <returns>View result.</returns>
        public ActionResult Preferences()
        {
            return this.View();
        }

        ///// <summary>
        ///// The export ribbon buttons for an object.
        ///// </summary>
        ///// <param name="virtualFilePath">The virtual file path.</param>
        ///// <param name="targetRepoObject">The target application object that may require a permission check.</param>
        ///// <returns></returns>
        //[Unprotected]
        //public PartialViewResult Export(string virtualFilePath, RepoIdentifier targetRepoObject)
        //{
        //    // get the export definition application object
        //    RepoFile exportObj = this.Director.Repo.GetFile(virtualFilePath);

        //    if (exportObj == null)
        //    {
        //        string message = string.Format("Could not find repository file at specified path {0}.", targetRepoObject);
        //        ArgumentException ex = new ArgumentException(message);
        //        Log.Exception("CoreController", "Export", ex);
        //        throw ex;
        //    }

        //    // make an exports object to use a the view model
        //    Exports exports = Exports.Load(exportObj, this.Director, targetRepoObject);

        //    return this.PartialView("~/core/views/core/export.cshtml", exports);
        //}

       
        /// <summary>
        /// Default action returns the portal.
        /// </summary>
        /// <returns>View result.</returns>
        public ActionResult Index()
        {
            return this.RedirectToAction("Index", "App");
        }

        /// <summary>
        /// The logoff view.
        /// </summary>
        /// <returns>Logon page.</returns>
        public ActionResult Logoff()
        {
            new Authenticator(this.Director, this.Cookie).LogOff();
            string returnUrl = this.Director.Request.Querystring.Get<string>("url");

            Log.Audit(CoreConstants.LogComponent, "CoreController.LogOff", string.Format("{0} logged off at {1} ({2} UTC)", this.Director.User.UserName, DateTime.Now, DateTime.UtcNow), userDisplayName: this.Director.User.UserDisplayName);

            return string.IsNullOrWhiteSpace(returnUrl) ? this.RedirectToAction("Logon") : this.RedirectToAction("Logon", new { url = returnUrl });
        }

        /// <summary>
        /// The logon view.
        /// </summary>
        /// <param name="i">The information key for user feedback.</param>
        /// <returns>Logon view.</returns>
        [Unprotected(true)]
        public ActionResult Logon(int? i)
        {
            // check for a remember me cookie
            this.CheckForRememberMe();

            if (i.HasValue)
            {
                int loginFailureID = i.Value;

                LoginPageInfoCode infoCode = (LoginPageInfoCode)loginFailureID;

                switch (infoCode)
                {
                    case LoginPageInfoCode.LoggedOffOk:
                        {
                            this.ViewBag.LogonMessage = TradeRiserUIResource.LoginPageInfoLoggedOff;
                            break;
                        }

                    case LoginPageInfoCode.SessionTimeout:
                        {
                            this.ViewBag.LogonMessage = TradeRiserUIResource.LoginPageInfoSessionTimeout;
                            break;
                        }

                    case LoginPageInfoCode.PasswordReset:
                        {
                            this.ViewBag.LogonMessage = TradeRiserUIResource.LoginPageResetOK;
                            break;
                        }

                    case LoginPageInfoCode.PasswordResetFailed:
                        {
                            this.ViewBag.LogonMessage = string.Format("{0}<br/>{1} {2}", TradeRiserUIResource.LoginPageResetFail, TradeRiserUIResource.LoginPageContactHelpdesk, this.Director.Configuration.GetConfigItem("Core", "HelpDeskContact"));
                            break;
                        }
                }
            }

            // check for a return url
            string returnUrl = this.Director.Request.Querystring.Get<string>("url");

            // don't set return url if url is for logoff or logon
            if (this.CanReturnToThisUrl(returnUrl))
            {
                this.ViewBag.ReturnUrl = returnUrl;
            }

            this.ViewBag.Title = this.Director.Configuration.GetConfigItem<string>("Core.LogonPageTitle");
            this.ViewBag.LegalLink = this.Director.Configuration.GetConfigItem("Core.LegalHyperlinkUrl", "http://www.traderiser.com");
            this.ViewBag.PrivacyLink = this.Director.Configuration.GetConfigItem("Core.PrivacyHyperlinkUrl", "http://www.traderiser.com");
            this.ViewBag.Version = this.Director.Configuration.GetConfigItem("Core.ApplicationVersion", "1.0.0.0");
            
            this.Response.Headers.Add("login", "1");

            SaveUserModel model = new SaveUserModel(null, null)
            {
                IsNewUser = true
            };
            this.ViewBag.Languages = new Dictionary<string, string> { { "en-GB", "en-GB" }, { "en-US", "en-US" } };

            // default to the same as the current user
            model.TimeZone = this.Director.User != null ? this.Director.User.TimeZone : "en-GB";
            model.LanguageCode = this.Director.Configuration.GetConfigItem("Core.DefaultLanguage", "en-GB");

            return this.View("~/views/core/logon.cshtml",model);
        }

        /// <summary>
        /// The logon view.
        /// </summary>
        /// <param name="username">The username.</param>
        /// <param name="password">The password.</param>
        /// <param name="timezone">The timezone.</param>
        [HttpPost, Unprotected(true)]
        public ActionResult Logon(string username, string password, string timezone)
        {
            // check for a remember me cookie
            this.CheckForRememberMe();

            string originalUsername = username;
            username = username.Trim().Replace("'", "''");
            LogOnResult result = new Authenticator(this.Director, this.Cookie).LogOn(username, password, timezone);

            switch (result)
            {
                case LogOnResult.AccessAllowedUserNamePasswordVerified:
                case LogOnResult.AccessDeniedUserMustChangePassword:
                    {
                        this.Cookie.SetRememberMe(username, password);
                        this.Cookie.SetAuthenticationCookie(this.Director.User, null);
                        break;
                    }

                case LogOnResult.AccessDeniedAccountDisabled:
                    {
                        this.ViewBag.LogonMessage = TradeRiserUIResource.LogOn_Failure_AccountDisabled;
                        this.Cookie.ClearRememberMe();
                        break;
                    }

                case LogOnResult.AccessDeniedAccountLocked:
                    {
                        this.ViewBag.LogonMessage = TradeRiserUIResource.LogOn_Failure_AccountLocked;
                        this.Cookie.ClearRememberMe();
                        break;
                    }

                case LogOnResult.AccessDeniedInvalidPasswordAccountLocked:
                    {
                        this.ViewBag.LogonMessage = TradeRiserUIResource.LogOn_Failure_InvalidLogonAttemps;
                        this.Cookie.ClearRememberMe();
                        break;
                    }

                default:
                    {
                        this.ViewBag.LogonMessage = TradeRiserUIResource.LogOn_Failure_UserNamePassword;
                        this.Cookie.ClearRememberMe();
                        break;
                    }
            }

            if (result == LogOnResult.AccessAllowedUserNamePasswordVerified || result == LogOnResult.AccessDeniedUserMustChangePassword)
            {
                Log.Audit(CoreConstants.LogComponent, "CoreController.Logon", string.Format("{0} logged on at {1} ({2} UTC)", username, DateTime.Now, DateTime.UtcNow), userDisplayName: username);

                // gets user redirect Url
                string redirectUrl = this.GetRedirectUrl();

                if (result == LogOnResult.AccessDeniedUserMustChangePassword)
                {
                    return this.RedirectToAction("ChangePassword", "User");
                    //return this.RedirectToAction("ChangePassword", "User", new
                    //{
                    //    area = "cpf",
                    //    url = redirectUrl
                    //});
                }

                return this.Redirect(redirectUrl);
            }

            this.ViewBag.ReturnUrl = this.Director.Request.Form.Get<string>("url");
            this.ViewBag.Username = originalUsername;
            this.ViewBag.Password = password;

            this.ViewBag.Title = this.Director.Configuration.GetConfigItem<string>("Core.LogonPageTitle");
            this.ViewBag.LegalLink = this.Director.Configuration.GetConfigItem("Core.LegalHyperlinkUrl", "http://www.traderiser.com");
            this.ViewBag.PrivacyLink = this.Director.Configuration.GetConfigItem("Core.PrivacyHyperlinkUrl", "http://www.traderiser.com");

            bool logonNewsVisible = this.Director.Configuration.GetConfigItem("Core.LogonNewsVisible", true);
            this.ViewBag.LogonNewsVisible = logonNewsVisible;

            this.Response.Headers.Add("login", "1");

            SaveUserModel model = new SaveUserModel(null, null)
            {
                IsNewUser = true
            };
            this.ViewBag.Languages = new Dictionary<string, string> { { "en-GB", "en-GB" }, { "en-US", "en-US" } };

            // default to the same as the current user
            model.TimeZone = this.Director.User != null ? this.Director.User.TimeZone : "en-GB";
            model.LanguageCode = this.Director.Configuration.GetConfigItem("Core.DefaultLanguage", "en-GB");

            return this.View("~/views/core/logon.cshtml", model);
        }

        /// <summary>
        /// Gets the user default URL.
        /// </summary>
        /// <returns></returns>
        public string GetRedirectUrl()
        {
            string redirectUrl = string.Empty;
            string actionName = this.Director.Configuration.GetConfigItem("TR.Core.LogonDefaultActionName", "Index");
            string controllerName = this.Director.Configuration.GetConfigItem("TR.Core.LogonDefaultControllerName", "App");
  
            // check for a return url
            string returnUrl = this.Director.Request.Form.Get<string>("url");
            if (this.CanReturnToThisUrl(returnUrl))
            {
                redirectUrl = returnUrl;
            }

            if (string.IsNullOrWhiteSpace(redirectUrl))
            {
               // redirectUrl = string.Format("{0}{1}/{2}", this.Director.ApplicationPath, controllerName, actionName);
                redirectUrl = string.Format("{0}{1}/{2}", "~/", controllerName, actionName);
            }

            return redirectUrl;
           // return "~/Main/Index";
        }

        /// <summary>
        /// Reset the password.
        /// </summary>
        /// <param name="userNameOrEmail">The user name or email.</param>
        /// <returns>
        /// View. result.
        /// </returns>
       //// [HttpPost, Unprotected]
      //  [Route("core/forgotpassword/{userNameOrEmail}")]
        public ActionResult ForgotPassword(string userNameOrEmail)
        {
            UserSignOnService service = new UserSignOnService(this.Director.Configuration);

            // check for user by username.
            User user = service.GetUserByUserName(userNameOrEmail);

            if (user == null)
            {
                // if user is null, check for user by email.
                user = service.GetUserByEmail(userNameOrEmail);
            }

            if (user != null)
            {
                service.RequestPasswordReset(user);
            }

            string resetMessage;
            bool success = false;

            if (user == null)
            {
                resetMessage = @TradeRiserUIResource.PasswordResetNoUserMessage;
            }
            else
            {
                resetMessage = @TradeRiserUIResource.PasswordResetMessage;
                success = true;
            }

            ResultBag resultBag = new ResultBag(success, new { message = resetMessage });
            return new JsonActionResult(resultBag);
        }

        [HttpGet, Unprotected]
        public PartialViewResult ForgotPassword()
        {
            return this.PartialView("~/views/core/forgotpassword.cshtml");
        }

        [HttpGet, Unprotected]
       // [Route("core/changepassword/{resetToken}")]
        public ActionResult ChangePassword(string resetToken)
        {
            Guid resetId = Guid.Empty;
            if (Guid.TryParse(resetToken, out resetId))
            {

                // validate that the resetcode exists and has not expired
                UserSignOnService service = new UserSignOnService(this.Director.Configuration);
                PasswordResetRequest request = service.GetPasswordResetRequest(resetId);

                int expiryHours = this.Director.Configuration.GetConfigItem("Core.PasswordResetExpiryHours", 24);

                if (request != null && request.IsValid(expiryHours))
                {
                    // show the password change page
                    this.ViewBag.CanChangePassword = true;
                    this.ViewBag.ResetToken = request.ResetToken;
                }
                else
                {
                    // else show a message to say that the request has expired.
                    this.ViewBag.CanChangePassword = false;
                }
            }
            else
            {
                this.ViewBag.CanChangePassword = false;
            }

            this.ViewBag.Title = this.Director.Configuration.GetConfigItem<string>("Core.LogonPageTitle");
            this.ViewBag.LegalLink = this.Director.Configuration.GetConfigItem("Core.LegalHyperlinkUrl", "http://www.traderiser.com");
            this.ViewBag.PrivacyLink = this.Director.Configuration.GetConfigItem("Core.PrivacyHyperlinkUrl", "http://www.traderiser.com");

            this.ViewBag.PolicyMessage = this.Director.Membership.BuildPasswordCreationPolicyMessage();

            return this.View("~/views/core/changepassword.cshtml");
        }

        [HttpPost, Unprotected]
        public ActionResult ChangePassword(ChangePasswordRequest model)
        {
            string message = TradeRiserUIResource.Password_Error;
            bool success = false;
            ResultBag resultBag = null;

            try
            {
                UserSignOnService service = new UserSignOnService(this.Director.Configuration);
                PasswordResetRequest request = service.GetPasswordResetRequest(model.ResetToken);

                if (request != null && model.Password == model.ConfirmPassword)
                {
                    PasswordActionResult result = service.ResetPassword(request.UserID, request.UserName, model.Password, string.Empty);

                    switch (result)
                    {
                        case PasswordActionResult.FailedUserDoesNotExist:
                            message = TradeRiserUIResource.Password_FailedUserDoesNotExist;
                            break;
                        case PasswordActionResult.FailedNewPasswordSameAsOldPassword:
                            message = TradeRiserUIResource.Password_FailedNewPasswordSameAsOldPassword;
                            break;
                        case PasswordActionResult.FailedIntegratedUsersCannotChangePassword:
                            break;
                        case PasswordActionResult.FailedIncorrectPassword:
                            message = TradeRiserUIResource.Password_FailedIncorrectPassword;
                            break;
                        case PasswordActionResult.FailedNullOrEmptyPolicy:
                            message = TradeRiserUIResource.Password_FailedNullOrEmptyPolicy;
                            break;
                        case PasswordActionResult.FailedMinimumLengthPolicy:
                            message = TradeRiserUIResource.Password_FailedMinimumLengthPolicy;
                            break;
                        case PasswordActionResult.FailedLowercaseCharacterPolicy:
                            message = TradeRiserUIResource.Password_FailedLowercaseCharacterPolicy;
                            break;
                        case PasswordActionResult.FailedUppercaseCharacterPolicy:
                            message = TradeRiserUIResource.Password_FailedUppercaseCharacterPolicy;
                            break;
                        case PasswordActionResult.FailedMinimumDigitPolicy:
                            message = TradeRiserUIResource.Password_FailedMinimumDigitPolicy;
                            break;
                        case PasswordActionResult.FailedPasswordAlreadyUsed:
                            message = TradeRiserUIResource.Password_FailedPasswordAlreadyUsed;
                            break;
                        case PasswordActionResult.Ok:
                            message = TradeRiserUIResource.Password_Ok;
                            success = true;
                            break;
                        default:
                            break;
                    }
                }

                if (request == null)
                {
                    message = "Your password reset link has expired.";
                }

                Alert alert = new Alert(message, success ? AlertType.Success : AlertType.Error);
                resultBag = new ResultBag(alert, success, null);
            }
            catch (Exception exception)
            {
                Alert alert = new Alert(TradeRiserUIResource.Password_Error, AlertType.Error);
                resultBag = new ResultBag(alert, false, exception.Message);
            }

            return new JsonActionResult(resultBag);
        }


        /// <summary>
        /// Ribbon of the applications.
        /// </summary>
        /// <returns>View result.</returns>
        public ActionResult AppsRibbon()
        {
            return this.PartialView("~/views/Shared/_AppsRibbon.cshtml");
        }

        ////[Unprotected]
        ////public ActionResult Message(Message message)
        ////{
        ////    return this.PartialView("~/core/views/core/message.cshtml", message);
        ////}

        /// <summary>
        /// No permissions view.
        /// </summary>
        /// <returns>No Permissions Partial result.</returns>
        public ActionResult NoPermissions()
        {
            return this.View("~/views/core/nopermissions.cshtml");
        }

        /// <summary>
        /// The Portal view.
        /// </summary>
        /// <returns>View result.</returns>
       // [Route("~/")]
        //[Route]
        //[Route("core/portal")]
        public ActionResult Portal()
        {
            string actionName = this.Director.Configuration.GetConfigItem("TR.Core.LogonDefaultActionName", "Index");
            string controllerName = this.Director.Configuration.GetConfigItem("TR.Core.LogonDefaultControllerName", "Membership");
            return this.RedirectToAction(actionName, controllerName);
        }

        ///// <summary>
        ///// Sets the message.
        ///// </summary>
        ///// <param name="id">The id.</param>
        ///// <param name="content">The content.</param>
        ///// <param name="title">The title.</param>
        ///// <param name="iconType">Type of the icon.</param>
        ///// <param name="nobuttontext">The no button text.</param>
        ///// <param name="yesbuttontext">The yes button text.</param>
        ///// <returns>Message View.</returns>
        //[Unprotected]
        //public ActionResult SetMessage(string id, string content, string title, MessageIconType iconType, string nobuttontext, string yesbuttontext)
        //{
        //    Message message = new Message
        //    {
        //        Content = content,
        //        IconType = iconType,
        //        ID = id,
        //        NoButtonText = nobuttontext,
        //        Title = title,
        //        YesButtonText = yesbuttontext
        //    };
        //    return this.PartialView("~/views/core/message.cshtml", message);
        //}

        /// <summary>
        /// Renders the display name of a user.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <returns>
        /// The display name.
        /// </returns>
        public PartialViewResult UserDisplayName(Guid? userID)
        {
            try
            {
                this.ViewBag.DisplayName = string.Empty;
                if (userID.HasValue)
                {
                    User user = this.Director.Membership.GetUserByID(userID.Value);
                    if (user != null)
                    {
                        this.ViewBag.DisplayName = string.Format("{0} {1}", user.FirstName, user.LastName);
                    }
                }
            }
            catch
            {
                Log.Warning(CoreController.COMPONENT, string.Format("{0}.UserDisplayName", CoreController.SENDER), string.Format("Unable to find a user with the ID '{0}'", userID), userId: this.Director.User.UserID);
                this.ViewBag.DisplayName = "-";
            }

            return this.PartialView("~/views/core/userdisplayname.cshtml");
        }

        /// <summary>
        /// Validates this instance.
        /// </summary>
        /// <returns>Validate view.</returns>
        public ActionResult Validate()
        {
            return this.View("~/core/views/core/validate.cshtml");
        }

        #endregion

        #region  Private Methods

        /// <summary>
        /// Determines whether this the app can redirect back to this url (usually the previous url before a logout).
        /// Some Urls can not be returned to due to dependencies like SSRS sessions.
        /// </summary>
        /// <param name="returnUrl">The return URL.</param>
        /// <returns>
        /// 	<c>True</c> if this the app can return to this url; otherwise, <c>false</c>.
        /// </returns>
        private bool CanReturnToThisUrl(string returnUrl)
        {
            if (string.IsNullOrEmpty(returnUrl))
            {
                return false;
            }

            string json = this.Director.Configuration.GetConfigItem("Core.ExcludedReturnUrls", string.Empty);
            List<string> noReturnUrls = null;
            if (string.IsNullOrEmpty(json))
            {
                noReturnUrls = new List<string>();
                noReturnUrls.Add("core/logon");
                noReturnUrls.Add("core/logoff");
            }
            else
            {
                noReturnUrls = JsonConvert.DeserializeObject<List<string>>(json);
            }

            returnUrl = returnUrl.ToLower();
            return !noReturnUrls.Any(n => returnUrl.Contains(n.ToLower()));
        }

        /// <summary>
        /// Checks for remember me cookie.
        /// </summary>
        private void CheckForRememberMe()
        {
            // check for a remember me cookie
            string username = this.Cookie.GetRememberMe();
            if (!string.IsNullOrEmpty(username))
            {
                this.ViewBag.Username = username;
                this.ViewBag.RememberMe = true;
            }
        }

        #endregion
    }
}
