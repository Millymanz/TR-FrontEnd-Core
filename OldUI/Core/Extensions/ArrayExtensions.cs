namespace TradeRiser.Core.Extensions
{
    using System;
    using System.Linq;

    /// <summary>
    /// Extensions for Arrays.
    /// </summary>
    public static class ArrayExtensions
    {
		#region public methods 

        /// <summary>
        /// Converts an array of strings into a single comma separated string.
        /// </summary>
        /// <param name="items">The array of items.</param>
        /// <returns>The comma separated string.</returns>
        public static string AggregateIntoString(this string[] items)
        {
            return AggregateIntoString(items, ",");
        }

        /// <summary>
        /// Converts an array of strings into a single string separated by another string.
        /// </summary>
        /// <param name="items">The array of items.</param>
        /// <param name="separator">The separator.</param>
        /// <returns>A single string consisting of the items seperated by the separator string.</returns>
        public static string AggregateIntoString(this string[] items, string separator)
        {
            if (items.Length == 0)
            {
                return string.Empty;
            }

            return items.Aggregate((a, b) => a + separator + b);
        }

        /// <summary>
        /// Determines if two byte arrays are equivalent.
        /// </summary>
        /// <param name="value">The byte array to test.</param>
        /// <param name="other">The byte array to compare to.</param>
        /// <returns>True if the byte arrays are considered equal; otherwise false.</returns>
        public static bool IsEquivalentTo(this byte[] value, byte[] other)
        {
            if (other == null)
            {
                return false;
            }

            if (value.Length != other.Length)
            {
                return false;
            }

            for (int i = 0; i < value.Length; i++)
            {
                if (value[i] != other[i])
                {
                    return false;
                }
            }

            return true;
        }

		#endregion public methods 
    }
}
