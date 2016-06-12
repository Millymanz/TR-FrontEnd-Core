using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TradeRiser.Core.Common;
using TradeRiser.Core.Configuration;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Mail;
using TradeRiser.Core.SignOn;

namespace TradeRiser.Core.Membership
{

    /// <summary>
    ///     Membership service.
    /// </summary>
    public class MembershipService : IMembershipService
    {
        /// <summary>
        /// The excluded related key.
        /// </summary>
        private const string ExcludedRelatedKey = "InstanceExcludedFrom";

        /// <summary>
        /// The membership app name.
        /// </summary>
        private const string AppName = "membership.app";

        /// <summary>
        ///     The sender.
        /// </summary>
        private const string SENDER = "MembershipService";

        #region  Fields

        /// <summary>
        ///     The data access.
        /// </summary>
        private readonly MembershipDataAccess data;

        
        /// <summary>
        ///     The current membership policy.
        /// </summary>
        private MembershipPolicy membershipPolicy;

        /// <summary>
        ///     A password generator.
        /// </summary>
        private PasswordGenerator passwordGenerator;

        /// <summary>
        ///     The sign on service.
        /// </summary>
        private UserSignOnService signOnService;

        #endregion

        #region  Constructors

        public MembershipService( )
        {
            this.data = new MembershipDataAccess();
        }
        /// <summary>
        ///     Initializes a new instance of the <see cref="MembershipService" /> class.
        /// </summary>
        /// <param name="configurationService">The configuration service.</param>
        //[InjectionConstructor]
        public MembershipService(ConfigurationService configurationService)
        {
            this.Configuration = configurationService;
            this.data = new MembershipDataAccess();
        }

        #endregion

        #region  Properties and Indexers

        /// <summary>
        ///     Gets the get user sign on service.
        /// </summary>
        /// <value>
        ///     The get user sign on service.
        /// </value>
        public UserSignOnService GetUserSignOnService
        {
            get
            {
                if (this.signOnService == null)
                {
                    this.signOnService = new UserSignOnService(this.Configuration);
                }

                return this.signOnService;
            }
        }

      
        #endregion

        #region IMembershipService Members

        /// <summary>
        ///     Gets or sets the configuration.
        /// </summary>
        /// <value>The configuration.</value>
        public ConfigurationService Configuration
        {
            get;
            set;
        }


        /// <summary>
        ///     Gets or sets the membership policy.
        /// </summary>
        /// <value>The membership policy.</value>
        public MembershipPolicy MembershipPolicy
        {
            get
            {
                if (this.membershipPolicy == null)
                {
                    this.membershipPolicy = new MembershipPolicy(new MembershipPolicyLoader());
                }

                return this.membershipPolicy;
            }

            set
            {
                this.membershipPolicy = value;
            }
        }

        /// <summary>
        ///     Builds the password creation policy message.
        /// </summary>
        public string BuildPasswordCreationPolicyMessage()
        {
            IPolicyLoader policy = new MembershipPolicyLoader();
            MembershipPolicy pp = new MembershipPolicy(policy);
            return pp.BuildPasswordCreationPolicyMessage();
        }


