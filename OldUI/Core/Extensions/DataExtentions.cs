using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using TradeRiser.Core.Logging;

namespace TradeRiser.Core.Extensions
{
    /// <summary>
    /// Data Access Extensions.
    /// </summary>
    public static class DataExtensions
    {
        /// <summary>
        /// Gets the specified value from the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="reader">The reader.</param>
        /// <param name="ordinal">The ordinal.</param>
        public static T Get<T>(this SqlDataReader reader, int ordinal)
        {
            return reader.Get<T>(ordinal, default(T));
        }

        /// <summary>
        /// Gets the specified value form the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="reader">The reader.</param>
        /// <param name="ordinal">The ordinal.</param>
        /// <param name="defaultValue">The default value.</param>
        public static T Get<T>(this SqlDataReader reader, int ordinal, T defaultValue)
        {
            T result = defaultValue;

            try
            {
                if (reader.FieldCount > ordinal)
                {
                    if (!reader.IsDBNull(ordinal))
                    {
                        if (typeof(T) == typeof(XElement))
                        {
                            string raw = reader.GetString(ordinal);
                            if (!string.IsNullOrWhiteSpace(raw))
                            {
                                XElement element = XElement.Parse(raw);
                                return (T)Convert.ChangeType(element, typeof(T), CultureInfo.CurrentCulture);
                            }
                        }
                        else if (typeof(T) == typeof(byte[]))
                        {
                            return (T)Convert.ChangeType(reader.GetSqlBinary(ordinal).Value, typeof(T), CultureInfo.CurrentCulture);
                        }
                        else if (typeof(T).BaseType == typeof(Enum))
                        {
                            return (T)Enum.Parse(typeof(T), reader.GetValue(ordinal).ToString());
                        }
                        else
                        {
                            result = (T)reader.GetValue(ordinal);
                        }
                    }
                }
            }
            catch
            {
                result = defaultValue;
            }

            return result;
        }

        /// <summary>
        /// Gets the specified value form the reader.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="parameter">The parameter.</param>
        /// <param name="defaultValue">The default value.</param>
        public static T Value<T>(this SqlParameter parameter, T defaultValue)
        {
            T result = defaultValue;
            if (parameter != null)
            {
                if (parameter.Value != null)
                {
                    try
                    {
                        result = (T)parameter.Value;
                    }
                    catch (Exception e)
                    {
                        Log.Warning("Data", "Extensions.Value", e.Message);
                        result = defaultValue;
                    }
                }
            }

            return result;
        }
    }
}
