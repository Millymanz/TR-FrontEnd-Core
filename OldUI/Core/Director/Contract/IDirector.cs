namespace TradeRiser.Core.Director
{
    using System;
   
    using Configuration;
    using Membership;
  

    /// <summary>
    /// The TradeRiser platform director. (Fat controller).
    /// </summary>
    public interface IDirector
    {
		#region properties 

        /// <summary>
        /// Gets or sets the application path.
        /// </summary>
        /// <value>The application path.</value>
        string ApplicationPath
        {
            get;
            set;
        }

        /// <summary>
        /// Gets the relative url of the current request. 
        /// </summary>
        /// <value>The application relative URL.</value>
        string ApplicationRelativeUrl
        {
            get;
        }

        /// <summary>
        /// Gets the external application address outside of any firewalls or proxies.
        /// </summary>
        /// <value>The external application address.</value>
        string ExternalApplicationAddress
        {
            get;
        }

        /// <summary>
        /// Gets or sets the build version.
        /// </summary>
        /// <value>
        /// The build version.
        /// </value>
        string BuildVersion
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
        ConfigurationService Configuration
        {
            get;
            set;
        }


        /// <summary>
        /// Gets or sets the culture code.
        /// </summary>
        /// <value>
        /// The culture code.
        /// </value>
        string CultureCode
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
        //bool IsAnonymousUser
        //{
        //    get;
        //}

        /// <summary>
        /// Gets the membership service.
        /// </summary>
        /// <value>The membership service.</value>
        MembershipService Membership
        {
            get;
        }

        PermissionService Permission
        {
            get;
        }
       
        /// <summary>
        /// Gets or sets the request descriptor with useful information about the current request.
        /// </summary>
        /// <value>The current request descriptor.</value>
        IRequestDescriptor Request
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the current user.
        /// </summary>
        /// <value>The current user.</value>
        User User
        {
            get;
            set;
        }

        ///// <summary>
        ///// Gets the variable parser.
        ///// </summary>
        //VariableParser VariableParser
        //{
        //    get;
        //}

		#endregion properties 

		#region methods 

      

        /// <summary>
        /// Gets the display name of a user.
        /// </summary>
        /// <param name="userId">The user ID.</param>
        string GetUserDisplayName(Guid userId);

     
        #endregion methods 

        T Querystring<T>(string key);

        T Querystring<T>(string key, T defaultValue);
    }
}
