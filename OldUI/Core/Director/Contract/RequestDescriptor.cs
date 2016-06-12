namespace TradeRiser.Core.Director
{
    using System;
    using System.Web;

    /// <summary>
    /// Wrapper to describe the request.
    /// </summary>
    [Serializable]
    public class RequestDescriptor : IRequestDescriptor
    {
        #region private fields

        /// <summary>
        /// The content type of the request.
        /// </summary>
        private string contentType;

        /// <summary>
        /// The collection of form variables.
        /// </summary>
        private NameValueCollectionWrapper form;

        /// <summary>
        /// The raw payload of the request.
        /// </summary>
        private string payload;

        /// <summary>
        /// The collection of HTTP query-string variables.
        /// </summary>
        private NameValueCollectionWrapper queryString;

        /// <summary>
        /// The base Http request.
        /// </summary>
        private HttpRequestBase request;

        /// <summary>
        /// The request Url.
        /// </summary>
        private Uri url;

        #endregion private fields

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="RequestDescriptor"/> class.
        /// </summary>
        /// <param name="request">The request.</param>
        public RequestDescriptor(HttpRequestBase request)
        {
            this.request = request;
            this.queryString = new NameValueCollectionWrapper(request.QueryString);
            this.form = new NameValueCollectionWrapper(request.Form);
            this.url = request.Url;
            this.contentType = request.ContentType;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets the content type of the request.
        /// </summary>
        /// <value>
        /// The type of the content.
        /// </value>
        public string ContentType
        {
            get
            {
                return this.contentType;
            }
        }

        /// <summary>
        /// Gets the collection of form variables.
        /// </summary>
        /// <value>The form.</value>
        public NameValueCollectionWrapper Form
        {
            get
            {
                return this.form;
            }
        }

        /// <summary>
        /// Gets the raw payload of the request.
        /// </summary>
        public string Payload
        {
            get
            {
                if (string.IsNullOrEmpty(this.payload))
                {
                    this.request.InputStream.Position = 0;
                    using (System.IO.StreamReader reader = new System.IO.StreamReader(this.request.InputStream))
                    {
                        this.payload = reader.ReadToEnd();
                    }
                }

                return this.payload;
            }
        }

        /// <summary>
        /// Gets the collection of HTTP query-string variables.
        /// </summary>
        /// <value>The querystring.</value>
        public NameValueCollectionWrapper Querystring
        {
            get
            {
                return this.queryString;
            }
        }

        /// <summary>
        /// Gets the request URL.
        /// </summary>
        /// <value>The request URL.</value>
        public Uri Url
        {
            get
            {
                return this.url;
            }
        }

        #endregion properties
    }
}
