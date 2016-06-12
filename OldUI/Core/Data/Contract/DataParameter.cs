using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace TradeRiser.Core.Data
{
      /// <summary>
    /// A class to represent a parameter.
    /// </summary>
    public class DataParameter : IDataParameter
    {
        #region private fields

        /// <summary>
        /// The database type.
        /// </summary>
        private DbType dataType = DbType.AnsiString;

        private object value;

        public DataParameter()
        {
            this.HasDbType = false;
        }

        public DataParameter(string name, object value) : this()
        {
            this.ParameterName = name;
            this.Value = value;
        }

        #endregion private fields

        #region properties

        /// <summary>
        /// Gets or sets the precision.
        /// </summary>
        /// <value>
        /// The precision.
        /// </value>
        public byte Precision { get; set; }

        /// <summary>
        /// Gets or sets the scale.
        /// </summary>
        /// <value>
        /// The scale.
        /// </value>
        public byte Scale { get; set; }

        /// <summary>
        /// Gets or sets the size.
        /// </summary>
        /// <value>
        /// The size.
        /// </value>
        public int Size { get; set; }

        /// <summary>
        /// Gets or sets the <see cref="T:System.Data.DbType"/> of the parameter.
        /// </summary>
        /// <returns>One of the <see cref="T:System.Data.DbType"/> values. The default is <see cref="F:System.Data.DbType.String"/>.</returns>
        /// <exception cref="T:System.ArgumentOutOfRangeException">The property was not set to a valid <see cref="T:System.Data.DbType"/>. </exception>
        public DbType DbType
        {
            get
            {
                return this.dataType;
            }

            set
            {
                this.HasDbType = true;
                this.dataType = value;
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the parameter is input-only, output-only, bidirectional, or a stored procedure return value parameter.
        /// </summary>
        /// <returns>One of the <see cref="T:System.Data.ParameterDirection"/> values. The default is Input.</returns>
        /// <exception cref="T:System.ArgumentException">The property was not set to one of the valid <see cref="T:System.Data.ParameterDirection"/> values. </exception>
        public ParameterDirection Direction
        {
            get;
            set;
        }

        /// <summary>
        /// Gets a value indicating whether this instance has db type.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if this instance has db type; otherwise, <c>false</c>.
        /// </value>
        public bool HasDbType { get; private set; }

        /// <summary>
        /// Gets a value indicating whether the parameter accepts null values.
        /// </summary>
        /// <returns>true if null values are accepted; otherwise, false. The default is false.</returns>
        public bool IsNullable { get; set; }

        /// <summary>
        /// Gets or sets the name of the <see cref="T:System.Data.IDataParameter"/>.
        /// </summary>
        /// <returns>The name of the <see cref="T:System.Data.IDataParameter"/>. The default is an empty string.</returns>
        public string ParameterName
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the name of the source column that is mapped to the <see cref="T:System.Data.DataSet"/> and used for loading or returning the <see cref="P:System.Data.IDataParameter.Value"/>.
        /// </summary>
        /// <returns>The name of the source column that is mapped to the <see cref="T:System.Data.DataSet"/>. The default is an empty string.</returns>
        public string SourceColumn
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the <see cref="T:System.Data.DataRowVersion"/> to use when loading <see cref="P:System.Data.IDataParameter.Value"/>.
        /// </summary>
        /// <returns>One of the <see cref="T:System.Data.DataRowVersion"/> values. The default is Current.</returns>
        /// <exception cref="T:System.ArgumentException">The property was not set one of the <see cref="T:System.Data.DataRowVersion"/> values. </exception>
        public DataRowVersion SourceVersion
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the value of the parameter.
        /// </summary>
        /// <returns>An <see cref="T:System.Object"/> that is the value of the parameter. The default value is null.</returns>
        public object Value
        {
            get
            {
                return this.value;
            }
            set
            {
                switch (this.dataType)
                {
                    case DbType.DateTime:
                        this.value = value != null ? DateTime.Parse(value.ToString()) : value;
                        break;
                    case DbType.Guid:
                        this.value = value!= null ? new Guid(value.ToString()) : value;
                        break;
                    default:
                        this.value = value;
                        break;
                }
            }
        }

        #endregion properties

        #region public methods

        /// <summary>
        /// Values as.
        /// </summary>
        /// <typeparam name="T">Any type.</typeparam>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>The value of the parameter cast to the specified type.</returns>
        public T ValueAs<T>(T defaultValue)
        {
            try
            {
                return (T)this.Value;
            }
            catch
            {
                return defaultValue;
            }
        }

        #endregion public methods
    }
}
