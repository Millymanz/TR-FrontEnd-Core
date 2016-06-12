using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Resource File formatter
    /// </summary>
    public class Resx
    {
        /// <summary>
        /// Formats the specified resource.
        /// </summary>
        /// <param name="resource">The resource.</param>
        /// <param name="values">The values to be inserted.</param>
        /// <returns>Formatted resource string</returns>
        public static string Format(string resource, params object[] values)
        {
            if (string.IsNullOrWhiteSpace(resource))
            {
                return string.Empty;
            }

            return string.Format(resource, values);
        }
    }
}
