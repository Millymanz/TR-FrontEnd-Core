using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TradeRiser.Core.Logging;
using TradeRiser.Core.SignOn;
using TradeRiser.Core.Membership;
using TradeRiser.UI.Models;

namespace TradeRiser.UI.Controllers
{
  


        ///// <summary>
        /////     The location group controller.
        ///// </summary>
        //[AuthorisedPermission("membership.app")]
        //[RouteArea("cpf")]
        //[Route("membership/{action=index}")]
        public class MembershipController : CpfController
        {
            /// <summary>
            ///     The sender.
            /// </summary>
            private const string SENDER = "MembershipController";

            #region  Fields

            /// <summary>
            ///     Location group service.
            /// </summary>
            private IMembershipService membershipService;


            private UserSignOnService signOnService;

            #endregion

            #region  Properties and Indexers

            public UserSignOnService SignOnService
            {
                get
                {
                    if (this.signOnService == null)
                    {
                        this.signOnService = new UserSignOnService(this.Director.Configuration);
                    }

                    return this.signOnService;
                }
            }

            /// <summary>
            ///     Gets or sets the membership service.
            /// </summary>
            /// <value>
            ///     The membership service.
            /// </value>
            public IMembershipService MembershipService
            {
                get
                {
                    if (this.membershipService == null)
                    {
                        this.membershipService = new MembershipService(this.Director.Configuration);
                    }

                    return this.membershipService;
                }

                set
                {
                    this.membershipService = value;
                }
            }



            #endregion

            #region  Public Methods

            /// <summary>
            ///     Edits the specified user.
            /// </summary>
            /// <param name="userName">Name of the user.</param>
            /// <param name="pageView">The Page view</param>
            /// <returns>
            ///     Edit view.
            /// </returns>
            // [Route("membership/edit/{userName}")]
            public ActionResult Edit(string userName, string pageView = null)
            {
                User user = this.MembershipService.GetUserByUserName(userName);
                SaveUserModel model = new SaveUserModel(user, null);
                //this.ViewBag.Languages = this.Languages;
                this.ViewBag.Languages = new Dictionary<string, string> { { "en-GB", "en-GB" }, { "en-US", "en-US" } };
                // page title
                this.ViewBag.HeaderTitle = string.Format("{0} > {1} {2}", TradeRiserUIResource.User, model.FirstName, model.LastName);
                this.ViewBag.PageView = pageView;
                return this.View("~/views/membership/Edit.cshtml", model);
            }

            /// <summary>
            ///     Indexes this instance.
            /// </summary>
            /// <returns>List of location groups.</returns>
            public ActionResult Index()
            {
                // return this.RedirectToAction("Index", "Search", new { area = "icms" });
                UserModel model = new UserModel();
                model.Users = this.Director.Membership.GetAllUsers();
                return this.View(model);
            }

            /// <summary>
            ///     News this instance.
            /// </summary>
            /// <returns>Edit view.</returns>
            public ActionResult New()
            {
                SaveUserModel model = new SaveUserModel(null, null)
                {
                    IsNewUser = true
                };
                this.ViewBag.Languages = new Dictionary<string, string> { { "en-GB", "en-GB" }, { "en-US", "en-US" } };

                // default to the same as the current user
                model.TimeZone = this.Director.User.TimeZone;
                model.LanguageCode = this.Director.Configuration.GetConfigItem("Core.DefaultLanguage", "en-GB");

                return this.View("~/views/membership/Edit.cshtml", model);
            }

