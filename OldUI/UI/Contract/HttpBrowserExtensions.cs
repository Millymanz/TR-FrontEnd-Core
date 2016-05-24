using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI
{
    using System;
    using System.Text.RegularExpressions;
    using System.Web;

    /// <summary>
    /// HttpBrowserExtensions to help detect IE browser versions
    /// </summary>
    public static class HttpBrowserExtensions
    {
        #region Fields

        private static Regex tridentPattern = null;
        private static Regex versionPattern = null;

        #endregion Fields

        #region Methods

        /// <summary>
        /// Determines whether the specified request is ie.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns></returns>
        public static bool IsIE(this HttpRequestBase request)
        {
            bool isIE = false;
            string browser = request.Browser.Browser;

            // browsers older than IE11 will report the browser as IE where IE11 will report it as InternetExplorer.
            if (string.Equals("IE", browser, StringComparison.InvariantCultureIgnoreCase) || string.Equals("InternetExplorer", browser, StringComparison.InvariantCultureIgnoreCase))
            {
                isIE = true;
            }

            return isIE;
        }

        public static int IEVersion(this HttpRequestBase request)
        {
            int version = 0;

            if (versionPattern == null)
            {
                versionPattern = new Regex(@"rv:(\d+)\.(\d+)");
                tridentPattern = new Regex(@"Trident/(\d+)\.(\d+)");
            }

            if (request.IsIE())
            {
                // get the userAgent string and get the IE version.
                string userAgentString = request.UserAgent;

                if (userAgentString.Contains("Trident"))
                {
                    bool ok = false;
                    string majorVersion = null; // convertable to in
                    string minorVersion = null; // convertable to double

                    Match m = versionPattern.Match(userAgentString);

                    if (m.Success)
                    {
                        ok = true;
                        majorVersion = m.Groups[1].Value;
                        minorVersion = m.Groups[2].Value; // typically 0
                    }
                    else
                    {
                        m = tridentPattern.Match(userAgentString);

                        if (m.Success)
                        {
                            int v;
                            ok = int.TryParse(m.Groups[1].Value, out v);
                            if (ok)
                            {
                                v += 4; // Trident/7 = IE 11, Trident/6 = IE 10, Trident/5 = IE 9, and Trident/4 = IE 8
                                majorVersion = v.ToString(@"d");
                                minorVersion = m.Groups[2].Value; // typically 0
                            }
                        }
                    }

                    if (!string.IsNullOrWhiteSpace(majorVersion))
                    {
                        int found = 0;
                        if (int.TryParse(majorVersion, out found))
                        {
                            version = found;
                        }
                    }
                }
                else
                {
                    // fallback to normal method
                    version = request.Browser.MajorVersion;
                }
            }

            return version;
        }

        /// <summary>
        /// Determines whether the specified request is ie.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="version">The version.</param>
        /// <returns></returns>
        public static bool IsIE(this HttpRequestBase request, int version)
        {
            return version == IEVersion(request);
        }

        #endregion Methods
    }
}