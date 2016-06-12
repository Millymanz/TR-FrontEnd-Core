﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Data;

namespace TradeRiser.Core.Membership
{
    public class PermissionService
    {
        #region  Fields

        /////// <summary>
        /////// The blanka.
        /////// </summary>
        ////private readonly MemoryVaultManager blanka;

        /// <summary>
        /// Gets the cache expiry.
        /// </summary>
        /// <value>
        /// The cache expiry.
        /// </value>
        private readonly TimeSpan cacheExpiry;

        /// <summary>
        /// The data access.
        /// </summary>
        private IDataAccess data;

        #endregion

        #region  Properties and Indexers

        /// <summary>
        /// Gets the data access.
        /// </summary>
        /// <value>
        /// The data access.
        /// </value>
        private IDataAccess DataAccess
        {
            get
            {
                if (this.data == null)
                {
                    this.data = new DataAccess();
                }

                return this.data;
            }
        }

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="PermissionService" /> class.
        /// </summary>
        /// <param name="cacheExipiry">The cache expiry.</param>
        public PermissionService(TimeSpan cacheExipiry)
        {
            ////this.cacheExpiry = cacheExipiry;
            ////this.blanka = new MemoryVaultManager();
        }

        #endregion

        #region  Public Methods

        /////// <summary>
        /////// Determines if the user has permission to an application.
        /////// </summary>
        /////// <param name="userId">The user identifier.</param>
        /////// <param name="appName">Name of the application.</param>
        ////public bool UserHasPermissionToApp(Guid userId, string appName)
        ////{
        ////    string[] apps = this.GetAllUsersApps(userId);

        ////    if (apps == null)
        ////    {
        ////        return false;
        ////    }

        ////    for (int i = 0; i < apps.Length; i++)
        ////    {
        ////        if (apps[i].Equals(appName))
        ////        {
        ////            return true;
        ////        }
        ////    }

        ////    return false;
        ////}

        /////// <summary>
        /////// Check if the user the has a permission.
        /////// </summary>
        /////// <param name="userId">The user ID.</param>
        /////// <param name="virtualFilePath">The repo identifier.</param>
        /////// <param name="permissionName">Name of the permission.</param>
        /////// <returns>
        /////// A true or false indicator.
        /////// </returns>
        ////public bool UserHasPermission(Guid userId, string virtualFilePath, string permissionName)
        ////{
        ////    if (userId == null)
        ////    {
        ////        throw new ArgumentNullException("userId");
        ////    }

        ////    if (string.IsNullOrEmpty(virtualFilePath))
        ////    {
        ////        throw new ArgumentNullException("virtualFilePath");
        ////    }

        ////    if (string.IsNullOrEmpty(permissionName))
        ////    {
        ////        throw new ArgumentNullException("permissionName");
        ////    }

        ////    string cacheKey = this.GetCacheKey(MembershipConstants.AdhocUserPermissionCacheContainer, userId);
        ////    Dictionary<string, List<string>> allUserPermissions = this.blanka.Get(cacheKey) as Dictionary<string, List<string>>;

        ////    if (allUserPermissions == null)
        ////    {
        ////        allUserPermissions = this.GetUserPermissions(userId);

        ////        this.blanka.Add(cacheKey, allUserPermissions, this.cacheExpiry, new List<string> { PermissionManager.UserPermissionsCategory });
        ////    }

        ////    if (!allUserPermissions.ContainsKey(virtualFilePath))
        ////    {
        ////        return false;
        ////    }

        ////    List<string> perms;
        ////    allUserPermissions.TryGetValue(virtualFilePath, out perms);

        ////    return perms != null && perms.Contains(permissionName);
        ////}

        /////// <summary>
        /////// Users the has permission within application.
        /////// </summary>
        /////// <param name="userId">The user identifier.</param>
        /////// <param name="appName">Name of the application.</param>
        /////// <param name="permissionName">Name of the permission.</param>
        /////// <exception cref="System.ArgumentNullException">
        /////// UserId or appName or permissionName.
        /////// </exception>
        ////public bool UserHasPermissionWithinApp(Guid userId, string appName, string permissionName)
        ////{
        ////    if (userId == null)
        ////    {
        ////        throw new ArgumentNullException("userId");
        ////    }

        ////    if (string.IsNullOrEmpty(appName))
        ////    {
        ////        throw new ArgumentNullException("appName");
        ////    }

        ////    if (string.IsNullOrEmpty(permissionName))
        ////    {
        ////        throw new ArgumentNullException("permissionName");
        ////    }

        ////    string cacheKey = this.GetCacheKey(MembershipConstants.UserPermissionsWithinAppCacheContainer, userId);
        ////    Dictionary<string, List<string>> allUserPermissionsWithinApp = this.blanka.Get(cacheKey) as Dictionary<string, List<string>>;

        ////    if (allUserPermissionsWithinApp == null)
        ////    {
        ////        allUserPermissionsWithinApp = this.GetUserPermissionsWithinApps(userId);
        ////        this.blanka.Add(cacheKey, allUserPermissionsWithinApp, this.cacheExpiry, new List<string> { PermissionManager.UserPermissionsCategory });
        ////    }

        ////    if (!allUserPermissionsWithinApp.ContainsKey(appName))
        ////    {
        ////        return false;
        ////    }

