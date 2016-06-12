using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Configuration;

namespace TradeRiser.Core.Membership
{
    /// <summary>
    ///     Provides CPF membership functionality.
    /// </summary>
    public interface IMembershipService
    {
        #region  Properties and Indexers

        /// <summary>
        ///     Gets or sets the configuration.
        /// </summary>
        /// <value>The configuration.</value>
        ConfigurationService Configuration
        {
            get;
            set;
        }

 
        #endregion

        #region  Public Methods

        /// <summary>
        ///     Sends the password email.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="newPassword">The new password.</param>
        /// <param name="resetPassword">If set to <c>true</c> [reset password].</param>
        void SendPasswordEmail(User user, string newPassword, bool resetPassword = false);

        ///// <summary>
        /////     Clears the cache.
        ///// </summary>
        ///// <param name="container">The container.</param>
        ///// <param name="userID">The user identifier.</param>
        //void ClearCache(string container, Guid userID);

        /// <summary>
        ///     Builds the password creation policy message.
        /// </summary>
        string BuildPasswordCreationPolicyMessage();

        /// <summary>
        ///     Creates the user.
        /// </summary>
        /// <param name="user">The user to create.</param>
        /// <returns>
        ///     A User object representing the user just created.
        /// </returns>
        CreateUserResult CreateUser(User user);

        ///// <summary>
        /////     Delegate ids to user.
        ///// </summary>
        ///// <param name="userId">The user identifier.</param>
        //List<User> DelegatedToUser(Guid userId);

        /////// <summary>
        /////     Purges the delegation and escalation cache.
        ///// </summary>
        ///// <param name="userID">The user identifier.</param>
        //void PurgeDelegationAndEscalationCache(Guid userID);

        ///// <summary>
        ///// Deletes the permission.
        ///// </summary>
        ///// <param name="virtualFilePath">The virtual file path.</param>
        ///// <param name="permissionName">Name of the permission.</param>
        ///// <param name="userId">The user id.</param>
        //bool DeletePermission(string virtualFilePath, string permissionName, string userId = null);

        /// <summary>
        ///     Deletes the specified user from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>True if user removed successfully.</returns>
        bool DeleteUser(List<Guid> userIds);

        ///// <summary>
        /////     Deletes the user or group permission.
        ///// </summary>
        ///// <param name="permissionId">The permission id.</param>
        //bool DeleteUserOrGroupPermission(Guid permissionId);

        ///// <summary>
        ///     Disables the specified users from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>True if users disabled successfully.</returns>
        bool DisableUsers(List<string> userIds);

        /// <summary>
        ///     Enables the specified users from the Core.
        /// </summary>
        /// <param name="userIds">The user ids.</param>
        /// <returns>True if users enabled successfully.</returns>
        bool EnableUsers(List<string> userIds);

        /// <summary>
        ///     Generates a random password for the user.
        /// </summary>
        /// <returns>The generated password.</returns>
        string GeneratePassword();

        /// <summary>
        ///     Get passwords policy.
        /// </summary>
        /// <param name="container">The container.</param>
        List<ConfigPolicySetting> GetPasswordPolicy(string container);

        /// <summary>
        ///     Gets the user by email.
        /// </summary>
        /// <param name="email">The email.</param>
        User GetUserByEmail(string email);

        /// <summary>
        ///     Gets the User details by user id.
        /// </summary>
        /// <param name="userID">The user ID.</param>
        /// <param name="ignoreCache">If set to <c>true</c> [ignore cache].</param>
        /// <returns>
        ///     A user object representing the requested user.
        /// </returns>
        User GetUserByID(Guid userID, bool ignoreCache = false);

        /// <summary>
        ///     Gets the User details by userName.
        /// </summary>
        /// <param name="userName">Name of the user.</param>
        /// <returns>A user object representing the requested user.</returns>
        User GetUserByUserName(string userName);

        /// <summary>
        ///     Gets the User by first and last name.
        /// </summary>
        /// <param name="firstName">The first name.</param>
        /// <param name="lastName">The last name.</param>
        /// <returns>A user object representing the requested user.</returns>
        User GetUserByUserName(string firstName, string lastName);

  
        //  /// <summary>
        /////     Gets the user or group in permissions by permission id.
        ///// </summary>
        ///// <param name="permissionId">The permission id.</param>
        //Dictionary<string, string> GetUserOrGroupsByPermissionId(Guid permissionId);

        ///// <summary>
        /////     Gets the users group IDs.
        ///// </summary>
        ///// <param name="userID">The user ID.</param>
        //List<Guid> GetUsersGroups(Guid userID);

  
        // /// <summary>
        ///// Determines whether [is default permissions] [the specified container].
        ///// </summary>
        ///// <param name="virtualFilePath">The virtual file path.</param>
        ///// <param name="permissionName">Name of the permission.</param>
        ///// <returns>
        /////   <c>true</c> if [is default permissions] [the specified container]; otherwise, <c>false</c>.
        ///// </returns>
        //bool IsDefaultPermission(string virtualFilePath, string permissionName);

             /// <summary>
        ///     Resets the users password.
        /// </summary>
        /// <param name="username">The username.</param>
        Tuple<bool, string, string> ResetPassword(string username);

    
        /// <summary>
  
        /// <summary>
        ///     Updates the user.
        /// </summary>
        /// <param name="user">The user details to save.</param>
        /// <param name="refreshCache">If set to <c>true</c> [refresh cache].</param>
        CreateUserResult UpdateUser(User user, bool refreshCache = true);

  
         #endregion
    }
}
