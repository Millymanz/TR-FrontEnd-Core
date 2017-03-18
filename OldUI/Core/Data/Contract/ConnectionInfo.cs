using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// Single connection information.
    /// </summary>
    [Serializable]
    public class ConnectionInfo : IEquatable<ConnectionInfo>, IDataBound
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets the connection string.
        /// </summary>
        /// <value>
        /// The connection string.
        /// </value>
        public string ConnectionString { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the provider.
        /// </summary>
        /// <value>
        /// The provider.
        /// </value>
        public string Provider { get; set; }

        #endregion

        #region IEquatable<ConnectionInfo> Members

        /// <summary>
        /// Indicates whether the current object is equal to another object of the same type.
        /// </summary>
        /// <param name="other">An object to compare with this object.</param>
        /// <returns>
        /// True if the current object is equal to the <paramref name="other"/> parameter; otherwise, false.
        /// </returns>
        public bool Equals(ConnectionInfo other)
        {
            if (other == null)
            {
                return false;
            }

            return this.ConnectionString == other.ConnectionString && this.Name == other.Name;
        }

        #endregion

        #region IDataBound Members

        /// <summary>
        /// Loads the specified reader.
        /// </summary>
        /// <param name="reader">The reader.</param>
        public void Load(IReader reader)
        {
            if (reader != null)
            {
                this.Name = reader.Get<string>("ConnectionName");
                this.ConnectionString = reader.Get<string>("ConnectionString");
                this.Provider = reader.Get<string>("Provider");
            }
        }

        /// <summary>
        /// Gets the vault data key - used by theVault to load the class
        /// </summary>
        /// <value>
        /// The vault data key.
        /// </value>
        public object VaultDataKey
        {
            get
            {
                return this.Name;
            }
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Creates a new provider.
        /// </summary>
        /// <param name="director">The director.</param>
        /// <returns>A database provider.</returns>
        public IDatabaseProvider CreateProvider(IDirector director)
        {
            Type t = Type.GetType(this.Provider, true);
            if (t == null)
            {
                throw new Exception(string.Format("Cannot create a type from '{0}'", this.Provider));
            }

            IDatabaseProvider p = Activator.CreateInstance(t) as IDatabaseProvider;

            if (p != null)
            {
                p.Initialise(this.ConnectionString);
                p.Director = director;

                return p;
            }
            throw new Exception(string.Format("Cannot create a type from '{0}'", this.Provider));
        }

        #endregion
    }
}
