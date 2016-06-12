namespace TradeRiser.Core.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public interface ILogProvider : IDisposable
    {
        /// <summary>
        /// Gets or sets the settings.
        /// </summary>
        /// <value>
        /// The settings.
        /// </value>
        string Settings { get; set; }

        /// <summary>
        /// Begins the writing transaction.
        /// </summary>
        void BeginWriting();

        /// <summary>
        /// Writes a message to the log.
        /// </summary>
        /// <param name="message"></param>
        void WriteMessage(LogMessage message);

        /// <summary>
        /// Ends the writing transaction.
        /// </summary>
        /// <param name="success">if set to <c>true</c> [success].</param>
        void EndWriting(bool success = true);
    }
}
