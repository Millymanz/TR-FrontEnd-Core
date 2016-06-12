using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// An interface for reading data.
    /// </summary>
    public interface IReader : IDisposable
    {
        #region properties

        /// <summary>
        /// Gets or sets a value indicating whether this instance is proxy to results. If true, this reader has no results within it, they are written somewhere else. If false, this reader has the result rows ready to be enumerated.
        /// </summary>
        /// <value>
        /// If true, this reader has no results within it, they are written somewhere else. If false, this reader has the result rows ready to be enumerated.
        /// </value>
        bool IsProxyToResults
        {
            get;
        }

        /// <summary>
        /// Gets and Sets the Director.
        /// </summary>
        IDirector Director
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the number of columns in the current row. When not positioned in a valid recordset, 0; otherwise the number of columns in the current row. The default is -1.
        /// </summary>
        int FieldCount
        {
            get;
        }

        /// <summary>
        /// Gets a value indicating whether the reader contains one or more rows.
        /// </summary>
        bool HasRows
        {
            get;
        }

        /// <summary>
        /// Gets or sets a datetime indicating when the reader was executed.
        /// </summary>
        DateTime DateTimeOfExecution
        {
            get;
            set;
        }


        /// <summary>
        /// returns the number of row in the IReader
        /// </summary>
        int RowCount { get; }

        #endregion properties

        #region methods

        /// <summary>
        /// Gets the raw data underlying the IReader.
        /// </summary>
        byte[] GetRawData();

        /// <summary>
        /// Gets the value by specified column name.
        /// </summary>
        /// <typeparam name="T">Any type.</typeparam>
        /// <param name="columnName">Name of the column.</param>
        /// <returns>The value.</returns>
        T Get<T>(string columnName);

        /// <summary>
        /// Gets the value by specified column name.
        /// </summary>
        /// <typeparam name="T">Any type.</typeparam>
        /// <param name="columnName">Name of the column.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>The value.</returns>
        T Get<T>(string columnName, T defaultValue);

        /// <summary>
        /// Gets the value by specified ordinal.
        /// </summary>
        /// <typeparam name="T">Any type.</typeparam>
        /// <param name="ordinal">The ordinal.</param>
        /// <returns>The value.</returns>
        T Get<T>(int ordinal);

        /// <summary>
        /// Gets the value by specified ordinal.
        /// </summary>
        /// <typeparam name="T">Any type.</typeparam>
        /// <param name="ordinal">The ordinal.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>The value.</returns>
        T Get<T>(int ordinal, T defaultValue);

        /// <summary>
        /// Gets the name of the column at the given ordinal.
        /// </summary>
        /// <param name="ordinal">The ordinal.</param>
        string GetName(int ordinal);

        /// <summary>
        /// Determines whether the specified ordinal is null.
        /// </summary>
        /// <param name="ordinal">The ordinal.</param>
        /// <returns>
        ///   <c>true</c> if the specified ordinal is null; otherwise, <c>false</c>.
        /// </returns>
        bool IsNull(int ordinal);

        /// <summary>
        /// Determines whether the specified column name is null.
        /// </summary>
        /// <param name="columnName">Name of the column.</param>
        /// <returns>
        ///   <c>true</c> if the specified column name is null; otherwise, <c>false</c>.
        /// </returns>
        bool IsNull(string columnName);

        /// <summary>
        /// Reads a row.
        /// </summary>
        /// <returns>
        ///   <c>true</c> if a row was read; otherwise, <c>false</c>.
        /// </returns>
        bool Read();

        /// <summary>
        /// Gets the values.
        /// </summary>
        /// <param name="values"></param>
        void GetValues(object[] values);

        /// <summary>
        /// Gets the System.Type that is the data type of the object.
        /// </summary>
        /// <param name="ordinal">The zero-based column ordinal.</param>
        /// <returns>The System.Type that is the data type of the object. If the type does not exist on the client, in the case of a User-Defined Type (UDT) returned from the database, GetFieldType returns null.</returns>
        Type GetFieldType(int ordinal);

        /// <summary>
        /// Gets the ordinal of the specified field.
        /// </summary>
        /// <param name="fieldName">Name of the field.</param>
        /// <returns>An integer that represents the ordinal position of the field.</returns>
        int GetOrdinal(string fieldName);

        /// <summary>
        /// Gets all rows.
        /// </summary>
        /// <returns>a list of arrays containing the field values for all rows.</returns>
        List<object[]> GetAllRows();

       
        /// <summary>
        /// Returns the current index number for the row that the reader is currently on.
        /// </summary>
        /// <returns>The row index number.</returns>
        int GetRowIndex();

        /// <summary>
        /// Moves the reader to the row at the index position specified.
        /// </summary>
        /// <param name="index">The index to move to.</param>
        void SetRowIndex(int index);

        /// <summary>
        /// Advances the data reader to the next result, when reading the results of the batch.
        /// </summary>
        /// <returns>True if there are more result sets; otherwise false.</returns>
        bool NextResult();

        #endregion methods
    }
}
