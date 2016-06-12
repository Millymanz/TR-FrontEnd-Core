using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;
using TradeRiser.Core.Extensions;
namespace TradeRiser.Core.Data
{
    /// <summary>
    /// IReader for SQL Server.
    /// </summary>
    public class SqlServerReader : IReader
    {
        #region  Fields

        /// <summary>
        /// A SQL Data Reader.
        /// </summary>
        private readonly SqlDataReader sqlDataReader;

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="SqlServerReader"/> class.
        /// </summary>
        /// <param name="sqlDataReader">The SQL data reader.</param>
        public SqlServerReader(SqlDataReader sqlDataReader)
        {
            this.sqlDataReader = sqlDataReader;
            this.DateTimeOfExecution = DateTime.UtcNow;
        }

        #endregion

        #region IReader Members

        /// <summary>
        /// Gets or sets a value indicating whether this instance is proxy to results. Always false as this sql reader is over actual results.
        /// </summary>
        /// <value>
        /// If true, this reader has no results within it, they are written somewhere else. If false, this reader has the result rows ready to be enumerated.
        /// </value>
        public bool IsProxyToResults
        {
            get
            {
                return false;
            }
        }

        /// <summary>
        /// Gets and Sets the Director.
        /// </summary>
        public IDirector Director
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the number of columns in the current row. When not positioned in a valid record set, 0; otherwise the number of columns in the current row. The default is -1.
        /// </summary>
        public int FieldCount
        {
            get
            {
                return this.sqlDataReader == null ? 0 : this.sqlDataReader.FieldCount;
            }
        }

        /// <summary>
        /// Gets a value indicating whether the reader contains one or more rows.
        /// </summary>
        public bool HasRows
        {
            get
            {
                return this.sqlDataReader != null && this.sqlDataReader.HasRows;
            }
        }

        /// <summary>
        /// Advances the data reader to the next result, when reading the results of the batch.
        /// </summary>
        /// <returns>True if there are more result sets; otherwise false.</returns>
        public bool NextResult()
        {
            return this.sqlDataReader.NextResult();
        }

        public DateTime DateTimeOfExecution { get; set; }

        /// <summary>
        /// Gets or sets the Row Count.
        /// </summary>
        public int RowCount { get; private set; }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        public byte[] GetRawData()
        {
            // If this is called we need to produce an SSR on the fly but only if no rows have been consumed.

            throw new NotImplementedException();
        }

        /// <summary>
        /// Gets the specified value from the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="columnName">Name of the column.</param>
        public T Get<T>(string columnName)
        {
            return this.Get(columnName, default(T));
        }

        /// <summary>
        /// Gets the specified value form the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="columnName">Name of the column.</param>
        /// <param name="defaultValue">The default value.</param>
        public T Get<T>(string columnName, T defaultValue)
        {
            int ordinal = this.sqlDataReader.GetOrdinal(columnName);
            return this.sqlDataReader.Get(ordinal, defaultValue);
        }

        /// <summary>
        /// Gets the specified value from the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="ordinal">The ordinal.</param>
        public T Get<T>(int ordinal)
        {
            return this.Get(ordinal, default(T));
        }

        /// <summary>
        /// Gets the specified value form the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="ordinal">The ordinal.</param>
        /// <param name="defaultValue">The default value.</param>
        public T Get<T>(int ordinal, T defaultValue)
        {
            return this.sqlDataReader.Get(ordinal, defaultValue);
        }

        /// <summary>
        /// Gets the System.Type that is the data type of the object.
        /// </summary>
        /// <param name="ordinal">The zero-based column ordinal.</param>
        /// <returns>
        /// The System.Type that is the data type of the object. If the type does not exist on the client, in the case of a User-Defined Type (UDT) returned from the database, GetFieldType returns null.
        /// </returns>
        public Type GetFieldType(int ordinal)
        {
            return this.sqlDataReader.GetFieldType(ordinal);
        }

        /// <summary>
        /// Gets the name of the column at the given ordinal.
        /// </summary>
        /// <param name="ordinal">The ordinal.</param>
        public string GetName(int ordinal)
        {
            return this.sqlDataReader == null ? string.Empty : this.sqlDataReader.GetName(ordinal);
        }

        /// <summary>
        /// Gets the ordinal of the specified field.
        /// </summary>
        /// <param name="fieldName">Name of the field.</param>
        /// <returns>The ordinal.</returns>
        public int GetOrdinal(string fieldName)
        {
            return this.sqlDataReader.GetOrdinal(fieldName);
        }

        /// <summary>
        /// Gets the values.
        /// </summary>
        /// <param name="values">Object[] to hold the values.</param>
        public void GetValues(object[] values)
        {
            this.sqlDataReader.GetValues(values);
        }

        /// <summary>
        /// Determines whether the column value is DB null.
        /// </summary>
        /// <param name="ordinal">The ordinal.</param>
        /// <returns>
        ///   <c>True</c> if the column is DB null; otherwise, <c>false</c>.
        /// </returns>
        public bool IsNull(int ordinal)
        {
            return this.sqlDataReader.IsDBNull(ordinal);
        }

        /// <summary>
        /// Determines whether the column value is DB null.
        /// </summary>
        /// <param name="columnName">Name of the column.</param>
        /// <returns>
        ///   <c>True</c> if the column is DB null; otherwise, <c>false</c>.
        /// </returns>
        public bool IsNull(string columnName)
        {
            try
            {
                int ordinal = this.sqlDataReader.GetOrdinal(columnName);
                return this.IsNull(ordinal);
            }
            catch
            {
                return true;
            }
        }

        /// <summary>
        /// Advances the Data Reader to the next record.
        /// </summary>
        /// <returns>True if there are more rows; otherwise false.</returns>
        public bool Read()
        {
            bool sqlRead = this.sqlDataReader.Read();

            if (sqlRead)
            {
                // increment the count of rows
                this.RowCount++;
            }

            return sqlRead;
        }

        /// <summary>
        /// Gets all rows, but consumes the DataReader.
        /// </summary>
        /// <returns>
        /// The row list.
        /// </returns>
        public List<object[]> GetAllRows()
        {
            List<object[]> returnList = new List<object[]>();

            while (this.sqlDataReader.Read())
            {
                object[] row = new object[this.sqlDataReader.FieldCount];

                this.sqlDataReader.GetValues(row);

                returnList.Add(row);

                // increment the count of rows
                this.RowCount++;
            }

            // dispose sql connection and reader
            if (this.sqlDataReader == null) return returnList;

            this.sqlDataReader.Close();
            this.sqlDataReader.Dispose();

            return returnList;
        }

        public int GetRowIndex()
        {
            throw new NotImplementedException();
        }

        public void SetRowIndex(int index)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region  Public Methods

        ///// <summary>
        ///// Gets a data table representation of the reader. If no rows are found, NULL will be returned.
        ///// </summary>
        ///// <remarks>May be null.</remarks>
        //public DataTable ToDataTable()
        //{
        //    DataTable table = new DataTable();
        //    table.Load(this.sqlDataReader);

        //    return table;
        //}

        #endregion

        /// <summary>
        /// Finalizes an instance of the <see cref="SqlServerReader"/> class. 
        /// </summary>
        ~SqlServerReader()
        {
            this.Dispose(false);
        }

        /// <summary>
        /// Disposes the reader.
        /// </summary>
        /// <param name="disposing">Disposing or finalizing.</param>
        protected void Dispose(bool disposing)
        {
            if (!disposing) return;
            // free managed resources
            if (this.sqlDataReader == null) return;

            this.sqlDataReader.Close();
            this.sqlDataReader.Dispose();
        }
    }
}
