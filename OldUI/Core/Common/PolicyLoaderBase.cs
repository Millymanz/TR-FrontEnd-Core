using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Defines the base class for policy loaders.
    /// </summary>
    public abstract class PolicyLoaderBase : IPolicyLoader
    {
        #region properties

        /// <summary>
        /// Gets or sets the connection details used for loading the policy.
        /// </summary>
        /// <value>The connection details for loading the policy.</value>
        public string ConnectionDetails { get; set; }

        #endregion properties

        #region public methods

        /// <summary>
        /// Applies the named policy setting to the provided policy item.
        /// </summary>
        /// <typeparam name="T">The data type the policy operates on.</typeparam>
        /// <typeparam name="C">The data type of the policy limit.</typeparam>
        /// <param name="policySettings">The list of policy settings containing the policy to apply.</param>
        /// <param name="name">The name of the policy matching an item in the list.</param>
        /// <param name="policy">The policy to apply the setting to.</param>
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
                ////throw new PolicyLoaderException(Resx.Format(PolicyResources.PolicyNotFound, name));
            }
        }

        /// <summary>
        /// Loads the policies into the provided policy set object.
        /// </summary>
        /// <param name="policySet">The policy set object to load.</param>
        public abstract void LoadPolicy(PolicySet policySet);

        #endregion public methods
    }
}
