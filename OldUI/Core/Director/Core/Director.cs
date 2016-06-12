namespace TradeRiser.Core.Director
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Membership;
    using TradeRiser.Core.Configuration;

    /// <summary>
    /// A Director implementation.
    /// </summary>
    [Serializable]
    public class Director : IDirector
    {
        public const string JsUtilityMethodsConfigName = "Core.JSUtilityMethods";

        #region  Fields

        /// <summary>
        /// A mutual exclusion lock for the use of the jint engine.
        /// </summary>
        [NonSerialized]
        private readonly object jintMutex = new object();


        /// <summary>
        /// The application relative url backer.
        /// </summary>
        [NonSerialized]
        private string applicationRelativeUrl;

        /// The configuration.
        /// </summary>
        [NonSerialized]
        private ConfigurationService configuration;


        /// <summary>
        /// Backer for the ExternalApplicationAddress property.
        /// </summary>
        private string externalApplicationAddress;

        /// <summary>
        /// The membership.
        /// </summary>
        [NonSerialized]
        private MembershipService membership;

        /// <summary>
        /// The parser.
        /// </summary>
        [NonSerialized]
        private VariableParser parser;



        /// <summary>
        /// The permissions service.
        /// </summary>
        private PermissionService permissions;

        /// <summary>
        /// The request.
        /// </summary>
        [NonSerialized]
        private IRequestDescriptor request;

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="Director" /> class.
        /// </summary>
        /// <param name="testMode">if set to <c>true</c> [test mode].</param>
        public Director(bool testMode = true)
        {
            this.parser = new VariableParser(this);
            if (testMode)
            {
                this.configuration = new ConfigurationService();// Dependency.GetConfigurationService();
                //this.membership = Dependency.Get<IMembershipService>(this.configuration);
                this.membership = new MembershipService(this.configuration);
            }
            else
            {
                this.configuration = new ConfigurationService();
                this.membership = new MembershipService(this.configuration);
            }
        }



        #endregion

        #region IDirector Members


        /// <summary>
        /// Gets or sets the application path.
        /// </summary>
        /// <value>
        /// The application path.
        /// </value>
        public string ApplicationPath
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the relative url of the current request. 
        /// </summary>
        /// <value>The application relative URL.</value>
        public string ApplicationRelativeUrl
        {
            get
            {
                if (this.applicationRelativeUrl != null) return this.applicationRelativeUrl;

                string fullUrl = this.Request.Url.ToString();
                int index = fullUrl.IndexOf(this.ApplicationPath, StringComparison.Ordinal);

                this.applicationRelativeUrl = index > -1 ? fullUrl.Substring(index) : fullUrl;

                return this.applicationRelativeUrl;
            }
        }

        /// <summary>
        /// Gets or sets the build version.
        /// </summary>
        /// <value>
        /// The build version.
        /// </value>
        public string BuildVersion
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the configuration.
        /// </summary>
        /// <value>
        /// The configuration.
        /// </value>
        public ConfigurationService Configuration
        {
            get
            {
                return this.configuration;
            }

            set
            {
                this.configuration = value;
            }
        }

        /// <summary>
        /// Gets or sets the culture code.
        /// </summary>
        /// <value>
        /// The culture code.
        /// </value>
        public string CultureCode
        {
            get;
            set;
        }

        ///// <summary>
        ///// Gets a value indicating whether this request is running by an anonymous user.
        ///// </summary>
        ///// <value>
        ///// 	<c>True</c> if this request is anonymous; otherwise, <c>false</c>.
        ///// </value>
        //public virtual bool IsAnonymousUser => this.User is AnonymousUser;

        /// <summary>
        /// Gets the membership service.
        /// </summary>
        /// <value>
        /// The membership service.
        /// </value>
        public MembershipService Membership
        {

            get
            {

                if (this.membership == null)
                {
                    this.membership = new MembershipService(this.configuration);
                }
                return this.membership;// as IMembershipService;
            }
            set
            {
                this.membership = value;
            }
        }
     

        /// <summary>
        /// Gets or sets the request descriptor with useful information about the current request.
        /// </summary>
        /// <value>
        /// The current request descriptor.
        /// </value>
        public IRequestDescriptor Request
        {
            get
            {
                return this.request;
            }
            set
            {
                this.request = value;
            }
        }

        /// <summary>
        /// Gets or sets the current user.
        /// </summary>
        /// <value>
        /// The current user.
        /// </value>
        public User User
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the variable parser.
        /// </summary>
        //   public VariableParser VariableParser => this.parser ?? (this.parser = new VariableParser(this));

        public VariableParser MyProperty
        {
            get
            {
                if (this.parser == null)
                {
                    this.parser = new VariableParser(this);
                }
                return this.parser;
            }
            set
            {
                this.parser = value;
            }

        }
        // <summary>
        /// Gets the permissions service.
        /// </summary>
        public PermissionService Permission
        {
            get
            {
                if (this.permissions != null) return this.permissions;

                TimeSpan ts = TimeSpan.FromMinutes(this.configuration.GetConfigItem("Cache.AdhocUserPermissionsCacheExpiryInMinutes", 30));
                this.permissions = new PermissionService(ts);

                return this.permissions;
            }
        }

        /// <summary>
        /// Gets the display name of a user.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        public string GetUserDisplayName(Guid userId)
        {
            User user = this.Membership.GetUserByID(userId);
            return user == null ? string.Empty : user.UserDisplayName;
        }


        /// <summary>
        /// Gets or sets the external application address outside of any firewalls or proxies.
        /// </summary>
        /// <value>The external application address.</value>
        public string ExternalApplicationAddress
        {
            get
            {
                if (!string.IsNullOrEmpty(this.externalApplicationAddress)) return this.externalApplicationAddress;

                this.externalApplicationAddress = this.Configuration.GetConfigItem("Core.ExternalApplicationAddress", string.Empty);

                if (!this.externalApplicationAddress.EndsWith("/"))
                {
                    this.externalApplicationAddress += "/";
                }

                return this.externalApplicationAddress;
            }
        }

        /// <summary>
        /// Get values from the query string
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key">The key.</param>
        /// <returns></returns>
        public T Querystring<T>(string key)
        {
            return this.Querystring(key, default(T));
        }

        /// <summary>
        /// Get values from the query string with optional default value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="key">The key.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns></returns>
        public T Querystring<T>(string key, T defaultValue)
        {
            Dictionary<string, string> query = new Dictionary<string, string>();
            string queryString = this.request.Url.PathAndQuery;

            if (queryString.Contains("?"))
            {
                string[] result = queryString.Substring(queryString.IndexOf("?", StringComparison.Ordinal) + 1).Split('&');

                for (int i = 0; i < result.Count(); i++)
                {
                    string[] split = result[i].Split('=');
                    if (split.Count() == 2)
                    {
                        query.Add(split[0], split[1]);
                    }
                }
            }

            T value = defaultValue;

            if (query.ContainsKey(key))
            {
                try
                {
                    if (typeof(T) == typeof(Guid))
                    {
                        Guid guid = new Guid(query[key]);
                        value = (T)Convert.ChangeType(guid, typeof(T));
                    }
                    else if (typeof(T).BaseType == typeof(Enum))
                    {
                        value = (T)Enum.Parse(typeof(T), query[key], true);
                    }
                    else
                    {
                        value = (T)Convert.ChangeType(query[key], typeof(T));
                    }
                }
                catch
                {
                    value = defaultValue;
                }
            }

            return value;
        }

        #endregion

        #region  Public Methods


        #endregion
    }
}
