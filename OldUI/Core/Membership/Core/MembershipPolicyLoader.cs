using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Common;
using TradeRiser.Core.Configuration;

namespace TradeRiser.Core.Membership
{
    /// <summary>
    ///  Membership policy loader
    /// </summary>
    public class MembershipPolicyLoader : PolicyLoaderBase
    {
        #region constants

        private const string AccountLockedTimeout = "AccountLockedTimeout";

        private const string AccountLockoutPolicy = "AccountLockout";

        private const string InactiveDisableDaysPolicy = "InactiveDisableDays";

        private const string MembershipPolicyContainer = "CpfMembership";

        private const string PasswordExpiryPolicy = "PasswordExpiry";

        private const string PasswordHistoryPolicy = "PasswordHistory";

        private const string PasswordLengthPolicy = "PasswordLength";

        private const string PasswordLowerCharactersPolicy = "PasswordLowerChars";

        private const string PasswordNumericDigitsPolicy = "PasswordNumericDigits";

        private const string PasswordUpperCharactersPolicy = "PasswordUpperChars";

        #endregion constants

        #region public methods

        /// <summary>
        /// Loads the membership policySet into the specified policySet object.
        /// </summary>
        /// <param name="policySet">The membership policySet.</param>
        public override void LoadPolicy(PolicySet policySet)
        {
            MembershipPolicy membershipPolicy = policySet as MembershipPolicy;
            MembershipService service = new MembershipService();

            IList<ConfigPolicySetting> results = service.GetPasswordPolicy("Membership");
            IList<PolicySetting<int>> converted = (from result in results
                                                   select new PolicySetting<int>()
                                                   {
                                                       Enabled = result.Enabled,
                                                       Name = result.Name,
                                                       Value = result.Value
                                                   }).ToList();

            SetPolicy(converted, AccountLockoutPolicy, membershipPolicy.LockAccount);
            SetPolicy(converted, PasswordExpiryPolicy, membershipPolicy.PasswordExpiry);
            SetPolicy(converted, PasswordLengthPolicy, membershipPolicy.PasswordLength);
            SetPolicy(converted, PasswordNumericDigitsPolicy, membershipPolicy.PasswordMinDigits);
            SetPolicy(converted, PasswordHistoryPolicy, membershipPolicy.PasswordHistory);
            SetPolicy(converted, PasswordUpperCharactersPolicy, membershipPolicy.PasswordUpperCharacters);
            SetPolicy(converted, PasswordLowerCharactersPolicy, membershipPolicy.PasswordLowerCharacters);
            SetPolicy(converted, AccountLockedTimeout, membershipPolicy.AccountLockedTimeout);
            SetPolicy(converted, InactiveDisableDaysPolicy, membershipPolicy.InactiveDisableDays);
        }

        #endregion public methods
    }

}