        ////    List<string> perms;
        ////    allUserPermissionsWithinApp.TryGetValue(appName, out perms);

        ////    return perms != null && perms.Contains(permissionName);
        ////}

        /// <summary>
        /// Check if the user the has a permission to an instance.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        public Dictionary<string, List<string>> GetUserPermissions(Guid userId)
        {
            Dictionary<string, List<string>> allPermissions = new Dictionary<string, List<string>>();

            using (this.DataAccess)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "[membership].[UserPermissionsSelect]", MembershipConstants.AdhocUserPermissionCacheContainer);
                settings.Parameters.Add(new DataParameter
                {
                    ParameterName = "@UserID",
                    Value = userId
                });

                DataResult result = this.data.ExecuteQuery(settings);

                List<string> permNames = null;

                if (!result.Success)
                {
                    return allPermissions;
                }

                while (result.Reader.Read())
                {
                    string virtualFilePath = result.Reader.Get<string>("VirtualFilePath");
                    string permissionName = result.Reader.Get<string>("Name");

                    if (!allPermissions.ContainsKey(virtualFilePath))
                    {
                        permNames = new List<string>
                        {
                            permissionName
                        };

                        allPermissions.Add(virtualFilePath, permNames);
                    }
                    else
                    {
                        if (permNames == null)
                        {
                            permNames = new List<string>();
                        }

                        permNames.Add(permissionName);
                        allPermissions[virtualFilePath] = permNames;
                    }
                }
            }

            return allPermissions;
        }

        /////// <summary>
        /////// Check if the user the has a permission to an instance.
        /////// </summary>
        /////// <param name="userId">The user ID.</param>
        ////private Dictionary<string, List<string>> GetUserPermissionsWithinApps(Guid userId)
        ////{
        ////    // dictionary[key=appName][value=permission name csv]
        ////    Dictionary<string, List<string>> allAppPermissions = new Dictionary<string, List<string>>();

        ////    using (this.DataAccess)
        ////    {
        ////        DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "[membership].[UserPermissionsSelect]", MembershipConstants.AdhocUserPermissionCacheContainer);
        ////        settings.Parameters.Add(new DataParameter
        ////        {
        ////            ParameterName = "@UserID",
        ////            Value = userId
        ////        });

        ////        DataResult result = this.data.ExecuteQuery(settings);

        ////        List<string> permNames = null;

        ////        if (!result.Success)
        ////        {
        ////            return allAppPermissions;
        ////        }

        ////        while (result.Reader.Read())
        ////        {
        ////            string virtualFilePath = result.Reader.Get<string>("VirtualFilePath");
        ////            string permissionName = result.Reader.Get<string>("Name");
        ////            string appName = Path.GetFileName(virtualFilePath);
        ////            if (string.IsNullOrEmpty(appName))
        ////            {
        ////                continue;
        ////            }

        ////            if (!allAppPermissions.ContainsKey(appName))
        ////            {
        ////                permNames = new List<string>
        ////                {
        ////                    permissionName
        ////                };

        ////                allAppPermissions.Add(appName, permNames);
        ////            }
        ////            else
        ////            {
        ////                if (permNames == null)
        ////                {
        ////                    permNames = new List<string>();
        ////                }

        ////                permNames.Add(permissionName);
        ////                allAppPermissions[appName] = permNames;
        ////            }
        ////        }
        ////    }

        ////    return allAppPermissions;
        ////}

        #endregion

        #region  Private Methods

        /////// <summary>
        /////// Gets all users apps.
        /////// </summary>
        /////// <param name="userId">The user identifier.</param>
        ////private string[] GetAllUsersApps(Guid userId)
        ////{
        ////    string cacheKey = this.GetCacheKey("apps", userId);
        ////    string[] apps = this.blanka.Get(cacheKey) as string[];

        ////    if (apps != null)
        ////    {
        ////        return apps;
        ////    }

        ////    using (this.DataAccess)
        ////    {
        ////        DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "[traderiser].[RepoSelectAppsForUser]", MembershipConstants.AdhocUserPermissionCacheContainer);
        ////        settings.Parameters.Add(new DataParameter
        ////        {
        ////            ParameterName = "@userId",
        ////            Value = userId
        ////        });

        ////        DataResult result = this.DataAccess.ExecuteQuery(settings);

        ////        List<string> usersApps = new List<string>();

        ////        if (!result.Success)
        ////        {
        ////            return usersApps.ToArray();
        ////        }

        ////        while (result.Reader.Read())
        ////        {
        ////            string virtualFilePath = result.Reader.Get<string>("VirtualFilePath");
        ////            string appName = Path.GetFileName(virtualFilePath);
        ////            usersApps.Add(appName);
        ////        }

        ////        apps = usersApps.ToArray();
        ////        this.blanka.Add(cacheKey, apps, this.cacheExpiry, new List<string> { PermissionManager.UserPermissionsCategory });
        ////    }

        ////    return apps;
        ////}

        /// <summary>
        /// Gets the cache key.
        /// </summary>
        /// <param name="container">The container.</param>
        /// <param name="userId">The user identifier.</param>
        private string GetCacheKey(string container, Guid userId)
        {
            return string.Format("{0}_{1}", container, userId);
        }

        #endregion
    }
}
