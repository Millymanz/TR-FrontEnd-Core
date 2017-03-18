using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TradeRiser.Core.Configuration;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Membership;
using TradeRiser.Core.SignOn;
using TradeRiser.UI.Models;
namespace TradeRiser.UI.Controllers
{
   // [AuthorisedPermission("mysettings.app")]
   // [RouteArea("cpf")]
   // [Route("user/{action=index}")]
    public class UserController : CpfController
    {
        #region private fields

        /// <summary>
        /// Log sender string.
        /// </summary>
        private const string SENDER = "UserController";

        #endregion private fields

        #region public methods

        /// <summary>
        /// The account view.
        /// </summary>
        /// <returns>The view result.</returns>
        [AcceptVerbs(HttpVerbs.Get)]
        public ActionResult Account()
        {
            User user = this.Director.Membership.GetUserByID(this.Director.User.UserID);

            if (user == null)
            {
                throw new Exception(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID));
            }

            UserModel model = new UserModel
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmailAddress = user.Email,
                Phone1 = user.Phone1,
                Phone2 = user.Phone2,
                TimeZone = user.TimeZone,
              //  LanguageList = this.Languages,
                Language = user.LanguageCode
            };

            return this.View("~/views/user/account.cshtml", model);
        }

        /// <summary>
        /// Accounts this instance.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns>View result.</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Account(UserModel model)
        {
            ResultBag resultBag = null;
            User user = this.Director.Membership.GetUserByID(this.Director.User.UserID);

            if (user == null)
            {
                Log.Exception(CoreConstants.LogComponent, SENDER, new Exception(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID)), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                resultBag = new ResultBag(new Alert(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID), AlertType.Error), false);
            }
            else
            {
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Email = model.EmailAddress;
                user.LanguageCode = model.Language;

                CreateUserResult createResult = this.Director.Membership.UpdateUser(user);

                if (createResult.UserCreated)
                {
                    ////// do garbage collect for all users
                    ////SsrGarbageCollect.DoGarbageCollect(this.Director, this.Director.User.UserID, CoreConstants.UsersArea, true);
                    ////SsrGarbageCollect.DoGarbageCollect(this.Director, this.Director.User.UserID, CoreConstants.UsersAndGroupsArea, true);

                    resultBag = new ResultBag(new Alert(TradeRiserUIResource.User_UpdateSuccess, AlertType.Success), true);
                }
                else
                {
                    resultBag = new ResultBag(new Alert(createResult.Messages.FirstOrDefault(), AlertType.Error), false);
                }
            }

            return new JsonActionResult(resultBag);
        }

        /////// <summary>
        /////// Alerts this instance.
        /////// </summary>
        /////// <returns>View result.</returns>
        ////[AcceptVerbs(HttpVerbs.Get)]
        ////public ActionResult Alerting()
        ////{
        ////    User user = this.Director.Membership.GetUserByID(this.Director.User.UserID);

        ////    if (user == null)
        ////    {
        ////        throw new Exception(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID));
        ////    }

        ////    this.ViewBag.OutOfOffice = user.OutOfOffice;
        ////    this.ViewBag.SendAlertsAsEmail = user.SendAlertsAsEmail;
        ////    this.ViewBag.EscalationUserID = user.EscalationUserID;
        ////    this.ViewBag.DelegateUserID = user.DelegateUserID;

        ////    string escalateDisplayName = string.Empty;
        ////    string escalateUserSelectedJson = string.Empty;

        ////    if (user.EscalationUserID != Guid.Empty)
        ////    {
        ////        User escalateUser = this.Director.Membership.GetUserByID(user.EscalationUserID);

        ////        if (escalateUser == null)
        ////        {
        ////            escalateDisplayName = "Unknown";
        ////        }
        ////        else
        ////        {
        ////            escalateDisplayName = string.Format("{0} {1} ({2})", escalateUser.FirstName, escalateUser.LastName, escalateUser.UserName);
        ////            escalateUserSelectedJson = "{\"label\":\"" + escalateDisplayName + "\",\"value\":\"" + escalateUser.UserID + "\"}";
        ////        }
        ////    }

        ////    string delegateDisplayName = string.Empty;
        ////    string delegateUserSelectedJson = string.Empty;

        ////    if (user.DelegateUserID != Guid.Empty)
        ////    {
        ////        User delegateUser = this.Director.Membership.GetUserByID(user.DelegateUserID);

        ////        if (delegateUser == null)
        ////        {
        ////            delegateDisplayName = "Unknown";
        ////        }
        ////        else
        ////        {
        ////            delegateDisplayName = string.Format("{0} {1} ({2})", delegateUser.FirstName, delegateUser.LastName, delegateUser.UserName);
        ////            delegateUserSelectedJson = "{\"label\":\"" + delegateDisplayName + "\",\"value\":\"" + delegateUser.UserID + "\"}";
        ////        }
        ////    }

        ////    UserAutoCompleteGridFactory factory = new UserAutoCompleteGridFactory(null);
        ////    List<AutoCompleteGrid> autocompleteGrids = new List<AutoCompleteGrid>();

        ////    AutoCompleteGrid usersGrid = null;

        ////    usersGrid = factory.GetUsersGrid(new List<RegisteredUser>(), string.Empty, string.Empty, Guid.Empty);
        ////    usersGrid.ID = "escalationName";
        ////    usersGrid.ListType = AutoCompleteListType.Single;
        ////    usersGrid.HideSection = true;
        ////    usersGrid.SelectedText = escalateDisplayName;
        ////    usersGrid.SelectedItemJson = escalateUserSelectedJson;

        ////    autocompleteGrids.Add(usersGrid);


        ////    usersGrid = factory.GetUsersGrid(new List<RegisteredUser>(), string.Empty, string.Empty, Guid.Empty);
        ////    usersGrid.ID = "delegateName";
        ////    usersGrid.ListType = AutoCompleteListType.Single;
        ////    usersGrid.HideSection = true;
        ////    usersGrid.SelectedText = delegateDisplayName;
        ////    usersGrid.SelectedItemJson = delegateUserSelectedJson;
        ////    autocompleteGrids.Add(usersGrid);

        ////    this.ViewBag.AutoComplete = autocompleteGrids;
        ////    this.ViewBag.User = string.Format("{0} {1}", this.Director.User.FirstName, this.Director.User.LastName);
        ////    return this.View("~/views/user/alerting.cshtml");
        ////}

     
        /// <summary>
        /// Changes the password.
        /// </summary>
        /// <returns>The view result.</returns>
        public ActionResult ChangePassword()
        {
            return this.View("~/views/user/changepassword.cshtml");
        }

        /// <summary>
        /// Default action returns the portal.
        /// </summary>
        /// <returns>View result.</returns>
        public ActionResult Index()
        {
           // return this.RedirectToAction("Index", "Search", new { area = "icms" });
            UserModel model = new UserModel();
            model.Users = this.Director.Membership.GetAllUsers();
            return this.View(model);
        }

        /////// <summary>
        /////// Panels the specified input.
        /////// </summary>
        /////// <param name="input">The input.</param>
        /////// <returns>The view result.</returns>
        ////public ActionResult Panel(Tuple<string, Preferences> input)
        ////{
        ////    Dictionary<string, string> model = new Dictionary<string, string>();
        ////    string parameterName = string.Empty;
        ////    if (!string.IsNullOrEmpty(input.Item1))
        ////    {
        ////        if (input.Item1 == "Dashboard")
        ////        {
        ////            // get all active dashboards
        ////            IDashboardService service = Dependency.Get<IDashboardService>();

        ////            foreach (RepoFile item in service.GetEnabledDashboards())
        ////            {
        ////                model.Add(item.DisplayName, item.DisplayName);
        ////            }

        ////            parameterName = "dashboardIdentifier";
        ////        }
        ////    }

        ////    this.ViewBag.ApplicationName = input.Item1;
        ////    this.ViewBag.SearchParameterName = parameterName;
        ////    this.ViewBag.ExistingValue = input.Item2.SearchName;

        ////    // if there is no more option, don't show anything for this view
        ////    if (model.Count == 0)
        ////    {
        ////        return this.Content(string.Empty);
        ////    }
        ////    else
        ////    {
        ////        return this.View("~/views/user/panel.cshtml", model);
        ////    }
        ////}

        /// <summary>
        /// Reset password.
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

            this.ViewBag.PolicyMessage = this.Director.Membership.BuildPasswordCreationPolicyMessage();
            this.ViewBag.User = string.Format("{0} {1}", this.Director.User.FirstName, this.Director.User.LastName);
            return this.View("~/views/user/password.cshtml");
        }

        /// <summary>
        /// Passwords the specified model.
        /// </summary>
        /// <param name="model">The model.</param>
        /// <returns>Password model.</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Password(PasswordModel model)
        {
            string message = TradeRiserUIResource.Password_Error;
            bool success = false;
            ResultBag resultBag = null;
            try
            {
                if (model.NewPassword == model.ConfirmPassword)
                {
                    PasswordActionResult result = new UserSignOnService(this.Director.Configuration).ChangePassword(this.Director.User.UserName, model.OldPassword, model.NewPassword);

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
        /// Preferences this instance.
        /// </summary>
        /// <returns>The view result.</returns>
        public ActionResult Preferences()
        {
            return this.View("~/views/user/preferences.cshtml");
        }

    
        /// <summary>
        /// Updates the user preferences.
        /// </summary>
        /// <param name="brandHexColour">The brand colour.</param>
        /// <param name="theme">The theme.</param>
        /// <param name="chrome">The chrome.</param>
        /// <returns>The view result.</returns>
        [AcceptVerbs(HttpVerbs.Post)]
        public JsonActionResult UpdateUserTheme(string brandHexColour, string theme, string chrome)
        {
            ResultBag resultBag = null;

            try
            {
                // get the current user
                User user = this.Director.Membership.GetUserByID(this.Director.User.UserID);

                if (user == null)
                {
                    throw new Exception(string.Format("The user with ID: '{0}' cannot be found.", this.Director.User.UserID));
                }
                
                this.Director.Membership.UpdateUser(user);

                resultBag = new ResultBag(null, true);
                return new JsonActionResult(resultBag);
            }
            catch (Exception exception)
            {
                resultBag = new ResultBag(new Alert(TradeRiserUIResource.UserPreferences_SaveFailed, AlertType.Error), false, exception.Message, false);
                return new JsonActionResult(resultBag);
            }
        }

   
        ////    /// <summary>
        /////// Users the preferences.
        /////// </summary>
        /////// <returns>The view result.</returns>
        ////public ActionResult ThemeOptions()
        ////{
        ////    string accent = this.Director.Configuration.GetConfigItem<string>("Core.Branding", "Accent");
        ////    string theme = this.Director.Configuration.GetConfigItem<string>("Core.Branding", "Theme");
        ////    string chrome = this.Director.Configuration.GetConfigItem<string>("Core.Branding", "Chrome");

        ////    ThemePreferences model = new ThemePreferences
        ////    {
        ////        UseDarkTheme = theme.Equals("Dark"),
        ////        UseDarkChrome = chrome.Equals("Dark"),
        ////        Accent = accent ?? "#FFBE26"
        ////    };

        ////    return this.View("~/views/user/themeoptions.cshtml", model);
        ////}

        #endregion public methods

        #region private static methods

        /// <summary>
        /// Action if no user is found.
        /// </summary>
        /// <returns>The view result.</returns>
        private static JsonActionResult CantFindUserJsonActionResult()
        {
            ResultBag resultBag = new ResultBag(new Alert(TradeRiserUIResource.CannotFindAUserWithTheSpecifiedName, AlertType.Error), false);
            return new JsonActionResult(resultBag);
        }

        #endregion private static methods

        #region private methods

      
        /// <summary>
        /// Gets the assigned user by name.
        /// </summary>
        /// <param name="assignedUser">The assigned user.</param>
        private User GetAssignedUserByName(Guid assignedUser)
        {
            User delegatedUser = this.Director.Membership.GetUserByID(assignedUser);
            return delegatedUser;
        }

        #endregion private methods
    }
}
