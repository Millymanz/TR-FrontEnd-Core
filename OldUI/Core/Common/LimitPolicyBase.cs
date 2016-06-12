using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{
    /// <summary>
    /// The base clase for all limit based policies.
    /// </summary>
    /// <typeparam name="T">The type the limit policy will evaluate.</typeparam>
    /// <typeparam name="C">The type used to describe the limit.</typeparam>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "Valid type.")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "C", Justification = "Valid type.")]
    public abstract class LimitPolicyBase<T, C> : PolicyBase<T>
    {
        #region properties

        /// <summary>
        /// Gets or sets the limit for the policy.
        /// </summary>
        /// <value>The limit specified for the policy.</value>
        public C Limit { get; set; }

        #endregion properties
    }
}
