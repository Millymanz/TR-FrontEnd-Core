using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Provides a set of type conversion methods.
    /// </summary>
    [Serializable]
    public static class TypeConverter
    {
        #region public static methods

        /////// <summary>
        /////// Converts an object to a serialized array of bytes and compresses.
        /////// </summary>
        /////// <param name="value">The value.</param>
        ////public static byte[] ConvertAndCompact(object value)
        ////{
        ////    BinaryFormatter formatter = new BinaryFormatter();

        ////    using (MemoryStream ms = new MemoryStream())
        ////    {
        ////        formatter.Serialize(ms, value);
        ////        ms.Flush();

        ////        return LZ4Codec.Wrap(ms.ToArray());
        ////    }
        ////}

        /////// <summary>
        /////// Converts a compressed byte[] to a deserialized object.
        /////// </summary>
        /////// <param name="data">The bytes.</param>
        ////public static object ConvertAndUnCompact(byte[] data)
        ////{
        ////    BinaryFormatter formatter = new BinaryFormatter();

        ////    data = LZ4Codec.Unwrap(data);

        ////    using (MemoryStream ms = new MemoryStream(data))
        ////    {
        ////        return formatter.Deserialize(ms);
        ////    }
        ////}

        /// <summary>
        /// Creates a new instance of a type from a string.
        /// </summary>
        /// <typeparam name="T">The type to convert to.</typeparam>
        /// <param name="value">The value.</param>
        /// <param name="defaultValue">The default value.</param>
        public static T ChangeType<T>(string value, T defaultValue)
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            T newValue = defaultValue;

            try
            {
                if (typeof(T).IsEnum)
                {
                    newValue = (T)Enum.Parse(typeof(T), value);
                }
                else if (typeof(T) == typeof(TimeSpan))
                {
                    TimeSpan ts = TimeSpan.Parse(value);
                    newValue = (T)Convert.ChangeType(ts, typeof(T), CultureInfo.CurrentCulture);
                }
                else if (typeof(T) == typeof(bool))
                {
                    if (value.Equals("True") || value.Equals("true") || value.Equals("1"))
                    {
                        newValue = (T)Convert.ChangeType(true, typeof(T), CultureInfo.CurrentCulture);
                    }
                    else
                    {
                        newValue = (T)Convert.ChangeType(false, typeof(T), CultureInfo.CurrentCulture);
                    }
                }
                else
                {
                    newValue = (T)Convert.ChangeType(value, typeof(T), CultureInfo.CurrentCulture);
                }
            }
            catch (Exception)
            {
                // TODO: Log this Exception
                // Logging.Log.Exception("Common", "TypeConverter.ChangeType", e);
                newValue = defaultValue;
            }

            return newValue;
        }

        /// <summary>
        /// Gets the type from string.
        /// </summary>
        /// <typeparam name="T">The type to convert to.</typeparam>
        /// <param name="type">The type to convert to represented by a string.</param>
        /// <returns>A Type from the string.</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1004:GenericMethodsShouldProvideTypeParameter", Justification = "As designed")]
        public static T GetTypeFromString<T>(string type)
        {
            var typeConvertor = TypeDescriptor.GetConverter(typeof(T));
            return (T)typeConvertor.ConvertFromInvariantString(type);
        }

        #endregion public static methods
    }
}
