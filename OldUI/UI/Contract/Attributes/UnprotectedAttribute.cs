namespace TradeRiser.UI.Attributes
{
    using System;
    using System.Diagnostics.CodeAnalysis;

    /// <summary>
    /// When used on a CPF controller, indicates that the controller is unprotected.
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class UnprotectedAttribute : Attribute
    {
        /// <summary>
        /// If true, the unprotected attribute cannot be overriden by the web.config setting.
        /// </summary>
        private bool force = false;

        /// <summary>
        /// Gets a value indicating whether the unprotected attribute cannot be overriden by the web.config setting.
        /// </summary>
        /// <value><c>True</c> to force; otherwise, <c>false</c>.</value>
        public bool Force 
        {
            get
            {
                return this.force;
            }
        }

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="UnprotectedAttribute"/> class.
        /// </summary>
        public UnprotectedAttribute()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="UnprotectedAttribute"/> class.
        /// </summary>
        /// <param name="force">If set to <c>true</c>, force the unprotected attribute to override the web.config setting.</param>
        public UnprotectedAttribute(bool force)
        {
            this.force = force;
        }

        #endregion constructors
    }
}
