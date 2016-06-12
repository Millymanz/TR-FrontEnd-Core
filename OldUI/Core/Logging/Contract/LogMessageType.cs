namespace TradeRiser.Core.Logging
{
    /// <summary>
    /// The type of message being logged.
    /// </summary>
    public enum LogMessageType
    {
        /// <summary>
        /// An informative audit message.
        /// </summary>
        Audit = 1,

        /// <summary>
        /// A warning that an error or exception has been handled.
        /// </summary>
        Warning = 2,

        /// <summary>
        /// An exception has occured.
        /// </summary>
        Exception = 4,

        /// <summary>
        /// A debug message.
        /// </summary>
        Debug = 8
    }
}
