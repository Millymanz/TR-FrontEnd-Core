using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Data;

namespace TradeRiser.Core.Membership
{

    /// <summary>
    /// Password History item.
    /// </summary>
    [Serializable]
    public class PasswordHistory : IVaultDataBound
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets the created date.
        /// </summary>
        /// <value>The created date.</value>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        /// <value>The password.</value>
        public string Password { get; set; }

        #endregion

        #region IVaultDataBound Members

        /// <summary>
        /// Hydrate this type from the given IReader.
        /// </summary>
        /// <param name="reader">The reader.</param>
        public void Load(IReader reader)
        {
            this.CreatedDate = reader.Get<DateTime>("CreateDate");
            this.Password = reader.Get<string>("Password");
        }

        /// <summary>
        /// Gets the vault data key - used by theVault to load the class
        /// </summary>
        /// <value>
        /// The vault data key.
        /// </value>
        public object VaultDataKey
        {
            get { return this.CreatedDate; }
        }

        #endregion
    }
}
