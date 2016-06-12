using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// Data access settings for interacting with the databases.
    /// </summary>
    [Serializable]
    public class DataSettings : IEquatable<DataSettings>
    {
        #region private fields

        /// <summary>
        /// The parameters.
        /// </summary>
        [NonSerialized]
        private DataParameters parameters;

        #endregion private fields

        #region constructors
        /// <summary>
        /// Initializes a new instance of the <see cref="DataSettings"/> class.
        /// </summary>
        public DataSettings()
        {
            //default constructor for deserialization
            this.Parameters = new DataParameters();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DataSettings"/> class.
        /// </summary>
        public DataSettings(string connectionName, string task)
            : this(connectionName, task, string.Empty)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DataSettings"/> class.
        /// </summary>
        /// <param name="connectionName"></param>
        /// <param name="task">The task.</param>
        /// <param name="categories">The categories</param>
        public DataSettings(string connectionName, string task, string categories) : this()
        {
            this.Task = task;            
            this.CommandTimeoutMilliseconds = 30;
            this.Categories = categories;
            this.ConnectionName = connectionName;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets the command timeout in milliseconds.
        /// </summary>
        /// <value>The command timeout in milliseconds.</value>
        public int CommandTimeoutMilliseconds
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the categories.
        /// </summary>
        /// <value>
        /// The categories.
        /// </value>
        public string Categories { get; set; }

        /// <summary>
        /// Gets or sets the data filter.
        /// </summary>
        /// <value>
        /// The data filter.
        /// </value>
        public string DataFilter { get; set; }

        /// <summary>
        /// Gets the id. [Internal Use Only].
        /// </summary>
        public string Id 
        {
            get
            {
             return this.Task;
            }
        }

        /// <summary>
        /// Gets or sets the stored procedure parameters.
        /// </summary>
        /// <value>The stored procedure parameters.</value>
        public DataParameters Parameters
        {
            get
            {
                return this.parameters;
            }

            set
            {
                this.parameters = value;
            }
        }

        /// <summary>
        /// Gets or sets the name of the connection string.
        /// </summary>
        /// <value>The name of the connection string.</value>
        public string ConnectionName { get; set; }

        /// <summary>
        /// Gets or sets the time to live.
        /// </summary>
        /// <value>
        /// The time to live.
        /// </value>
        public TimeSpan? TimeToLive { get; set; }

        /// <summary>
        /// Gets or sets the program to execute.
        /// </summary>
        /// <value>
        /// The task.
        /// </value>
        public string Task
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets a value indicating whether [non query], used to determine whether to executeQuery or ExecuteNonQuery via Data Service Host..
        /// </summary>
        /// <value>
        ///   <c>true</c> if [non query]; otherwise, <c>false</c>.
        /// </value>
        public bool NonQuery { get; set; }

        #endregion properties

        public bool Equals(DataSettings other)
        {
            if (other == null)
            {
                return false;
            }

            return this.Id == other.Id &&
                    this.DataFilter == other.DataFilter &&
                    this.ConnectionName == other.ConnectionName &&
                    this.CommandTimeoutMilliseconds == other.CommandTimeoutMilliseconds &&
                    this.Categories == other.Categories &&
                    this.Task == other.Task &&
                    this.TimeToLive == other.TimeToLive && 
                    this.NonQuery == other.NonQuery;
        }
    }
}
