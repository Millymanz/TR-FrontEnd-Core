using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Base class for policy objects.
    /// </summary>
    /// <typeparam name="T">The type the policy will evaluate.</typeparam>
    public abstract class PolicyBase<T>
    {
        #region constructors

        /// <summary>
        /// Initializes a new instance of the PolicyBase class.
        /// </summary>
        protected PolicyBase()
        {
            this.Enabled = true;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets a value indicating whether this policy is enabled.
        /// </summary>
        /// <value><c>True</c> if enabled; otherwise, <c>false</c>.</value>
        public bool Enabled { get; set; }

        #endregion properties

        #region public methods

        /// <summary>
        /// Evaluates the specified value against the policy.
        /// </summary>
        /// <param name="value">The value to evaluate against the policy.</param>
        /// <returns>True if the value evaluates against the policy, otherwise false.  Always returns false if the policy is not enabled.</returns>
        public abstract bool Evaluate(T value);

        #endregion public methods
    }
}
