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


            //routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{parameter}",
            //    defaults: new { controller = "AppInfo", action = "Index", parameter = UrlParameter.Optional }
            //);

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);


            routes.MapRoute(
                name: "Default-7",
                url: "core/changepassword/{resetToken}",
                defaults: new { controller = "Core", action = "changepassword", resetToken = UrlParameter.Optional }
            );

            routes.MapRoute(
                     name: "Default-6",
                     url: "core/forgotPassword/{userNameOrEmail}",
                     defaults: new { controller = "Core", action = "ForgotPassword", userNameOrEmail = UrlParameter.Optional }
                 );
            routes.MapRoute(
                      name: "Default-5",
                      url: "membership",
                      defaults: new { controller = "Membership", action = "Index" }
                  );
            routes.MapRoute(
                        name: "Default-4",
                        url: "membership/save",
                        defaults: new { controller = "Membership", action = "Save" }
                    );
            routes.MapRoute(
                        name: "Default-3",
                        url: "membership/edit/{userName}",
                        defaults: new { controller = "Membership", action = "Edit" }
                    );


            routes.MapRoute(
               name: "Default-2",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "App", action = "Index", id = UrlParameter.Optional }
           );
            routes.MapRoute(
             name: "Default-1",
             url: "{controller}/{action}/{id}",
             defaults: new { controller = "Core", action = "Logon", id = UrlParameter.Optional }
         );

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