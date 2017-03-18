namespace TradeRiser.Core.Common
{
    using System;
    using System.ComponentModel;
    using System.Globalization;

    [Serializable]
    public static class TypeConverter
    {
        #region public static methods
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
            catch (Exception ex)
            {
                Logging.Log.Exception("Common", "TypeConverter.ChangeType", ex);
                newValue = defaultValue;
            }

            return newValue;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1004:GenericMethodsShouldProvideTypeParameter", Justification = "As designed")]
        public static T GetTypeFromString<T>(string type)
        {
            var typeConvertor = TypeDescriptor.GetConverter(typeof(T));
            return (T)typeConvertor.ConvertFromInvariantString(type);
        }

        #endregion public static methods
    }
}
