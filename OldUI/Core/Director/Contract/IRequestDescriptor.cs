namespace TradeRiser.Core.Director
{
    using System;

    /// <summary>
    /// The interface for the request descriptor.
    /// </summary>
    public interface IRequestDescriptor
    {
		#region properties 

        /// <summary>
        /// Gets the collection of form variables.
        /// </summary>
        /// <value>The form.</value>
        NameValueCollectionWrapper Form { get; }

        /// <summary>
        /// Gets the collection of HTTP query-string variables.
        /// </summary>
        /// <value>The querystring.</value>
        NameValueCollectionWrapper Querystring { get; }

        /// <summary>
        /// Gets the actual route.
        /// </summary>
        /// <value>The route.</value>
        // CpfRoute Route { get; }

        /// <summary>
        /// Gets the request URL.
        /// </summary>
        /// <value>The request URL.</value>
        Uri Url { get; }

        /// <summary>
        /// Gets the raw payload of the request.
        /// </summary>
        string Payload { get;  }

        /// <summary>
        /// Gets the content type of the request.
        /// </summary>
        /// <value>
        /// The type of the content.
        /// </value>
        string ContentType { get; }

		#endregion properties 
    }
}
