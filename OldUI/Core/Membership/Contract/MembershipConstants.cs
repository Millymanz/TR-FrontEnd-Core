using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{
    /// <summary>
    /// Membership constants class.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class MembershipConstants
    {
        /// <summary>
        /// Log component key.
        /// </summary>
        public static readonly string LogComponentKey = "MEMBERSHIP";

        /// <summary>
        /// The cache container key.
        /// </summary>
        public static readonly string CacheContainerKey = "MEMBERSHIP";

        /// <summary>
        /// The adhoc user delegate cache container.
        /// </summary>
        public static readonly string AdhocUserDelegateCacheContainer = "AdhocUserDelegateCache";

        /// <summary>
        /// The adhoc user escalation cache container.
        /// </summary>
        public static readonly string AdhocUserEscalationCacheContainer = "AdhocUserEscalationCache";

        /// <summary>
        /// The adhoc user application permission cache container.
        /// </summary>
        public static readonly string AdhocUserAppPermissionCacheContainer = "AdhocUserAppPermissionsCache";

        /// <summary>
        /// The adhoc user application permission cache container.
        /// </summary>
        public static readonly string AdhocUserPermissionCacheContainer = "AdhocUserPermissionsCache";

        /// <summary>
        /// The user permissions applied to an app cache container.
        /// </summary>
        public static readonly string UserPermissionsWithinAppCacheContainer = "UserPermissionsWithinAppCache";

        /// <summary>
        /// The adhoc user instance permission cache container.
        /// </summary>
        public static readonly string AdhocUserInstancePermissionCacheContainer = "AdhocUserInstancePermissionCache";

        /// <summary>
        /// The user group cache container.
        /// </summary>
        public static readonly string UserGroupCacheContainer = "UserGroupCache";
    }
}
