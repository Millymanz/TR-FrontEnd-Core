using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Data;
using TradeRiser.Core.Extensions;
namespace TradeRiser.Core.Configuration
{
    public class ConfigurationService //: IVaultSpinUp //: IConfigurationService, IVaultSpinUp
    {
        #region  Fields

        /// <summary>
        /// The local data access.
        /// </summary>
        private readonly ConfigurationDataAccess data;

        #endregion

        

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigurationService"/> class.
        /// </summary>
        public ConfigurationService()
        {
            this.data = new ConfigurationDataAccess("configuration");
        }

        #endregion

        #region IConfigurationService Members



        /// <summary>
        /// Gets all config items.
        /// </summary>
        public Dictionary<string, ConfigurationItem> GetAllConfigItems()
        {
            Dictionary<string, ConfigurationItem> config = null;//; new Dictionary<string, ConfigurationItem>();
            if (config == null)
            {
                config = this.data.GetAllConfigItems();
            }

            return config;
            ////TODO:PA
            ////Dictionary<string, ConfigurationItem> config = this.Blanka.Get(ConfigurationCacheConstants.ConfigurationItems) as Dictionary<string, ConfigurationItem>;
            ////if (config == null)
            ////{
            ////    config = this.data.GetAllConfigItems();
            ////    this.Blanka.Add(ConfigurationCacheConstants.ConfigurationItems, config);
            ////}

            ////return config;
        }

     
        /// <summary>
        /// Gets the config item.
        /// </summary>
        /// <param name="name">The name.</param>
        public ConfigurationItem GetConfigItem(string name)
        {
            // All Config Items are Case Sensitive
            Dictionary<string, ConfigurationItem> configItems = this.GetAllConfigItems();

            if (configItems != null && configItems.ContainsKey(name))
            {
                return configItems[name];
            }

            throw new ArgumentException(string.Format("No configuration item with the name '{0}' was found.", name));
        }

        /// <summary>
        /// Gets the config item.
        /// </summary>
        /// <typeparam name="T">The type to convert to.</typeparam>
        /// <param name="name">The name.</param>
        public T GetConfigItem<T>(string name)
        {
            return this.GetConfigItem(name, default(T));
        }

        /// <summary>
        /// Gets the config item.
        /// </summary>
        /// <typeparam name="T">The type to convert to.</typeparam>
        /// <param name="name">The name.</param>
        /// <param name="defaultValue">The default value.</param>
        public T GetConfigItem<T>(string name, T defaultValue)
        {
            if (string.IsNullOrEmpty(name))
            {
                return defaultValue;
            }

            try
            {
                ConfigurationItem item = this.GetConfigItem(name);
                return ConfigurationService.ChangeConfigItemType<T>(item);
            }
            catch (ArgumentException)
            {
                return defaultValue;
            }
        }

        /// <summary>
        /// Gets the connection string.
        /// </summary>
        /// <param name="connectionName">Name of the connection.</param>
        public string GetConnectionString(string connectionName)
        {
            connectionName = connectionName.ToLowerInvariant();

            if (connectionName == "configuration")
            {
                return ConfigurationManager.ConnectionStrings["configuration"].ConnectionString;
            }

            Dictionary<string, ConnectionInfo> connections = this.GetAllConnectionStrings();

            if (!connections.Any() || !connections.ContainsKey(connectionName))
            {
                throw new ArgumentException(string.Format("Connection string with name '{0}' not found.", connectionName));
            }

            return connections[connectionName].ConnectionString;
        }

        /// <summary>
        /// Gets all of the connection strings.
        /// </summary>
        public Dictionary<string, ConnectionInfo> GetAllConnectionStrings()
        {
            throw new NotImplementedException();
            //////Dictionary<string, ConnectionInfo> connections = this.Blanka.Get(ConfigurationCacheConstants.ConnectionStrings) as Dictionary<string, ConnectionInfo>;
            ////Dictionary<string, ConnectionInfo> connections = null;// this.Blanka.Get(ConfigurationCacheConstants.ConnectionStrings) as Dictionary<string, ConnectionInfo>;
            ////if (connections == null)
            ////{
            ////    connections = this.data.GetAllConnectionStrings();
            ////   // this.Blanka.Add(ConfigurationCacheConstants.ConnectionStrings, connections);
            ////}

            ////return connections;
        }

        /// <summary>
        /// Saves the config item.
        /// </summary>
        /// <param name="item">The item.</param>
        public void SaveConfigItem(ConfigurationItem item)
        {
            this.data.SaveConfigItem(item);
        }

        /////// <summary>
        /////// Saves the resource.
        /////// </summary>
        /////// <param name="record">The resource record.</param>
        ////public void SaveResource(ResourceRecord record)
        ////{
        ////    this.data.SaveResource(record);
        ////}

        #endregion

        #region IVaultSpinUp Members

        /// <summary>
        /// Performs spin up operations.
        /// </summary>
        public void SpinUp()
        {
            // use the membership connection string to force the app to load all connections
            this.GetConnectionString("membership-direct");
         
            // load all config items
            this.GetAllConfigItems();
        }

        #endregion

        #region  Private Methods

        /// <summary>
        /// Changes the type of the config item.
        /// </summary>
        /// <typeparam name="T">The type to convert to.</typeparam>
        /// <param name="item">The item.</param>
        private static T ChangeConfigItemType<T>(ConfigurationItem item)
        {
            Debug.Assert(item != null, "item != null");

            if (typeof(T).IsEnum)
            {
                try
                {
                    return (T)Enum.Parse(typeof(T), item.Value);
                }
                catch (Exception ex)
                {
                    Type t = typeof(T);
                    string allowedValues = Enum.GetNames(t).AggregateIntoString(", ");
                    throw ex;
                    //throw new Exception(Resx.Format(ConfigurationResources.ParseEnumFailed, item.Name, item.Value, t.ToString(), allowedValues), ex);
                }
            }
            try
            {
                return (T)Convert.ChangeType(item.Value, typeof(T), CultureInfo.CurrentCulture);
            }
            catch (Exception ex)
            {
                Type t = typeof(T);
                throw ex;
                //throw new Exception(Resx.Format(ConfigurationResources.ChangeTypeFailed, item.Name, item.Value, t.ToString()), ex);
            }
        }

        #endregion
    }
}
