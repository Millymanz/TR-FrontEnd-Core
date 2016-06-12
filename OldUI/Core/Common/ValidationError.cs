namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Contains information on a validation error.
    /// </summary>
    public class ValidationError
    {
		#region constructors 

        /// <summary>
        /// Initializes a new instance of the <see cref="ValidationError"/> class.
        /// </summary>
        /// <param name="key">The key.</param>
        /// <param name="attemptedValue">The attempted value.</param>
        /// <param name="errorMessage">The error message.</param>
        public ValidationError(string key, object attemptedValue, string errorMessage)
        {
            this.Key = key;
            this.AttemptedValue = attemptedValue;
            this.ErrorMessage = errorMessage;
        }

		#endregion constructors 

		#region properties 

        /// <summary>
        /// Gets or sets the attempted value.
        /// </summary>
        /// <value>The attempted value.</value>
        public object AttemptedValue { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>The error message.</value>
        public string ErrorMessage { get; set; }

        /// <summary>
        /// Gets or sets the key.
        /// </summary>
        /// <value>The key.</value>
        public string Key { get; set; }

		#endregion properties 
    }
}
