using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Data;

namespace TradeRiser.Core.Configuration
{
  
    [Serializable]
    public class ConfigurationItem : IEquatable<ConfigurationItem>,IVaultDataBound
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets the name of the culture.
        /// </summary>
        /// <value>The name of the culture.</value>
       
        public string CultureName { get; set; }

        /// <summary>
        /// Gets or sets the datatype of the configuration item.
        /// </summary>
        /// <value>The datatype of the configuration item.</value>
       
        public string DataType { get; set; }

        /// <summary>
        /// Gets or sets the name of the configuration item.
        /// </summary>
        /// <value>The name of the configuration item.</value>
       
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the value of the configuration item.
        /// </summary>
        /// <value>The value of the configuration item.</value>
       
        public string Value { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is visble.
        /// </summary>
        /// <value><c>true</c> if this instance is visble; otherwise, <c>false</c>.</value>
       
        public bool IsVisble { get; set; }

        #endregion

        #region IEquatable<ConfigurationItem> Members

        /// <summary>
        /// Indicates whether the current object is equal to another object of the same type.
        /// </summary>
        /// <param name="other">An object to compare with this object.</param>
        /// <returns>
        /// True if the current object is equal to the <paramref name="other"/> parameter; otherwise, false.
        /// </returns>
        public bool Equals(ConfigurationItem other)
        {
            if (other == null)
            {
                return false;
            }

            return this.DataType == other.DataType &&
                this.Name == other.Name &&
                this.Value == other.Value &&
                this.CultureName == other.CultureName &&
                this.IsVisble == other.IsVisble;
        }

        #endregion


        /// <summary>
        /// Hydrate this type from the given IReader.
        /// </summary>
        /// <param name="reader">The reader.</param>

        public void Load(IReader reader)
        {
            this.Name = reader.Get<string>(0);
            this.DataType = reader.Get<string>(1);
            this.Value = reader.Get<string>(2);
            this.IsVisble = reader.Get<bool>(3);
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
    }
}
