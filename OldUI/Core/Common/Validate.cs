namespace TradeRiser.Core.Common
{
    using System;
    using System.Globalization;
    using System.Linq;
    using System.Text.RegularExpressions;
    using TradeRiser.Core.Common.Validation;

    /// <summary>
    /// Provides a set of data validation methods.
    /// </summary>
    [Serializable]
    public static class Validate
    {
		#region public methods 

        /// <summary>
        /// Throws an ArgumentException if the parameter value is an empty Guid.
        /// </summary>
        /// <param name="parameterValue">The parameter value.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        public static void ArgumentNotEmpty(Guid parameterValue, string parameterName)
        {
            if (parameterValue == Guid.Empty)
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.EmptyArgument, parameterName), parameterName);
            }
        }

        /// <summary>
        /// Throws an ArgumentException if the parameter value is null.
        /// </summary>
        /// <typeparam name="T">The type of the parameter.</typeparam>
        /// <param name="parameterValue">The parameter value.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        public static void ArgumentNotNull<T>(T parameterValue, string parameterName) where T : class
        {
            if (parameterValue == null)
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.NullArgument, parameterName, typeof(T).ToString()), parameterName);
            }
        }

        /// <summary>
        /// Throws an ArgumentException if the parameter value is null or empty.
        /// </summary>
        /// <param name="parameterValue">The parameter value.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        public static void ArgumentNotNullOrEmpty(string parameterValue, string parameterName)
        {
            if (string.IsNullOrEmpty(parameterValue))
            {
               throw new ArgumentException(Resx.Format(TradeRiserCoreResource.NullOrEmptyArgument, parameterName), parameterName);
            }
        }

        /// <summary>
        /// Throws an ArgumentException if the parameter value is null, empty or longer than the specified size.
        /// </summary>
        /// <param name="parameterValue">The parameter value.</param>
        /// <param name="maxLength">Length of the max.</param>
        /// <param name="parameterName">Name of the parameter.</param>
        public static void ArgumentNotNullOrEmpty(string parameterValue, int maxLength, string parameterName)
        {
            ArgumentNotNullOrEmpty(parameterValue, parameterName);

            if (parameterValue.Length > maxLength)
            {
                throw new ArgumentException(Resx.Format(TradeRiserCoreResource.StringTooLong, parameterName, maxLength));
            }
        }

        /// <summary>
        /// Determines whether an email address is valid.
        /// </summary>
        /// <param name="emailAddress">The email address.</param>
        /// <returns>
        /// 	<c>True</c> if a valid email address; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsValidEmailAddress(string emailAddress)
        {
            if (string.IsNullOrEmpty(emailAddress))
            {
                return false;
            }

            Regex regex = new Regex(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
            return regex.IsMatch(emailAddress);
        }

        /// <summary>
        /// Determines whether the specified name is a valid culture name.
        /// </summary>
        /// <param name="cultureName">Name of the culture.</param>
        /// <returns><c>True</c> if the culture name is valid; otherwise, <c>false</c>.</returns>
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