        /// <summary>
        ///     Creates the user.
        /// </summary>
        /// <param name="user">The user to create.</param>
        /// <returns>
        ///     A User object representing the user just created.
        /// </returns>
        public CreateUserResult CreateUser(User user)
        {
            CreateUserResult result = new CreateUserResult();

            // validate if username is alphanumeric
            if (this.ValidateUserName(user.UserName))
            {
                // check if this user already exists
                if (this.GetUserSignOnService.UserExists(user.UserName))
                {
                    result.UserCreated = false;
                    result.Messages.Add(Resx.Format(TradeRiserCoreResource.CreateUserAlreadyExists, user.UserName));
                    return result;
                }
            }
            else
            {
                result.UserCreated = false;
                result.Messages.Add(Resx.Format(TradeRiserCoreResource.CreateUserInvalidCharacter, user.UserName));
                return result;
            }

            // check the email
            if (this.GetUserSignOnService.GetUserByEmail(user.Email) != null)
            {
                result.UserCreated = false;
                result.Messages.Add(Resx.Format(TradeRiserCoreResource.CreateUserEmailInUse, user.Email));
                return result;
            }

            string password = this.GetUserSignOnService.GeneratePassword();

            try
            {
                user.Password = CpfHash.ComputeHash(password);

                Guid userId = Guid.Empty;

                result.UserCreated = this.data.CreateUser(user, out userId);

                if (result.UserCreated)
                {
                    result.UserID = userId;

                    string auditMessage = string.Format("User with Name:{0}, UserName:{1} has been created.", user.UserDisplayName, user.UserName);
                    Log.Audit(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);
                }
            }
            catch (SqlException sqlEexception)
            {
                Log.Warning(MembershipConstants.LogComponentKey, MembershipService.SENDER, string.Format("Attempt to create an user with Name:{0}, UserName:{1} has failed.", user.UserDisplayName, user.UserName));
                Log.Exception(MembershipConstants.LogComponentKey, MembershipService.SENDER, sqlEexception);
                throw;
            }

            if (result.UserCreated)
            {
                try
                {
                    // send email
                    this.SendPasswordEmail(user, password);
                }
                catch (Exception ex)
                {
                    Log.Exception(MembershipConstants.LogComponentKey, MembershipService.SENDER, ex);
                }
            }

            return result;
        }

        /// <summary>
        ///     Deletes the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>
        ///     True if user removed successfully.
        /// </returns>
        public bool DeleteUser(List<Guid> userIds)
        {
            // TODO : Delete user from roles
            // TODO : Delete user from teams
            UserSignOnService service = new UserSignOnService(this.Configuration);

            bool hasRemoved = this.data.DeleteUser(userIds);

            string listOfUserId = string.Join(", ", userIds.ToArray());
            if (hasRemoved)
            {
                // remove users from the user signon service cache.
                for (int i = 0; i < userIds.Count; i++)
                {
                    service.PurgeCache(userIds[i]);
                   // this.PurgeDelegationAndEscalationCache(userIds[i]);
                }

                string auditMessage = string.Format("The user id(s) {0} are deleted. ", listOfUserId);
                Log.Audit(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);

            }
            else
            {
                string auditMessage = string.Format("Attempt to delete {0} user id(s) failed.", listOfUserId);
                Log.Warning(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);
            }

            return hasRemoved;
        }

        /// <summary>
        ///     Disables the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>
        ///     True if user disabled successfully.
        /// </returns>
        public bool DisableUsers(List<string> userIds)
        {
            bool hasDisabled = this.data.DisableUser(userIds);

            string listOfUserId = string.Join(", ", userIds.ToArray());
            if (hasDisabled)
            {
                UserSignOnService service = new UserSignOnService(this.Configuration);
                service.PurgeCache(userIds.Select(n => new Guid(n)).ToArray());

                string auditMessage = string.Format("The user id(s) {0} are disabled. ", listOfUserId);
                Log.Audit(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);

                        }
            else
            {
                string auditMessage = string.Format("Attempt to disable {0} user id(s) failed.", listOfUserId);
                Log.Warning(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);
            }

            return hasDisabled;
        }

        /// <summary>
        ///     Enables the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>
        ///     True if user enabled successfully.
        /// </returns>
        public bool EnableUsers(List<string> userIds)
        {
            bool hasEnabled = this.data.EnableUser(userIds);

           

            string listOfUserId = string.Join(", ", userIds.ToArray());
            if (hasEnabled)
            {
                string auditMessage = string.Format("The user id(s) {0} are enabled. ", listOfUserId);
                Log.Audit(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);

            }
            else
            {
                string auditMessage = string.Format("Attempt to enable {0} user id(s) failed.", listOfUserId);
                Log.Warning(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);
            }

            return hasEnabled;
        }

        /// <summary>
        ///     Generates a random password for the user.
        /// </summary>
        /// <returns>The generated password.</returns>
        public string GeneratePassword()
        {
            if (this.passwordGenerator == null)
            {
                this.passwordGenerator = new PasswordGenerator(this.MembershipPolicy);
            }

            return this.passwordGenerator.GeneratePassword();
        }




