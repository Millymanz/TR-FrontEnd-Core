using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Common;
using TradeRiser.Core.Data;

namespace TradeRiser.Core.Configuration
{

    /// <summary>
    /// The settings for a policy.
    /// </summary>
    [Serializable]
    public class ConfigPolicySetting : PolicySetting<int>, IVaultDataBound
    {
        #region  Properties and Indexers

        #endregion

        #region IVaultDataBound Members

        /// <summary>
        /// Hydrate this type from the given IReader.
        /// </summary>
        /// <param name="reader">The reader.</param>
        public void Load(IReader reader)
        {
            this.Name = reader.Get<string>("Name");
            this.Enabled = reader.Get<bool>("Enabled");
            this.Value = reader.Get<int>("Value");
        }

        /// <summary>
        /// Gets the vault data key - used by theVault to load the class
        /// </summary>
        /// <value>
        /// The vault data key.
        /// </value>
        public object VaultDataKey
        {
            get { return this.Name; }
        }

        #endregion
    }
}
