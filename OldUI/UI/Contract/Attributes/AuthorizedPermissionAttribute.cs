namespace TradeRiser.UI.Attributes
{
    using System;
    using TradeRiser.Core.Director;
    using TradeRiser.Core.Logging;

    /// <summary>
    /// Authorizes the execution of the actions.
    /// </summary>
    public class AuthorisedPermissionAttribute : Attribute
    {
        /// <summary>
        /// The sender name.
        /// </summary>
        private const string SENDER = "AuthorisedPermissionAttribute";
        
        /// <summary>
        /// Checks if the parameters are valid.
        /// </summary>
        private bool validParameters;

        public string ApplicationName
        {
            get;
            private set;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthorisedPermissionAttribute" /> class.
        /// </summary>
        /// <param name="appName">Name of the application.</param>
        public AuthorisedPermissionAttribute(string appName)
        {
            this.ApplicationName = appName;
            this.validParameters = true;
            
            if (string.IsNullOrEmpty(this.ApplicationName))
            {
                this.validParameters = false;
                Log.Exception(CoreConstants.LogComponent, SENDER, new ArgumentNullException("applicationName", "Application name is null or empty string")); 
            }
        }

        /// <summary>
        /// Authorizes the specified director.
        /// </summary>
        /// <param name="director">The director.</param>
        /// <returns>True if the permission is granted for the user.</returns>
        public bool Authorize(IDirector director)
        {
            bool authorized = false;
            if (director.User != null)
            {
                if (this.validParameters)
                {
                                          authorized = true;
                 }
            }
            else
            {
                string exceptionMessage = string.Format("Attempt to access {0} failed. Director has no User object.", this.ApplicationName);
                Log.Exception(CoreConstants.LogComponent, SENDER, new ArgumentNullException("IDirector.User", exceptionMessage));
            }

            return authorized;
        }
    }
}
