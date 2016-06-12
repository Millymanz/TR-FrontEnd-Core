using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// Interface for database providers.
    /// </summary>
    public interface IDatabaseProvider : IDisposable
    {
        /// <summary>
        /// Gets or sets the context.
        /// </summary>
        /// <value>
        /// The context.
        /// </value>
        IDirector Director { get; set; }

        /// <summary>
        /// Gets or sets the Connection.
        /// </summary>
        /// <value>
        /// The connection.
        /// </value>
        ConnectionInfo Connection { get; set; }

        /// <summary>
        /// Executes the query.
        /// </summary>
        /// <param name="settings">The data settings.</param>
        DataResult ExecuteQuery(DataSettings settings);

        /// <summary>
        /// Executes the non query.
        /// </summary>
        /// <param name="settings">The data settings.</param>
        DataResult ExecuteNonQuery(DataSettings settings);

        /// <summary>
        /// Initializes the provider with a connection string.
        /// </summary>
        /// <param name="connectionString">The connection string.</param>
        void Initialise(string connectionString);
    }
}
