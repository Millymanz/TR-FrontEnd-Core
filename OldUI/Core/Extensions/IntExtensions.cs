namespace TradeRiser.Core.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// Int extension methods.
    /// </summary>
    public static class IntExtensions
    {
		#region public methods 

        /// <summary>
        ///  Checks if number is between two values.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="min">The min value.</param>
        /// <param name="max">The max value.</param>
        /// <returns>True is number is between the two values.</returns>
        public static bool Between(this int value, int min, int max)
        {
            return value >= min && value <= max;
        }

        /// <summary>
        /// Converts int to Bytes.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Value in Bytes.</returns>
        public static int Bytes(this int value)
        {
            return value;
        }

        /// <summary>
        /// Checks if value is even.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>True if value is even.</returns>
        public static bool Even(this int value)
        {
            return value % 2 == 0;
        }

        /// <summary>
        /// Converts int to Kilobytes.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Value in Kilobytes.</returns>
        public static int Kilobytes(this int value)
        {
            return value * 1024;
        }

        /// <summary>
        /// Converts int to Megabyte. 
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Value in megabytes.</returns>
        public static int Megabytes(this int value)
        {
            return value * 1024 * 1024;
        }

        /// <summary>
        /// Checks if value is odd. 
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>True if value is odd.</returns>
        public static bool Odd(this int value)
        {
            return value % 2 != 0;
        }

        /// <summary>
        /// Executes the action a number of times. 
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="action">The action.</param>
        public static void Times(this int value, Action<int> action)
        {
            for (int i = 0; i < value; i++)
            {
                action(i);
            }
        }

        /// <summary>
        /// Ordinalises the specified value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Ordinalised number.</returns>
        public static string Ordinalise(this int value)
        {
            string ordinalised;

            if ((value % 100).Between(11, 13))
            {
                ordinalised = "th";
            }
            else
            {
                switch (value % 10)
                {
                    case 1:
                        ordinalised = "st"; 
                        break;
                    case 2:
                        ordinalised = "nd"; 
                        break;
                    case 3:
                        ordinalised = "rd"; 
                        break;
                    default:
                        ordinalised = "th"; 
                        break;
                }
            }

            return value + ordinalised;
        }

        /// <summary>
        /// Gets Hours from an int. 
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Timespan for the value.</returns>
        public static TimeSpan Hours(this int value)
        {
            return TimeSpan.FromHours(value);
        }

        /// <summary>
        /// Gets Minutes from an int. 
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Timespan for the value.</returns>
        public static TimeSpan Minutes(this int value)
        {
            return TimeSpan.FromMinutes(value);
        }

        /// <summary>
        /// Gets Seconds from an int. 
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>Timespan for the value.</returns>
        public static TimeSpan Seconds(this int value)
        {
            return TimeSpan.FromSeconds(value);
        }

        /// <summary>
        /// Creates a range from a int.
        /// </summary>
        /// <param name="first">The first number.</param>
        /// <param name="last">The last number.</param>
        /// <returns>An Enumerable of int.</returns>
        public static IEnumerable<int> UpTo(this int first, int last)
        {
            return Enumerable.Range(first, last - first + 1);
        }

		#endregion public methods 
    }
}