            /// <summary>
            ///     News this instance.
            /// </summary>
            /// <returns>Edit view.</returns>
            public ActionResult SignUp()
            {
                SaveUserModel model = new SaveUserModel(null, null)
                {
                    IsNewUser = true
                };
                this.ViewBag.Languages = new Dictionary<string, string> { { "en-GB", "en-GB" }, { "en-US", "en-US" } };

                // default to the same as the current user
                model.TimeZone = this.Director.User != null ? this.Director.User.TimeZone : "en-GB";
                model.LanguageCode = this.Director.Configuration.GetConfigItem("Core.DefaultLanguage", "en-GB");

                return this.View("~/views/membership/SignUp.cshtml", model);
            }
            /// <summary>
            ///     Removes the specified user ids.
            /// </summary>
            /// <param name="memberIds">The member ids.</param>
            /// <param name="memberUserNames">The member user names</param>
            /// <returns>
            ///     Alert message.
            /// </returns>
            [HttpPost]
            public ActionResult Remove(string memberIds, string memberUserNames)
            {
                ResultBag resultBag = null;

                try
                {
                    System.Collections.Generic.List<System.Guid> userIds = new System.Collections.Generic.List<System.Guid>();
                    System.Guid userId = System.Guid.Empty;

                    foreach (string userIdGuid in memberIds.Split(','))
                    {
                        if (System.Guid.TryParse(userIdGuid, out userId))
                        {
                            userIds.Add(userId);
                        }
                    }

                    bool hasRemoved = this.MembershipService.DeleteUser(userIds);
                    if (hasRemoved)
                    {
                        Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The user(s) {0} have been deleted.", string.IsNullOrEmpty(memberUserNames) ? memberIds : memberUserNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        //this.ClearCache(userIds, true);
                        //this.ClearCache(this.Director.User.UserID, true);

                        Alert alert = new Alert(TradeRiserUIResource.Membership_RemoveSuccess, AlertType.Success, false)
                        {
                            Delayed = true
                        };

                        resultBag = new ResultBag(alert, true, string.Empty)
                        {
                            RedirectUrl = "membership"
                        };
                    }
                    else
                    {
                        Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The attempt to delete user(s) {0} has failed.", string.IsNullOrEmpty(memberUserNames) ? memberIds : memberUserNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_RemoveFailed, AlertType.Error, false), false, string.Empty);
                    }
                }
                catch (System.Exception ex)
                {
                    Log.Exception(CoreConstants.LogComponent, MembershipController.SENDER, ex, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                    resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_RemoveFailed, AlertType.Error, false), false, ex.Message);
                }

                return new JsonActionResult(resultBag);
            }

            /// <summary>
            ///     Disables the specified user ids.
            /// </summary>
            /// <param name="memberIds">The member ids.</param>
            /// <param name="memberUserNames"></param>
            /// <returns>
            ///     Alert message.
            /// </returns>
            [HttpPost]
            public ActionResult Disable(string memberIds, string memberUserNames)
            {
                ResultBag resultBag = null;

                try
                {
                    List<string> userIds = memberIds.Split(',').ToList();
                    bool hasDisabled = this.MembershipService.DisableUsers(userIds);
                    if (hasDisabled)
                    {
                        List<Guid> userIdList = new List<Guid>();
                        Guid userId = Guid.Empty;

                        foreach (string userIdGuid in userIds)
                        {
                            if (Guid.TryParse(userIdGuid, out userId))
                            {
                                userIdList.Add(userId);
                            }
                        }

                        Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The user(s) {0} have been disabled.", string.IsNullOrEmpty(memberUserNames) ? memberIds : memberUserNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        //this.ClearCache(userIdList, true);
                        //this.ClearCache(this.Director.User.UserID, true);

                        Alert alert = new Alert(TradeRiserUIResource.Membership_DisableSuccess, AlertType.Success, false)
                        {
                            Delayed = true
                        };

                        resultBag = new ResultBag(alert, true, string.Empty)
                        {
                            RedirectUrl = "membership"
                        };
                    }
                    else
                    {
                        Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The attempt to disabled user(s) {0} has failed.", string.IsNullOrEmpty(memberUserNames) ? memberIds : memberUserNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_DisableFailed, AlertType.Error, false), false, string.Empty);
                    }
                }
                catch (System.Exception ex)
                {
                    Log.Exception(CoreConstants.LogComponent, MembershipController.SENDER, ex, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                    resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_DisableFailed, AlertType.Error, false), false, ex.Message);
                }

