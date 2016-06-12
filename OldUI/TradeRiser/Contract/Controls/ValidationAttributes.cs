using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace TradeRiser.UI.Controls
{
    public class ValidationAttributes
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ValidationAttributes"/> is required.
        /// </summary>
        /// <value>
        ///   <c>True</c> if required; otherwise, <c>false</c>.
        /// </value>
        public bool Required { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is integer.
        /// </summary>
        /// <value>
        /// 	<c>True</c> if this instance is integer; otherwise, <c>false</c>.
        /// </value>
        public bool IsInteger { get; set; }

        /// <summary>
        /// Gets or sets the decimal places.
        /// </summary>
        /// <value>
        /// The decimal places.
        /// </value>
        public int DecimalPlaces { get; set; }

        /// <summary>
        /// Gets or sets the max.
        /// </summary>
        /// <value>
        /// The max.
        /// </value>
        public decimal? Max { get; set; }

        /// <summary>
        /// Gets or sets the min.
        /// </summary>
        /// <value>
        /// The min.
        /// </value>
        public decimal? Min { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ValidationAttributes"/> is numeric.
        /// </summary>
        /// <value>
        ///   <c>True</c> if numeric; otherwise, <c>false</c>.
        /// </value>
        public bool Numeric { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ValidationAttributes"/> is currency.
        /// </summary>
        /// <value>
        ///   <c>True</c> if currency; otherwise, <c>false</c>.
        /// </value>
        public bool Currency { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is a time span.
        /// </summary>
        /// <value>
        /// <c>True</c> if this instance is a time span; otherwise, <c>false</c>.
        /// </value>
        public bool IsTimeSpan { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ValidationAttributes"/> is an email.
        /// </summary>
        /// <value>
        ///   <c>True</c> if this is an email; otherwise, <c>false</c>.
        /// </value>
        public bool Email
        {
            get;
            set;
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Returns a <see cref="System.String"/> that represents this instance.
        /// </summary>
        /// <returns>
        /// A <see cref="System.String"/> that represents this instance.
        /// </returns>
        public override string ToString()
        {
            StringBuilder attributes = new StringBuilder();
            if (this.Required)
            {
                attributes.Append(" data-val-required='' ");
            }

            if (this.Currency)
            {
                attributes.Append(" data-val-iscurrency='' ");
            }
            else if (this.IsInteger)
            {
                attributes.Append(" data-val-isint='' ");
            }
            else if (this.DecimalPlaces > 0)
            {
                attributes.AppendFormat(" data-val-decimalplaces='' data-val-decimalplaces-value='{0}'", this.DecimalPlaces > 1 ? this.DecimalPlaces.ToString() : "1");
            }

            if (this.Numeric || this.IsInteger || this.Max.HasValue || this.Min.HasValue)
            {
                attributes.Append(" data-val-isnumeric='' ");
            }

            if (this.Max.HasValue)
            {
                attributes.AppendFormat(" data-val-max='' data-val-max-value='{0}'", this.Max.Value);
            }

            if (this.Min.HasValue)
            {
                attributes.AppendFormat(" data-val-min='' data-val-min-value='{0}'", this.Min.Value);
            }

            if (this.IsTimeSpan)
            {
                attributes.Append(" data-val-istimespan='' ");
            }

            if (this.Email)
            {
                attributes.Append(" data-val-isemail='' ");
            }

            return attributes.ToString();
        }

        #endregion
    }
}