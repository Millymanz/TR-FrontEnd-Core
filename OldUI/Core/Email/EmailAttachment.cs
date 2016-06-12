namespace TradeRiser.Core.Mail
{
    using System;
    using System.IO;

    /// <summary>
    /// Email attacment 
    /// </summary>
    [Serializable]
    public class EmailAttachment
    {
        /// <summary>
        /// Gets or sets the full name of the file.
        /// </summary>
        /// <value>
        /// The full name of the file.
        /// </value>
        public string FullFileName { get; set; }

        /// <summary>
        /// Gets or sets the name of the file.
        /// </summary>
        /// <value>
        /// The name of the file.
        /// </value>
        public string FileName { get; set; }

        /// <summary>
        /// Gets or sets the type of the content.
        /// </summary>
        /// <value>
        /// The type of the content.
        /// </value>
        public string ContentType { get;  set; }

        /// <summary>
        /// Gets or sets the content stream.
        /// </summary>
        /// <value>
        /// The content stream.
        /// </value>
        public Stream ContentStream { get; set; }

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; }      
    }
}