using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{
    // <summary>
    /// Defines the operations of the policy loader.
    /// </summary>
    public interface IPolicyLoader
    {
        #region properties

        /// <summary>
        /// Gets or sets the connection details used for loading the policy.
        /// </summary>
        /// <value>The connection details for loading the policy.</value>
        string ConnectionDetails { get; set; }

        #endregion properties

        #region methods

        /// <summary>
        /// Loads the policies into the provided policy set object.
        /// </summary>
        /// <param name="policySet">The policy set object to load.</param>
        void LoadPolicy(PolicySet policySet);

        #endregion methods
    }
}
