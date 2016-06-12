using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Data
{
    public interface IDataAccess : IDisposable
    {
        /// <summary>
        /// Gets a List of T using the DataSettings.
        /// </summary>
        /// <param name="settings">The data settings.</param>
        List<T> Get<T>(DataSettings settings) where T : IVaultDataBound, new();

        /// <summary>
        /// Executes the Task in the provided DataSettings.
        /// </summary>
        /// <param name="settings">The data settings.</param>
        DataResult ExecuteNonQuery(DataSettings settings);

        /// <summary>
        /// Executes the Task in the provided settings and retunrs a DataResult with an IReader or a Scalar value.
        /// </summary>
        /// <param name="settings">The settings.</param>
        DataResult ExecuteQuery(DataSettings settings);
    }
}
