using System.Data;

namespace TradeRiser.Core.Extensionss
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Text.RegularExpressions;

    /// <summary>
    /// Extenstions for the String class. 
    /// </summary>
    [Serializable]
    public static class StringExtensions
    {
		#region public methods 

        /// <summary>
        /// Splits a string based on a known delimter and string qualifier.
        /// </summary>
        /// <param name="expression">The string to split.</param>
        /// <param name="delimiter">The delimiter of the elements of the string.</param>
        /// <param name="qualifier">The string that denotes a string.</param>
        /// <param name="ignoreCase">Specifies whether the operation should be case sensitive.</param>
        public static string[] SafeSplit(this string expression, string delimiter = " ", string qualifier = "\"", bool ignoreCase = true)
        {
            string statement = string.Format("{0}(?=(?:[^{1}]*{1}[^{1}]*{1})*(?![^{1}]*{1}))", Regex.Escape(delimiter), Regex.Escape(qualifier));

            RegexOptions options = RegexOptions.Compiled | RegexOptions.Multiline;

            if (ignoreCase) options = options | RegexOptions.IgnoreCase;

            Regex regex = new Regex(statement, options);

            return regex.Split(expression);
        }

        /// <summary>
        /// Replaces the specified string to replace chars on.
        /// </summary>
        /// <param name="value">The string to replace chars on.</param>
        /// <param name="from">The characters to replace from.</param>
        /// <param name="to">The characters to replace to.</param>
        /// <returns>A String with replaced characters.</returns>
        public static string Replace(this string value, IEnumerable<char> from, IEnumerable<char> to)
        {
            if (from.Count() != to.Count())
            {
                throw new Exception("Character replacement colletions do not have same number of elements");
            }

            var replaceFromList = from.ToList();
            var replaceToList = to.ToList();

            StringBuilder replacedString = new StringBuilder();

            foreach (var item in value)
            {
                if (from.Contains(item))
                {
                    replacedString.Append(replaceToList[replaceFromList.IndexOf(item)]);
                }
                else
                {
                    replacedString.Append(item);
                }
            }

            return replacedString.ToString();
        }

        /// <summary>
        /// Reverses the specified string value.
        /// </summary>
        /// <param name="value">The string to reverse.</param>
        /// <returns>A reversed string.</returns>
        public static string Reverse(this string value)
        {
            return new string(value.ToCharArray().Reverse().ToArray());
        }

        /// <summary>
        /// Converts Array To Sentence.
        /// </summary>
        /// <param name="words">The words.</param>
        /// <returns>A sentence representaion of the array.</returns>
        public static string ToSentence(this IEnumerable<string> words)
        {
            string sentence = string.Empty;

            switch (words.Count())
            {
                case 0:
                    break;
                case 1:
                    sentence = words.Single();
                    break;
                case 2:
                    sentence = words.First() + " and " + words.Last();
                    break;
                default:
                    sentence = words.Take(words.Count() - 1).Aggregate(string.Empty, (s, n) => s += n + ", ");
                    sentence += "and ";
                    sentence += words.Last();
                    break;
            }

            return sentence;
        }

        /// <summary>
        /// Truncates the string to specified length.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="length">The length.</param>
        /// <param name="ellipsis">Show Ellipsis.</param>
        /// <returns>Truncated string.</returns>
        public static string Truncate(this string value, int length, bool ellipsis)
        {
            if (value == null)
            {
                return value;
            }

            if (value.Length < length)
            {
                return value;
            }
            else
            {
                if (ellipsis)
                {
                    return string.Format("{0}...", value.Substring(0, length));
                }
                else
                {
                    return value.Substring(0, length);
                }
            }
        }

        /// <summary>
        /// Truncates the string to specified length.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="length">The length.</param>
        /// <returns>Truncated string.</returns>
        public static string Truncate(this string value, int length)
        {
            return value.Truncate(length, false);
        }

        /// <summary>
        /// Determines whether [is null or empty] [the specified value].
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>
        /// 	<c>true</c> if [is null or empty] [the specified value]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsNullOrEmpty(this string value)
        {
            return string.IsNullOrEmpty(value);
        }

        /// <summary>
        /// Determines whether [is not null or empty] [the specified value].
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>
        /// 	<c>true</c> if [is not null or empty] [the specified value]; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsNotNullOrEmpty(this string value)
        {
            return !string.IsNullOrEmpty(value);
        }

        /// <summary>
        /// Determines whether an enumerable of string contains a value like the specified string.
        /// </summary>
        /// <param name="strings">The strings.</param>
        /// <param name="value">The value.</param>
        /// <returns>
        /// 	<c>true</c> if strings contains a value like like the specified string otherwise, <c>false</c>.
        /// </returns>
        public static bool ContainsValueLike(this IEnumerable<string> strings, string value)
        {
            if (value.IsNotNullOrEmpty())
            {
                foreach (string str in strings)
                {
                    if (str.IsNotNullOrEmpty())
                    {
                        if (value.ToLower().Contains(str.ToLower()))
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

		#endregion public methods 
    }
}
