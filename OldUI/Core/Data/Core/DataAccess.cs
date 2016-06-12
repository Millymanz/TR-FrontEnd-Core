using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;
using TradeRiser.Core.Logging;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// Generic Data Access.
    /// </summary>
    public class DataAccess : IDataAccess
    {
        #region private fields

        /// <summary>
        /// The default connection name.
        /// </summary>
        private string connectionName = "configuration";

        /// <summary>
        /// The current director.
        /// </summary>
        private readonly IDirector director;

        /// <summary>
        /// The database provider for this UOW.
        /// </summary>
        private IDatabaseProvider provider;

        #endregion private fields

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="DataAccess"/> class.
        /// </summary>
        public DataAccess()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DataAccess"/> class.
        /// </summary>
        /// <param name="director">The director.</param>
        //[InjectionConstructor]
        public DataAccess(IDirector director)
        {
            this.director = director;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets the name of the connection.
        /// </summary>
        /// <value>
        /// The name of the connection.
        /// </value>
        public string ConnectionName
        {
            get
            {
                return this.connectionName;
            }

            set
            {
                this.connectionName = value;
            }
        }

        #endregion properties

        #region public methods

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            if (this.provider != null)
            {
                this.provider.Dispose();
            }
        }

        /// <summary>
        /// Executes a Non Query. Such as an insert or update.
        /// </summary>
        /// <param name="settings">The data settings.</param>
        public DataResult ExecuteNonQuery(DataSettings settings)
        {
            DataResult result = null;

            try
            {
                //Used to determine whether to ExecuteQuery or ExecuteNonQuery via Data Service Host, as "ExecuteNonQuery" and "ExecuteQuery" both maps to "Exec" in Service Host
                settings.NonQuery = true;

                this.provider = Factory.Get(settings.ConnectionName, settings, this.director);
                result = this.provider.ExecuteNonQuery(settings);
            }
            catch (Exception e)
            {
                result = new DataResult
                {
                    Success = false,
                    Exception = e
                };
            }

            return result;
        }

        /// <summary>
        /// Executes a query and returns the results.
        /// </summary>
        /// <param name="settings">The data settings.</param>
        public DataResult ExecuteQuery(DataSettings settings)
        {
            DataResult result = null;

            try
            {
                this.provider = Factory.Get(settings.ConnectionName, settings, this.director);
                result = this.provider.ExecuteQuery(settings);
            }
            catch (Exception e)
            {
                result = new DataResult
                {
                    Success = false,
                    Exception = e
                };
            }

            return result;
        }

        /// <summary>
        /// Executes the command and returns an open reader. Make sure you call Dispose or wrap in a using()
        /// </summary>
        /// <param name="settings">The settings.</param>
        public DataResult ExecuteReader(DataSettings settings)
        {
            this.provider = Factory.Get(settings.ConnectionName, settings, this.director);
            return this.provider.ExecuteQuery(settings);
        }

        /// <summary>
        /// Gets a list of T. Handles all caching for you.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="settings">The settings.</param>
        /// <returns></returns>
        public List<T> Get<T>(DataSettings settings) where T : IVaultDataBound, new()
        {
            IList<T> items = new List<T>();

            using (IDatabaseProvider database = Factory.Get(settings.ConnectionName, settings, this.director))
            {
                using (DataResult result = database.ExecuteQuery(settings))
                {
                    if (!result.Success)
                    {
                        result.Exception.Data.Add("Id", settings.Id);
                        Log.Exception("TradeRiser.Core.Data", "DataAccess.Get<T>", result.Exception, this.director);

                        throw new Exception(string.Format("Failed to execute query ({0}.{1}).", settings.Id, result.Exception.Message), result.Exception);
                    }

                    while (result.Reader.Read())
                    {
                        T t = new T();
                        t.Load(result.Reader);
                        items.Add(t);
                    }
                }

                return items.ToList();
            }
        }

        #endregion public methods
    }
}