        /// <summary>
        ///     Get passwords the policy.
        /// </summary>
        /// <param name="container">The container.</param>
        /// <returns>Password Policy.</returns>
        public List<ConfigPolicySetting> GetPasswordPolicy(string container)
        {
            return this.data.GetPasswordPolicy(container);
        }

       
        /// <summary>
        ///     Gets the User details by email.
        /// </summary>
        /// <param name="email">Email address of the user.</param>
        /// <returns>
        ///     A user object representing the requested user.
        /// </returns>
        public User GetUserByEmail(string email)
        {
            UserSignOnService service = new UserSignOnService(this.Configuration);

            return service.GetUserByEmail(email);
        }

        /// <summary>
        /// Gets the user by ID.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="ignoreCache"><c>True</c> to ignore cache.</param>
        /// <returns>
        /// A user object representing the requested user.
        /// </returns>
        public User GetUserByID(Guid userID, bool ignoreCache = false)
        {
            return this.GetUserSignOnService.GetUserById(userID, ignoreCache);
        }

        /// <summary>
        ///     Gets the User details by userName.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns>
        ///     A user object representing the requested user.
        /// </returns>
        public User GetUserByUserName(string userName)
        {
            User user = this.GetUserSignOnService.GetUserByUserName(userName);
            return user;
        }

        /// <summary>
        ///     Gets the User by first and last name.
        /// </summary>
        /// <param name="firstName">The first name.</param>
        /// <param name="lastName">The last name.</param>
        /// <returns>
        ///     A user object representing the requested user.
        /// </returns>
        public User GetUserByUserName(string firstName, string lastName)
        {
            return this.data.GetAllUsers().FirstOrDefault(n => string.Compare(n.FirstName, firstName, StringComparison.InvariantCultureIgnoreCase) == 0 && string.Compare(n.LastName, lastName, StringComparison.InvariantCultureIgnoreCase) == 0);
        }

        public List<User> GetAllUsers()
        {
            return this.data.GetAllUsers();
        }


        /// <summary>
        ///     Resets the users password.
        /// </summary>
        /// <param name="username">The username.</param>
        public Tuple<bool, string, string> ResetPassword(string username)
        {
            bool passwordChanged = false;

            User user = this.GetUserByUserName(username);

            string password = null;

            if (user != null)
            {
                password = this.GeneratePassword();

                user.Password = CpfHash.ComputeHash(password);
                user.ChangePassword = true;
                user.Locked = false;
                user.LastPasswordReset = DateTime.UtcNow;
                user.InvalidLogOnAttempts = 0;

                this.UpdateUser(user);
                Dictionary<string, object> updates = new Dictionary<string, object>
                                                         {
                                                             {
                                                                 "Password", user.Password
                                                             },
                                                             {
                                                                 "ChangePassword", user.ChangePassword
                                                             },
                                                             {
                                                                 "Locked", user.Locked
                                                             },
                                                             {
                                                                 "LastPasswordReset", user.LastPasswordReset
                                                             },
                                                             {
                                                                 "InvalidLogOnAttempts", user.InvalidLogOnAttempts
                                                             }
                                                         };

                this.SendPasswordEmail(user, password, true);

                passwordChanged = true;

            }

            return new Tuple<bool, string, string>(passwordChanged, passwordChanged ? TradeRiserCoreResource.PasswordResetEmailed : Resx.Format(TradeRiserCoreResource.ResetPasswordFailedUnknownUser, username), password);
        }

         
   
    
        /// <summary>
        ///     Updates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="refreshCache">If set to <c>true</c> [refresh cache].</param>
        public CreateUserResult UpdateUser(User user, bool refreshCache = true)
        {
            CreateUserResult result = new CreateUserResult();

            // get user direct from the database.
            User userWithEmail = this.GetUserByEmail(user.Email);

            if (userWithEmail != null)
            {
                if (userWithEmail.UserID != user.UserID)
                {
                    result.UserCreated = false;
                    result.Messages.Add(Resx.Format(TradeRiserCoreResource.CreateUserEmailInUse, user.Email));
                    return result;
                }

                // if the account has been unlocked, make sure the retry count is set back to zero
                if (userWithEmail.Locked && !user.Locked)
                {
                    user.InvalidLogOnAttempts = 0;
                }     
            }

            try
            {
                Guid userId = Guid.Empty;
                result.UserCreated = this.data.UpdateUser(user, out userId);
                result.UserID = userId;
                if (result.UserCreated)
                {
                    string auditMessage = string.Format("The user {0} with username {1} has been updated.", user.UserDisplayName, user.UserName);
                    Log.Audit(MembershipConstants.LogComponentKey, MembershipService.SENDER, auditMessage);

                    if (refreshCache)
                    {
                        // kill off the adhoc cache in usersignon service
                        this.GetUserSignOnService.PurgeCache(user.UserID);
                    }

                 }
            }
            catch (SqlException sqlException)
            {
                Log.Exception(MembershipConstants.LogComponentKey, MembershipService.SENDER, sqlException);
                throw;
            }

            return result;
        }



