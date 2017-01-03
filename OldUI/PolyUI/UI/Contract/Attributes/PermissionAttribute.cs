namespace TradeRiser.UI.Attributes
{
    using System;
    using System.Diagnostics.CodeAnalysis;
    using System.Web.Mvc;
    using TradeRiser.Core.Director;
    using TradeRiser.Core.Logging;
    using TradeRiser.UI.Security;
  
    /// <summary>
    /// Permissions attribute.
    /// </summary>
   // [ExcludeFromCodeCoverage]
    public class PermissionAttribute : ActionFilterAttribute
    {
        #region private fields

        /// <summary>
        /// Guid containing the permission attribute provided.
        /// </summary>
        private readonly Guid permissionID;

        private IDirector director = null;

        #endregion private fields

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="PermissionAttribute"/> class.
        /// </summary>
        /// <param name="permission">The permission.</param>
        public PermissionAttribute(Type permission)
        {
            AreaPermission areaPermission = Activator.CreateInstance(permission) as AreaPermission;

            if (areaPermission != null)
            {
                this.permissionID = areaPermission.ID;
            }
        }

        #endregion constructors

        #region public methods

        /// <summary>
        /// Called by the ASP.NET MVC framework before the action method executes.
        /// </summary>
        /// <param name="filterContext">The filter context.</param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            Guid errorKey = Guid.NewGuid();
            if (filterContext.RequestContext.HttpContext.Request.Url != null)
            {
                string requestedPage = filterContext.RequestContext.HttpContext.Request.Url.LocalPath;
                string url = string.Format("{0}/Intrinsic/NotAuthorised.aspx?u={1}&r={2}&k={3}", filterContext.RequestContext.HttpContext.Request.ApplicationPath, this.director.User.UserName, requestedPage, errorKey);

                string logMessage = string.Format("User: {0} tried to access {1} but does not have permission to do so.", this.director.User.UserName, requestedPage);
                Log.Warning(errorKey, CoreConstants.LogComponent, "Permissions", logMessage, this.director.User.UserName, this.director.User.UserDisplayName);

                filterContext.Result = new RedirectResult(url);
            }
        }

        #endregion public methods
    }
}
