using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Data;

namespace TradeRiser.Core.Configuration
{
    public class ConfigurationDataAccess
    {
        /// <summary>
        /// The component
        /// </summary>
        private const string Component = "TradeRiser.Core.Configuration";

        /// <summary>
        /// The sender
        /// </summary>
        private const string Sender = "ConfigurationDataAccess";

        #region  Fields

        private IDataAccess database;

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="ConfigurationDataAccess"/> class.
        /// </summary>
        /// <param name="connectionName">Name of the connection.</param>
        public ConfigurationDataAccess(string connectionName)
        {
            this.ConnectionName = connectionName;
        }

        #endregion

        #region private methods

        /// <summary>
        /// Converts a list to a string.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list">The list.</param>
        private string ListToString<T>(IList<T> list)
        {
            if (list.Count > 0)
            {
                StringBuilder builder = new StringBuilder();

                foreach (T s in list)
                {
                    builder.AppendFormat(",{0}", s);
                }

                return builder.ToString().Remove(0, 1);
            }
            return null;
        }

        #endregion

        #region  Properties and Indexers

        /// <summary>
        /// The connection name to look up connection strings on.
        /// </summary>
        private string ConnectionName { get; set; }

        /// <summary>
        /// Gets the data access helper.
        /// </summary>
        public IDataAccess Database
        {
            get
            {
                if (this.database == null)
                {
                    // this.database = Dependency.Get<IDataAccess>();
                    this.database = new DataAccess();
                }
                return this.database;
            }
        }

        #endregion

        /// <summary>
        /// Gets all config items.
        /// </summary>
        public Dictionary<string, ConfigurationItem> GetAllConfigItems()
        {
            Dictionary<string, ConfigurationItem> items = null;

            using (IDataAccess data = this.Database)
            {
                List<ConfigurationItem> list = data.Get<ConfigurationItem>(new DataSettings(ConnectionName, "traderiser.ConfigurationItemSelect", "traderiser.ConfigurationItemSelect"));
                items = new Dictionary<string, ConfigurationItem>(list.Count);

                for (int i = 0, ii = list.Count; i < ii; i++)
                {
                    items.Add(list[i].Name, list[i]);
                }
            }

            return items;
        }

        /// <summary>
        /// Gets all connection strings.
        /// </summary>
        public Dictionary<string, ConnectionInfo> GetAllConnectionStrings()
        {
            Dictionary<string, ConnectionInfo> connections = new Dictionary<string, ConnectionInfo>();

            DataSettings settings = new DataSettings(ConnectionName, "traderiser.ConnectionStringSelect");

            using (IDataAccess data = this.Database)
            {
                IList<ConnectionInfo> connectionsList = data.Get<ConnectionInfo>(settings);
                foreach (ConnectionInfo connectionInfo in connectionsList)
                {
                    connections.Add(connectionInfo.Name, connectionInfo);
                }
            }

            return connections;
        }

        /////// <summary>
        /////// Gets all resources.
        /////// </summary>
        ////public IList<ResourceRecord> GetAllResources()
        ////{
        ////    IList<ResourceRecord> items = null;

        ////    using (IDataAccess data = this.Database)
        ////    {
        ////        items = data.Get<ResourceRecord>(new DataSettings(this.ConnectionName, "traderiser.ResourceSelect", "resx"));
        ////    }

        ////    return items;
        ////}

        /// <summary>
        /// Saves the config item.
        /// </summary>
        /// <param name="item">The config item.</param>
        public void SaveConfigItem(ConfigurationItem item)
        {

            //DataSettings settings = new DataSettings(ConnectionName, "traderiser.ConfigurationItemUpdate");

            //using (IDataAccess data = this.Database)
            //{
            //    settings.Parameters.Add(new DataParameter { ParameterName = "@Name", Value = item.Name });
            //    settings.Parameters.Add(new DataParameter { ParameterName = "@DataType", Value = item.DataType });
            //    settings.Parameters.Add(new DataParameter { ParameterName = "@Value", Value = item.Value });
            //    settings.Parameters.Add(new DataParameter { ParameterName = "@IsVisible", Value = item.IsVisble });

            //    DataResult result = data.ExecuteNonQuery(settings);
            //    if (!result.Success)
            //    {
            //        Log.Exception(Component, string.Format("{0}.{1}", Sender, "SaveConfigItem"), result.Exception);
            //        throw result.Exception;
            //    }
            //}
        }
    }
}
