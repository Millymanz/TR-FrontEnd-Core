
namespace TradeRiser.Core.Common
{
    using System.Collections.Generic;
    using System.Linq;
    using System;

    public abstract class PolicyLoaderBase : IPolicyLoader
    {
        #region properties

        public string ConnectionDetails { get; set; }

        #endregion properties

        #region public methods

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "Valid name.")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "C", Justification = "Valid name.")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1006:DoNotNestGenericTypesInMemberSignatures", Justification = "Internal use only.")]
        public static void SetPolicy<T, C>(IList<PolicySetting<C>> policySettings, string name, LimitPolicyBase<T, C> policy)
        {
            PolicySetting<C> policySetting = policySettings.SingleOrDefault(a => a.Name == name);

            if (policySetting != null)
            {
                policy.Enabled = policySetting.Enabled;
                policy.Limit = policySetting.Value;
            }
            else
            {
                throw new Exception(string.Format("Policy Not {0} Found", name));
            }
        }

        public abstract void LoadPolicy(PolicySet policySet);

        #endregion public methods
    }
}
