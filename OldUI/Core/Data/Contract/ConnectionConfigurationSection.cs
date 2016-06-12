using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// Connections configuration section in config file. 
    /// </summary>
    public class ConnectionConfigurationSection : ConfigurationSection
    {
        #region properties

        /// <summary>
        /// Gets or sets the provider type name.
        /// </summary>
        /// <value>
        /// The provider.
        /// </value>
        [ConfigurationProperty("provider", DefaultValue = "", IsRequired = true)]
        public string Provider
        {
            get
            {
                return this["provider"].ToString();
            }

            set
            {
                this["provider"] = value;
            }
        }

        /// <summary>
        /// Gets or sets the connection string.
        /// </summary>
        /// <value>The connection string.</value>
        [ConfigurationProperty("connectionString", DefaultValue = "", IsRequired = false)]
        public string ConnectionString
        {
            get
            {
                return this["connectionString"].ToString();
            }

            set
            {
                this["connectionString"] = value;
            }
        }

        #endregion properties
    }
}
