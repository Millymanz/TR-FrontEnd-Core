using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace TradeRiser
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{parameter}",
                defaults: new { controller = "AppInfo", action = "Index", parameter = UrlParameter.Optional }
            );


            //routes.MapRoute(
            //    name: "App",
            //    url: "{controller}/{action}/{username}"
            // );




        }
    }
}