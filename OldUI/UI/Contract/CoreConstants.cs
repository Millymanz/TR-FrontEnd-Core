using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI
{
    /// <summary>
    /// CPF Core area constants.
    /// </summary>
    public class CoreConstants
    {
        /// <summary>
        /// The name of the user cookie.
        /// </summary>
        public const string CookieName = "CPFCookie";

        /// <summary>
        /// The name of the language code cookie.
        /// </summary>
        public const string CookieLanguageCode = "LC";

        /// <summary>
        /// The name of the remember me cookie.
        /// </summary>
        public const string CookieRememberMe = "Me";

        /// <summary>
        /// The component key for logging.
        /// </summary>
        public const string LogComponent = "UI";

        /// <summary>
        /// The CPF Core application object container.
        /// </summary>
        public const string CpfCoreArea = "cpf";

        /// <summary>
        /// The search extension.
        /// </summary>
        public const string SearchExtension = "search";

        /// <summary>
        /// The CPF Core application object type for news.
        /// </summary>
        public const string LogonNewsExtension = "logonnews";

        /// <summary>
        /// Area of users.
        /// </summary>
        public const string UsersArea = "Users";

        /// <summary>
        /// Area of unregistered users.
        /// </summary>
        public const string UnregisteredUsersArea = "UnregisteredUsers";

        /// <summary>
        /// Area of user groups.
        /// </summary>
        public const string UserGroupsArea = "UserGroups";

        /// <summary>
        /// Area of location groups.
        /// </summary>
        public const string LocationGroupsArea = "LocationGroups";

        /// <summary>
        /// The icms area
        /// </summary>
        public const string IcmsArea = "icms";

        /// <summary>
        /// Area of users and groups search.
        /// </summary>
        public const string UsersAndGroupsArea = "UsersAndGroups";

        /// <summary>
        /// Location groups search name.
        /// </summary>
        public const string LocationGroupsSearch = "locationgroups";

        /// <summary>
        /// Search name of location group members auto complete grids. It is used for locations and Location groups auto complete grids.
        /// </summary>
        public const string LocationGroupMembersGroupGridSearch = "LocationGroupMembers";

        /// <summary>
        /// Unregistered users auto complete grid search name.
        /// </summary>
        public const string UnregisteredUserGridSearch = "UnregisteredUsers";

        /// <summary>
        /// Users auto complete grid search name.
        /// </summary>
        public const string UsersGridSearch = "Users";

        /// <summary>
        /// Users search name.
        /// </summary>
        public const string MembersSearch = "members";

        /// <summary>
        /// Data entities search name.
        /// </summary>
        public const string EntitiesSearch = "dataentities";

        /// <summary>
        /// User groups search name.
        /// </summary>
        public const string UserGroupsSearch = "groupsexcludingeveryone";

        /// <summary>
        /// Reports search.
        /// </summary>
        public const string ReportsSearch = "Reports";

        /// <summary>
        /// User Group Search.
        /// </summary>
        public const string GroupSearch = "GroupList";

        /// <summary>
        /// Group permissions search.
        /// </summary>
        public const string UserOrGroupPermissonsSearch = "UserOrGroupPermissions";

        /// <summary>
        /// User location group search. 
        /// </summary>
        public const string LocationGroupSearch = "LocationGroupList";

        /// <summary>
        /// The explorer application container.
        /// </summary>
        public const string ExplorerApplicationContainer = "Explorer";

        /// <summary>
        /// The explorer area search.
        /// </summary>
        public const string ExplorerAreaSearch = "Areas";

        /// <summary>
        /// The user or group permissions virtual file path.
        /// </summary>
        public const string UserOrGroupPermissonsVirtualFilePath = @"/system/cpf/search/userorgrouppermissions.search";
    }
}