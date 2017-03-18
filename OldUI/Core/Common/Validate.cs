namespace TradeRiser.Core.Common
{
    using System;
    using System.Globalization;
    using System.Linq;
    using System.Text.RegularExpressions;

    [Serializable]
    public static class Validate
    {
        #region public methods

        public static void ArgumentNotEmpty(Guid parameterValue, string parameterName)
        {
            if (parameterValue == Guid.Empty)
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.EmptyArgument, parameterName), parameterName);
            }
        }

        public static void ArgumentNotNull<T>(T parameterValue, string parameterName) where T : class
        {
            if (parameterValue == null)
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.NullArgument, parameterName, typeof(T).ToString()), parameterName);
            }
        }

        public static void ArgumentNotNullOrEmpty(string parameterValue, string parameterName)
        {
            if (string.IsNullOrEmpty(parameterValue))
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.NullOrEmptyArgument, parameterName), parameterName);
            }
        }

        public static void ArgumentNotNullOrEmpty(string parameterValue, int maxLength, string parameterName)
        {
            ArgumentNotNullOrEmpty(parameterValue, parameterName);

            if (parameterValue.Length > maxLength)
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.StringTooLong, parameterName, maxLength));
            }
        }

        public static bool IsValidEmailAddress(string emailAddress)
        {
            if (string.IsNullOrEmpty(emailAddress))
            {
                return false;
            }

            Regex regex = new Regex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
            return regex.IsMatch(emailAddress);
        }

        public static bool IsValidSpecificCulture(string cultureName)
        {
            if (string.IsNullOrEmpty(cultureName))
            {
                return false;
            }

            return CultureInfo.GetCultures(CultureTypes.SpecificCultures)
                .Any(a => a.Name == cultureName);
        }

        #endregion public methods
    }
}
