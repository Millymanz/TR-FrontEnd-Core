using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;

namespace TradeRiser.Core.Data
{
    /// Database provider factory.
    /// </summary>
    public static class Factory
    {
        /// <summary>
        /// Gets the configuration settings.
        /// </summary>
        /// <returns>Configuration Settings.</returns>
        private static ConnectionConfigurationSection GetConfigurationSettings()
        {
            ConnectionConfigurationSection config;

            try
            {
                lock (Factory.ConfigLock)
                {
                    config = ConfigurationManager.GetSection("connection") as ConnectionConfigurationSection;
                    if (config == null)
                    {
                        throw new ConfigurationErrorsException("Failed to read connection configuration from config file.");
                    }
                }
            }
            catch (Exception ex)
            {
                // cannot read config
                throw new ConfigurationErrorsException("Failed to read connection configuration from config file.", ex);
            }

            return config;
        }

        #region private fields

        /// <summary>
        /// The lock object for the config.
        /// </summary>
        private static readonly object ConfigLock = new object();

        /// <summary>
        /// The loaded flag.
        /// </summary>
        private static bool loaded;

        /// <summary>
        /// A collection of known loaded providers.
        /// </summary>
        private static readonly Dictionary<string, ConnectionInfo> Providers = new Dictionary<string, ConnectionInfo>(StringComparer.CurrentCultureIgnoreCase);

      
        #endregion private fields

        #region public static methods

        /// <summary>
        /// Gets the the necessary database provider based on the connection name.
        /// </summary>
        /// <param name="connectionName">Name of the connection.</param>
        /// <param name="dataSettings"></param>
        /// <param name="director">The director.</param>
        public static IDatabaseProvider Get(string connectionName, DataSettings dataSettings, IDirector director)
        {
            if (string.IsNullOrWhiteSpace(connectionName))
            {
                throw new ArgumentException("The connection name cannot be null. Please provide a connection name");
            }

            if (!Factory.loaded || !Factory.Providers.ContainsKey(connectionName))
            {
                Factory.Load();
            }

            IDatabaseProvider syncDatabaseProvider = null;

            // check if we already have one
            if (Factory.Providers.ContainsKey(connectionName))
            {
                syncDatabaseProvider = Factory.Providers[connectionName].CreateProvider(director);
            }

            // we don't have it
            if (syncDatabaseProvider == null)
            {
                throw new ArgumentException(string.Format("Cannot find a connection for connection name '{0}'", connectionName));
            }

            // check if we are using this sync or if we are going via the service bus
            if (dataSettings == null || string.IsNullOrWhiteSpace(dataSettings.Task)) return syncDatabaseProvider;
            ////if (!Factory.ServiceBusConnections.ContainsKey(connectionName)) return syncDatabaseProvider;
            ////if (!Factory.ServiceBusConnections[connectionName].ContainsKey(dataSettings.Task)) return syncDatabaseProvider;

            ////ServiceBusProvider serviceBusProvider = new ServiceBusProvider(Factory.ServiceBusConnections[connectionName][dataSettings.Task])
            ////{
            ////    Connection = Factory.Providers[connectionName]
            ////};

            // we need the sync provider so we know what to do when the messages comes off the bus at the other end
           // syncDatabaseProvider = serviceBusProvider;
            syncDatabaseProvider.Director = director;

            return syncDatabaseProvider;
        }

        /// <summary>
        /// Gets the connection info.
        /// </summary>
        /// <param name="connectionName">The connection name.</param>
        /// <returns>The connection info.</returns>
        public static ConnectionInfo GetConnectionInfo(string connectionName)
        {
            if (!Factory.loaded || !Factory.Providers.ContainsKey(connectionName))
            {
                Factory.Load();
            }

            // check if we already have one
            if (Factory.Providers.ContainsKey(connectionName))
            {
                return Factory.Providers[connectionName];
            }

            // we don't have it
            throw new ArgumentException(string.Format("Cannot find a connection for connection name '{0}'", connectionName));
        }

        /// <summary>
        /// Loads the providers into.
        /// </summary>
        public static void Load()
        {
            // look in the app config for connection details to load all providers
            ConnectionConfigurationSection config = Factory.GetConfigurationSettings();

            ConnectionInfo connection = new ConnectionInfo
            {
                Name = "configuration",
                Provider = config.Provider,
                ConnectionString = config.ConnectionString
            };

            // add the configuration connectionstring to the providers collection so we dont have to load it again.
            if (!Factory.Providers.ContainsKey("configuration"))
            {
                Factory.Providers.Add("configuration", connection);
            }

            using (IDatabaseProvider provider = connection.CreateProvider(null))
            {
                LoadProviders(provider, Factory.Providers);
                Factory.loaded = true;
            }
        }

        /// <summary>
        /// Loads the providers.
        /// </summary>
        /// <param name="provider">The database provider.</param>
        /// <param name="providers">The providers collection.</param>
        public static void LoadProviders(IDatabaseProvider provider, Dictionary<string, ConnectionInfo> providers)
        {
            //throw new NotImplementedException();
            //MemoryVaultManager blanka = new MemoryVaultManager();
            // check if the connection information is in the cache already.
           // List<ConnectionInfo> connectionInfo = blanka.Get(ConfigurationCacheConstants.ConnectionStrings) as List<ConnectionInfo>;
            List<ConnectionInfo> connectionInfo = null;// new List<ConnectionInfo>();

            if (connectionInfo == null)
            {

                //lock (DataLoad.ProvidersMutex)
                //{
                    DataSettings settings = new DataSettings("configuration", "traderiser.ConnectionStringSelect");

                    try
                    {
                        using (DataResult dataResult = provider.ExecuteQuery(settings))
                        {
                            if (dataResult.Success)
                            {
                                connectionInfo = new List<ConnectionInfo>();

                                while (dataResult.Reader.Read())
                                {
                                    ConnectionInfo connection = new ConnectionInfo();
                                    connection.Load(dataResult.Reader);
                                    connectionInfo.Add(connection);
                                }

                               // blanka.Add(ConfigurationCacheConstants.ConnectionStrings, connectionInfo, settings.TimeToLive);
                            }
                            else
                            {
                                if (dataResult.Exception != null)
                                {
                                    throw dataResult.Exception;
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Error spinning up Data Load.", ex);
                    }
                }
            //}

            foreach (ConnectionInfo connection in connectionInfo.Where(connection => !providers.ContainsKey(connection.Name)))
            {
                providers.Add(connection.Name, connection);
            }
        }


        #endregion public static methods
    }
}
