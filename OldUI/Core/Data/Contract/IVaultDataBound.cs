using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// Interface used for loading collections of common classes into the Vault
    /// </summary>
    public interface IVaultDataBound
    {
        #region  Public Methods

        /// <summary>
        /// Loads the specified reader.
        /// </summary>
        /// <param name="reader">The reader.</param>
        void Load(IReader reader);

        #endregion
    }
}
