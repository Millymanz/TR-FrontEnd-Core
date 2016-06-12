using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{ /// <summary>
    /// Defines a base class for holding a set of policies.
    /// </summary>
    public abstract class PolicySet
    {
        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="PolicySet"/> class.
        /// </summary>
        /// <param name="policyLoader">The policy loader.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors", Justification = "Required for implementation.")]
        protected PolicySet(IPolicyLoader policyLoader)
        {
            this.Initialise();
            policyLoader.LoadPolicy(this);
        }

        #endregion constructors

        #region public methods

        /// <summary>
        /// Initialises this instance.
        /// Use this method to create instances of all policy objects.
        /// </summary>
        public abstract void Initialise();

        #endregion public methods
    }
}
