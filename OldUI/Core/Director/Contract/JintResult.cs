namespace TradeRiser.Core.Director
{
    /// <summary>
    /// The result of a Jint evaluation.
    /// </summary>
    public class JintResult
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="JintResult"/> was successful.
        /// </summary>
        /// <value>
        ///   <c>True</c> if successful; otherwise, <c>false</c>.
        /// </value>
        public bool Success { get; set; }

        /// <summary>
        /// Gets or sets the expression result.
        /// </summary>
        /// <value>
        /// The expression result.
        /// </value>
        public object ExpressionResult { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }
    }
}