        /// <summary>
        ///     Sends the password email.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="resetPassword">If set to <c>true</c> [reset password].</param>
        public void SendPasswordEmail(User user, string newPassword, bool resetPassword = false)
        {
            MembershipConfiguration config = new MembershipConfiguration(this.Configuration);

            if (!config.EmailIntegration)
            {
                return;
            }

            string message = MembershipService.BuildEmailFromTokens(config, resetPassword ? config.EmailResetPasswordMessage : config.EmailNewUserMessage, "Core.EmailToken", user.UserName, newPassword);

            this.SendEmail(config, resetPassword ? config.EmailResetPasswordSubject : config.EmailNewUserSubject, message, user.Email);
        }

        #endregion

        #region  Public Methods

        /// <summary>
        ///     Validates the name of the user.
        /// </summary>
        /// <param name="usernameToCheck">The username to check.</param>
        /// <returns>True if it is a valid username.</returns>
        public bool ValidateUserName(string usernameToCheck)
        {
            // validate username conforms to the expression
            Regex rg = new Regex(@"^[a-zA-Z0-9_]*$");
            return rg.IsMatch(usernameToCheck);
        }

        #endregion

        #region  Private Methods

        /// <summary>
        ///     Builds the email from tokens.
        /// </summary>
        /// <param name="config">The config.</param>
        /// <param name="messageTemplate">The message template.</param>
        /// <param name="tokenGroup">The token group.</param>
        /// <param name="userName">Name of the user.</param>
        /// <param name="password">The password.</param>
        /// <returns>Mail content.</returns>
        private static string BuildEmailFromTokens(MembershipConfiguration config, string messageTemplate, string tokenGroup, string userName, string password)
        {
            Dictionary<string, string> tokens = config.GetEmailTokens(tokenGroup);

            // add common tokens
            tokens.Add("{USERNAME}", userName);
            tokens.Add("{PASSWORD}", password);

            foreach (KeyValuePair<string, string> token in tokens)
            {
                messageTemplate = messageTemplate.Replace(token.Key.ToUpperInvariant(), token.Value);
            }

            messageTemplate = messageTemplate.Replace("\\n", Environment.NewLine);

            return messageTemplate;
        }

        /// <summary>
        /// Gets the cache key.
        /// </summary>
        /// <param name="container">The container.</param>
        /// <param name="userId">The user identifier.</param>
        private static string GetCacheKey(string container, Guid userId)
        {
            return string.Format("{0}_{1}", container, userId);
        }

        /// <summary>
        ///     Sends the email.
        /// </summary>
        /// <param name="config">The config.</param>
        /// <param name="subject">The subject.</param>
        /// <param name="message">The message.</param>
        /// <param name="emailAddress">The email address.</param>
        private void SendEmail(MembershipConfiguration config, string subject, string message, string emailAddress)
        {
            Email email = new Email
            {
                From = config.EmailFromAddress,
                FromDisplayName = config.EmailFromDisplayName,
                To = emailAddress,
                Subject = subject,
                Message = message,
                ReplyTo = config.EmailReplyToAddress,
                ReplyToDisplayName = config.EmailReplyToDisplayName
            };

            EmailSender sender = new EmailSender();

            sender.Send(email);
        }

        #endregion
    }
}