                return new JsonActionResult(resultBag);
            }

            /// <summary>
            ///     Disables the specified user ids.
            /// </summary>
            /// <param name="memberIds">The member ids.</param>
            /// <returns>
            ///     Alert message.
            /// </returns>
            [HttpPost]
            public ActionResult Enable(string memberIds, string memberUserNames)
            {
                ResultBag resultBag = null;

                try
                {
                    System.Collections.Generic.List<string> userIds = memberIds.Split(',').ToList();
                    bool hasEnabled = this.MembershipService.EnableUsers(userIds);
                    if (hasEnabled)
                    {
                        System.Collections.Generic.List<System.Guid> userIdList = new System.Collections.Generic.List<System.Guid>();
                        System.Guid userId = System.Guid.Empty;

                        foreach (string userIdGuid in userIds)
                        {
                            if (System.Guid.TryParse(userIdGuid, out userId))
                            {
                                userIdList.Add(userId);
                            }
                        }

                        Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The user(s) {0} have been enabled.", string.IsNullOrEmpty(memberUserNames) ? memberIds : memberUserNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        //this.ClearCache(userIdList, true);
                        //this.ClearCache(this.Director.User.UserID, true);

                        Alert alert = new Alert(TradeRiserUIResource.Membership_EnableSuccess, AlertType.Success, false)
                        {
                            Delayed = true
                        };

                        resultBag = new ResultBag(alert, true, string.Empty)
                        {
                            RedirectUrl = "membership"
                        };
                    }
                    else
                    {
                        Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The attempt to disabled user(s) {0} has failed.", string.IsNullOrEmpty(memberUserNames) ? memberIds : memberUserNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_EnableFailed, AlertType.Error, false), false, string.Empty);
                    }
                }
                catch (System.Exception ex)
                {
                    Log.Exception(CoreConstants.LogComponent, MembershipController.SENDER, ex, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                    resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_EnableFailed, AlertType.Error, false), false, ex.Message);
                }

                return new JsonActionResult(resultBag);
            }

            /// <summary>
            ///     Saves the specified model.
            /// </summary>
            /// <param name="model">The model.</param>
            /// <returns>Saved message.</returns>
            [HttpPost]
            public ActionResult Save(SaveUserModel model)
            {
                ResultBag resultBag = null;
               // this.ViewBag.Languages = this.Languages;

                bool hasSaved = false;
                string errorMessage = string.Empty;
                string stackTrace = String.Empty;

                bool isNewUser = false;
                try
                {
                    isNewUser = model.IsNewUser;
                    User userFromDB = model.IsNewUser ? null : this.MembershipService.GetUserByUserName(model.UserName);

                    if (!model.IsNewUser && userFromDB == null)
                    {
                        // this user does not exist in the database. The current user is possibly editting a user that has been deleted.
                        errorMessage = "Attempt to update the user failed. The user cannot be found in the system.";
                    }
                    else
                    {
                        User user = model.GetUser(userFromDB);
                        CreateUserResult result = model.IsNewUser ? this.MembershipService.CreateUser(user) : this.MembershipService.UpdateUser(user);
                        hasSaved = result.UserCreated;

                        if (hasSaved)
                        {
                            Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format(isNewUser ? "The user {0} with username {1} was created." : "The user {0} with username {1} was updated.", user.UserDisplayName, user.UserName), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);

                            //Group group = model.GetGroup();
                            //bool usergroupHasUpdated = this.MembershipService.UpdateUserGroup(group, result.UserID, user.UserName);
                            //string groupNames = string.Join(", ", @group.UserGroups.Select(g => g.Name).ToArray());

                            //if (usergroupHasUpdated)
                            //{
                            //    this.Director.Blanka.PurgeByCategory(new List<string> { PermissionManager.UserPermissionsCategory });

                            //    Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The user {0} with username {1} was added to user groups {2}.", user.UserDisplayName, user.UserName, groupNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                            //}
                            //else
                            //{
                            //    Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The attempt to add the user {0} with username {1} to user groups {2} has failed.", user.UserDisplayName, user.UserName, groupNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                            //}



                            //this.ClearCache(model.UserID, true);
                            //this.ClearCache(this.Director.User.UserID, true);
                            //this.ClearAppsSearchResults(model.UserID);
                        }
                        else
                        {
                            if (result.Messages != null && result.Messages.Count > 0)
                            {
                                errorMessage = result.Messages[0];
                            }
                            else
                            {
                                errorMessage = string.Format(isNewUser ? "The attempt to create user {0} with username {1} failed." : "The attempt to update user {0} with username {1} failed.", user.UserDisplayName, user.UserName);
                            }

                            Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format(isNewUser ? "The attempt to create user {0} with username {1} failed." : "The attempt to update user {0} with username {1} failed.", user.UserDisplayName, user.UserName), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        }
                    }
                }
                catch (System.Exception ex)
                {
                    Log.Exception(CoreConstants.LogComponent, MembershipController.SENDER, ex, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                    errorMessage = isNewUser ? "The attempt to create user the failed." : "Attempt to update the user failed. The user cannot be found in the system.";
                }

                this.ViewBag.Message = hasSaved ? TradeRiserUIResource.Membership_SavedSuccess : TradeRiserUIResource.Membership_SaveFailed;
                this.ViewBag.Saved = hasSaved;

                if (hasSaved)
                {
                    Alert alert = new Alert(TradeRiserUIResource.Membership_SavedSuccess, AlertType.Success, false)
                    {
                        Delayed = true
                    };

                    resultBag = new ResultBag(alert, true, string.Empty)
                    {
                        RedirectUrl = "membership"
                    };
                    return new JsonActionResult(resultBag);
                }
                resultBag = new ResultBag(new Alert(errorMessage, AlertType.Error, false), false, errorMessage);
                return new JsonActionResult(resultBag);
            }

            /// <summary>
            ///     Saves the specified model.
            /// </summary>
            /// <param name="model">The model.</param>
            /// <returns>Saved message.</returns>
            [HttpPost]
            public ActionResult RegisterSave(SaveUserModel model)
            {
                ResultBag resultBag = null;
                // this.ViewBag.Languages = this.Languages;

                bool hasSaved = false;
                string errorMessage = string.Empty;
                string stackTrace = String.Empty;

                bool isNewUser = false;
                try
                {
                    isNewUser = model.IsNewUser;
                    User userFromDB = model.IsNewUser ? null : this.MembershipService.GetUserByUserName(model.UserName);

                    if (!model.IsNewUser && userFromDB == null)
                    {
                        // this user does not exist in the database. The current user is possibly editting a user that has been deleted.
                        errorMessage = "Attempt to update the user failed. The user cannot be found in the system.";
                    }
                    else
                    {
                        User user = model.GetUser(userFromDB);
                        CreateUserResult result = model.IsNewUser ? this.MembershipService.CreateUser(user) : this.MembershipService.UpdateUser(user);
                        hasSaved = result.UserCreated;

                        if (hasSaved)
                        {
                            Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format(isNewUser ? "The user {0} with username {1} was created." : "The user {0} with username {1} was updated.", user.UserDisplayName, user.UserName));

                            //Group group = model.GetGroup();
                            //bool usergroupHasUpdated = this.MembershipService.UpdateUserGroup(group, result.UserID, user.UserName);
                            //string groupNames = string.Join(", ", @group.UserGroups.Select(g => g.Name).ToArray());

                            //if (usergroupHasUpdated)
                            //{
                            //    this.Director.Blanka.PurgeByCategory(new List<string> { PermissionManager.UserPermissionsCategory });

                            //    Log.Audit(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The user {0} with username {1} was added to user groups {2}.", user.UserDisplayName, user.UserName, groupNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                            //}
                            //else
                            //{
                            //    Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format("The attempt to add the user {0} with username {1} to user groups {2} has failed.", user.UserDisplayName, user.UserName, groupNames), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                            //}



                            //this.ClearCache(model.UserID, true);
                            //this.ClearCache(this.Director.User.UserID, true);
                            //this.ClearAppsSearchResults(model.UserID);
                        }
                        else
                        {
                            if (result.Messages != null && result.Messages.Count > 0)
                            {
                                errorMessage = result.Messages[0];
                            }
                            else
                            {
                                errorMessage = string.Format(isNewUser ? "The attempt to create user {0} with username {1} failed." : "The attempt to update user {0} with username {1} failed.", user.UserDisplayName, user.UserName);
                            }

                            Log.Warning(CoreConstants.LogComponent, MembershipController.SENDER, string.Format(isNewUser ? "The attempt to create user {0} with username {1} failed." : "The attempt to update user {0} with username {1} failed.", user.UserDisplayName, user.UserName), this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                        }
                    }
                }
                catch (System.Exception ex)
                {
                    Log.Exception(CoreConstants.LogComponent, MembershipController.SENDER, ex);
                    errorMessage = isNewUser ? "The attempt to create user the failed." : "Attempt to update the user failed. The user cannot be found in the system.";
                }

                this.ViewBag.Message = hasSaved ? TradeRiserUIResource.Membership_SavedSuccess : TradeRiserUIResource.Membership_SaveFailed;
                this.ViewBag.Saved = hasSaved;

                if (hasSaved)
                {
                    Alert alert = new Alert(TradeRiserUIResource.Membership_SavedSuccess, AlertType.Success, false)
                    {
                        Delayed = true
                    };

                    resultBag = new ResultBag(alert, true, string.Empty)
                    {
                        RedirectUrl = "app"
                    };
                    return new JsonActionResult(resultBag);
                }
                resultBag = new ResultBag(new Alert(errorMessage, AlertType.Error, false), false, errorMessage);
                return new JsonActionResult(resultBag);
            }


            /// <summary>
            ///     Resets user password.
            /// </summary>
            /// <param name="username">The username.</param>
            /// <returns>Reset password model.</returns>
            [HttpPost]
            public ActionResult ResetPassword(string username)
            {
                ResultBag resultBag = null;

                try
                {
                    UserSignOnService service = new UserSignOnService(this.Director.Configuration);
                    User user = service.GetUserByUserName(username);

                    bool result = service.RequestPasswordReset(user);

                    return new JsonActionResult(result, result ? TradeRiserUIResource.Membership_ResetPasswordSuccess : TradeRiserUIResource.Membership_ResetPasswordFailed, null, result);
                }
                catch (System.Exception ex)
                {
                    Log.Exception(CoreConstants.LogComponent, MembershipController.SENDER, ex, this.Director.User.UserName, this.Director.User.UserDisplayName, this.Director.User.UserID);
                    resultBag = new ResultBag(new Alert(TradeRiserUIResource.Membership_ResetPasswordFailed, AlertType.Error, false), false, ex.Message);
                    return new JsonActionResult(resultBag);
                }
            }



            ///// <summary>
            /////     Users the preferences.
            ///// </summary>
            ///// <returns></returns>

            //public ActionResult UserPreferences(string userId)
            //{
            //    UserController userController = new UserController();
            //    userController.Director = this.Director;

            //    // Get user Preference
            //    User user = this.Director.Membership.GetUserByID(System.Guid.Parse(userId));
            //    UserPreference preference = new UserPreference();

            //    Guid userID = new Guid(userId);

            //    UserModel model = userController.GetUserPreferenceOptions(userID, null, null);

            //    if (user != null)
            //    {
            //        model.FirstName = user.FirstName;
            //        model.LastName = user.LastName;
            //        //model.ExistingValues = preference.GetUserPreference(UserPreference.DEFAULTHOMEPAGE, user.UserPreferences);
            //    }
            //    else
            //    {
            //        //model.ExistingValues = preference.GetUserPreference(UserPreference.DEFAULTHOMEPAGE, string.Empty);
            //    }

            //    return this.PartialView("~/views/User/UserPreferences.cshtml", model);
            //}

            #endregion

            #region  Private Methods


            #endregion

        }
    }
