using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml.Serialization;

namespace TradeRiser.UI.Security
{
    /// <summary>
    /// Carries Forms Authentication Ticket infomation.
    /// </summary>
    [Serializable]
    public class CpfFatInfo
    {
        #region private fields

        /// <summary>
        /// The FAT domain.
        /// </summary>
        private string domain = string.Empty;

        #endregion private fields

        #region properties

        /// <summary>
        /// Gets or sets the domain for the user.
        /// </summary>
        /// <value>The domain name.</value>
        public string Domain
        {
            get
            {
                return this.domain.ToUpper(CultureInfo.CurrentCulture);
            }

            set
            {
                this.domain = value.ToUpper(CultureInfo.CurrentCulture);
            }
        }

        /// <summary>
        /// Gets or sets the security mode.
        /// </summary>
        /// <value>The security mode.</value>
        public SecurityMode SecurityMode { get; set; }

        /// <summary>
        /// Gets or sets the user id.
        /// </summary>
        /// <value>The user id.</value>
        public Guid UserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>The name of the user.</value>
        public string UserName { get; set; }

        #endregion properties

        #region public static methods

        /// <summary>
        /// Deserializes the specified XML.
        /// </summary>
        /// <param name="xml">The object XML.</param>
        /// <returns>The deserialised CpfFatInfo object.</returns>
        public static CpfFatInfo Deserialize(string xml)
        {
            using (StringReader sr = new StringReader(xml))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(CpfFatInfo));
                object o = serializer.Deserialize(sr);

                return o as CpfFatInfo;
            }
        }

        #endregion public static methods

        #region public methods

        /// <summary>
        /// Returns a <see cref="T:System.String"/> that represents the current <see cref="T:System.Object"/>.
        /// </summary>
        /// <returns>A<see cref="T:System.String"/> that represents the current <see cref="T:System.Object"/>.</returns>
        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            using (StringWriter sw = new StringWriter(sb, CultureInfo.CurrentCulture))
            {
                XmlSerializer serializer = new XmlSerializer(this.GetType());
                serializer.Serialize(sw, this);

                return sb.ToString();
            }
        }

        #endregion public methods
    }

    /// <summary>
    /// Options for types of Security Mode in Core.
    /// </summary>
    [Serializable]
    public enum SecurityMode
    {
        /// <summary>
        /// Windows Integrated security is being used.
        /// </summary>
        Integrated,

        /// <summary>
        /// Application security is being used.
        /// </summary>
        Forms,

        /// <summary>
        /// Security model has not yet been established.
        /// </summary>
        Unknown
    }
}