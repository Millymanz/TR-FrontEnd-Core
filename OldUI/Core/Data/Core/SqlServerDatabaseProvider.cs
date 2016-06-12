using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Director;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Extensions;

namespace TradeRiser.Core.Data
{
    /// <summary>
    /// SQL Server database provider.
    /// </summary>
    public class SqlServerDatabaseProvider : IDatabaseProvider
    {
        /// <summary>
        /// The component
        /// </summary>
        private const string Component = "TradeRiser.Core.Data.SqlServerDatabaseProvider";

        /// <summary>
        /// The sender
        /// </summary>
        private const string Sender = "SqlServerDatabaseProvider";

        #region  Fields

        /// <summary>
        /// The connection.
        /// </summary>
        private SqlConnection connection;

        /// <summary>
        /// The director.
        /// </summary>
        private IDirector director;

        #endregion

        #region IDatabaseProvider Members

        /// <summary>
        /// Gets or sets the context.
        /// </summary>
        /// <value>The context.</value>
        public IDirector Director
        {
            get
            {
                return this.director;
            }

            set
            {
                this.director = value;
            }
        }

        /// <summary>
        /// Gets or sets the connection.
        /// </summary>
        /// <value>The connection.</value>
        public ConnectionInfo Connection { get; set; }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        public void Dispose()
        {
            // free managed resources
            if (this.connection == null) return;

            try
            {
                this.connection.Close();
                this.connection.Dispose();
            }
            catch
            {
                // ignored
            }
        }

        /// <summary>
        /// Executes the non query.
        /// </summary>
        /// <param name="settings">The settings.</param>
        public DataResult ExecuteNonQuery(DataSettings settings)
        {
            DataResult result = new DataResult();

            try
            {
                if (this.connection.State != ConnectionState.Open)
                {
                    this.connection.Open();
                }

                using (SqlCommand command = new SqlCommand(settings.Task, this.connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // parameters
                    if (settings.Parameters != null)
                    {
                        command.Parameters.AddRange(GetSqlParameters(settings.Parameters));
                    }

                    // automatically add the return value parameter to each call.
                    SqlParameter returnValue = AddReturnValueParameter(command);

                    result.AffectedRows = command.ExecuteNonQuery();

                    if (returnValue != null && returnValue.Value(1) == 0)
                    {
                        result.Success = false;

                        Exception ex = new Exception(string.Format("The task: {0} did not execute successfully. Task ID: {1} Please check the Logs for more information", settings.Task, settings.Id));
                        Log.Exception(Component, Sender, ex, this.Director);

                        result.Exception = ex;
                        result.Message = returnValue.Value(1).ToString();
                    }
                    else
                    {
                        result.Success = true;
                        result.Message = "1";
                    }

                    // check for return and output parameters
                    this.UpdateParameters(settings.Parameters, command.Parameters);
                }
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Exception = ex;
                Log.Exception(Component, Sender, ex, this.Director);
            }

            return result;
        }

        /// <summary>
        /// Executes the query held as a Task in the DataSettings.
        /// </summary>
        /// <param name="settings">The settings.</param>
        public DataResult ExecuteQuery(DataSettings settings)
        {
            DataResult result = new DataResult();

            try
            {
                if (this.connection.State != ConnectionState.Open)
                {
                    this.connection.Open();
                }

                using (SqlCommand command = new SqlCommand(settings.Task, this.connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // parameters
                    if (settings.Parameters != null)
                    {
                        command.Parameters.AddRange(GetSqlParameters(settings.Parameters));
                    }

                    // automatically add the return value parameter to each call.
                    SqlParameter returnValue = AddReturnValueParameter(command);

                    SqlServerReader reader = new SqlServerReader(command.ExecuteReader(CommandBehavior.CloseConnection));
                   // SqlDataReader reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                    result.Reader = reader;

                    if (returnValue != null && returnValue.Value(1) == 0)
                    {
                        result.Success = false;

                        Exception ex = new Exception(string.Format("The task: {0} did not execute successfully. Task ID: {1}. Please check the Logs for more information", settings.Task, settings.Id));
                        Log.Exception(Component, Sender, ex, this.Director);

                        result.Exception = ex;
                        result.Message = returnValue.Value(1).ToString();
                    }
                    else
                    {
                        result.Success = true;
                        result.Message = "1";
                    }
                }
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Exception = ex;
                Log.Exception(Component, Sender, ex, this.Director);
            }

            return result;
        }

   
        /// <summary>
        /// Initializes the provider with a connection string.
        /// </summary>
        /// <param name="connectionString">The connection string.</param>
        public void Initialise(string connectionString)
        {
            this.connection = new SqlConnection(connectionString);
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Initializes the provider with a Director.
        /// Assumes the Connection property has already been set.
        /// </summary>
        /// <param name="context">The Director.</param>
        public void Initialise(IDirector context = null)
        {
            this.director = context;
            this.connection = new SqlConnection(this.Connection.ConnectionString);
        }

        #endregion

        #region  Private Methods

        ///// <summary>
        ///// Formats the value.
        ///// </summary>
        ///// <param name="paramDataType">Type of the parameter data.</param>
        ///// <param name="value">The value.</param>
        ///// <returns>
        ///// A formatted value.
        ///// </returns>
        //private object FormatValue(string paramDataType, string value)
        //{
        //    if (paramDataType == DataTypes.Boolean)
        //    {
        //        byte result;
        //        bool boolResult;

        //        if (byte.TryParse(value, out result))
        //        {
        //            return result;
        //        }

        //        if (bool.TryParse(value, out boolResult))
        //        {
        //            return boolResult;
        //        }

        //        return value == SqlConfigItems.BooleanTrueRepresentation ? 1 : 0;
        //    }

        //    if (paramDataType == DataTypes.DateTime)
        //    {
        //        if (string.IsNullOrEmpty(value) || value.ToLower() == "null")
        //        {
        //            return DBNull.Value;
        //        }

        //        TimeZoneInfo timeZone = TimeZoneInfo.FindSystemTimeZoneById(this.director.User.TimeZone);
        //        return timeZone.BaseUtcOffset.Minutes != 0 ? TimeZoneInfo.ConvertTimeToUtc(DateTime.Parse(value.Trim()), timeZone) : DateTime.Parse(value.Trim());
        //    }

        //    if (paramDataType == DataTypes.Decimal)
        //    {
        //        return decimal.Parse(value.Trim());
        //    }

        //    if (paramDataType == DataTypes.Guid)
        //    {
        //        return Guid.Parse(value.Trim());
        //    }

        //    if (value.ToLower() == "null")
        //    {
        //        return DBNull.Value;
        //    }

        //    return value.Trim();
        //}

     
        /// <summary>
        /// Adds the return value parameter.
        /// </summary>
        /// <param name="sqlCommand">The SQL command.</param>
        private static SqlParameter AddReturnValueParameter(SqlCommand sqlCommand)
        {
            SqlParameter returnValueParameter = null;

            bool addReturnValue = true;

            for (int i = 0; i < sqlCommand.Parameters.Count; i++)
            {
                if (sqlCommand.Parameters[i].ParameterName != "@returnValue") continue;

                addReturnValue = false;
                returnValueParameter = sqlCommand.Parameters[i];
                break;
            }

            if (!addReturnValue) return returnValueParameter;

            returnValueParameter = new SqlParameter { ParameterName = "@returnValue", Value = 1, Direction = ParameterDirection.ReturnValue };
            sqlCommand.Parameters.Add(returnValueParameter);

            return returnValueParameter;
        }

        /// <summary>
        /// Gets the SQL parameters.
        /// </summary>
        /// <param name="parameters">The parameters.</param>
        /// <returns>A set of SQL Parameters.</returns>
        private static SqlParameter[] GetSqlParameters(DataParameters parameters)
        {
            List<SqlParameter> sqlParms = new List<SqlParameter>();

            foreach (DataParameter parm in parameters.Values.Where(p => p.DbType != DbType.Object))
            {
                SqlParameter sqlParm = new SqlParameter();

                if (parm.HasDbType)
                {
                    sqlParm.DbType = parm.DbType;
                }

                sqlParm.Direction = parm.Direction;
                sqlParm.IsNullable = parm.IsNullable;
                sqlParm.ParameterName = parm.ParameterName;
                sqlParm.Value = parm.Value;
                sqlParm.Scale = parm.Scale;
                sqlParm.Size = parm.Size;
                sqlParm.Precision = parm.Precision;

                sqlParms.Add(sqlParm);
            }

            return sqlParms.ToArray();
        }

        ///// <summary>
        ///// Sets the type of the parameter size and.
        ///// </summary>
        ///// <param name="dataType">Type of the data.</param>
        ///// <param name="sqlParm">The SQL parameter.</param>
        ///// <param name="value">The value.</param>
        //private void SetParameterSizeAndType(string dataType, SqlParameter sqlParm, object value)
        //{
        //    switch (dataType)
        //    {
        //        case DataTypes.Boolean:
        //            sqlParm.DbType = DbType.Boolean;
        //            break;
        //        case DataTypes.DateTime:
        //            sqlParm.DbType = DbType.DateTime;
        //            break;
        //        case DataTypes.Int16:
        //            sqlParm.DbType = DbType.Int16;
        //            break;
        //        case DataTypes.UInt16:
        //            sqlParm.DbType = DbType.UInt16;
        //            break;
        //        case DataTypes.Int32:
        //            sqlParm.DbType = DbType.Int32;
        //            break;
        //        case DataTypes.UInt32:
        //            sqlParm.DbType = DbType.UInt32;
        //            break;
        //        case DataTypes.Int64:
        //            sqlParm.DbType = DbType.Int64;
        //            break;
        //        case DataTypes.UInt64:
        //            sqlParm.DbType = DbType.UInt64;
        //            break;
        //        case DataTypes.Byte:
        //            sqlParm.DbType = DbType.Byte;
        //            break;
        //        case DataTypes.SByte:
        //            sqlParm.DbType = DbType.SByte;
        //            break;
        //        case DataTypes.Double:
        //            sqlParm.DbType = DbType.Double;
        //            break;
        //        case DataTypes.Single:
        //            sqlParm.DbType = DbType.Single;
        //            break;
        //        case DataTypes.Decimal:
        //            sqlParm.DbType = DbType.Decimal;
        //            sqlParm.Scale = 6;
        //            sqlParm.Precision = 20;
        //            break;
        //        case DataTypes.Object:
        //            sqlParm.DbType = DbType.Object;
        //            break;
        //        case DataTypes.Guid:
        //            sqlParm.DbType = DbType.Guid;
        //            break;
        //        default:
        //            sqlParm.DbType = DbType.String;
        //            if (value != null)
        //            {
        //                sqlParm.Size = value.ToString().Length;
        //            }

        //            if (sqlParm.Size == 0)
        //            {
        //                sqlParm.Size = 1;
        //            }

        //            break;
        //    }
        //}

        /// <summary>
        /// Updates the parameters.
        /// </summary>
        /// <param name="dataParameters">The data parameters.</param>
        /// <param name="sqlParameterCollection">The SQL parameter collection.</param>
        private void UpdateParameters(DataParameters dataParameters, SqlParameterCollection sqlParameterCollection)
        {
            IEnumerable<DataParameter> returnParams = dataParameters.Values.Where(n => n.Direction == ParameterDirection.Output || n.Direction == ParameterDirection.InputOutput || n.Direction == ParameterDirection.ReturnValue);
            foreach (DataParameter param in returnParams)
            {
                param.Value = sqlParameterCollection[param.ParameterName].Value;
            }
        }

        /// <summary>
        /// Generates the request text.
        /// </summary>
        /// <param name="command">The command.</param>
        /// <returns>The request text.</returns>
        private string GenerateRequestText(SqlCommand command)
        {
            StringBuilder textBuilder = new StringBuilder(1024);

            textBuilder.AppendFormat("CommandText:{0}", command.CommandText);
            textBuilder.AppendFormat(" Parameters: ");

            for (int i = 0; i < command.Parameters.Count; i++)
            {
                textBuilder.AppendFormat("{0}:{1}; ", command.Parameters[i].ParameterName, command.Parameters[i].Value);
            }

            return textBuilder.ToString();
        }

        #endregion
    }
}
