using System.Web;
using System.Web.Optimization;

namespace TradeRiser
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));
            bundles.Add(new StyleBundle("~/Content/v2/css").Include(
                "~/Content/v2/vendors/bootstrap/dist/css/bootstrap.min.css",
                "~/Content/v2/vendors/font-awesome/css/font-awesome.min.css",
                "~/Content/v2/vendors/nprogress/nprogress.css",
                "~/Content/v2/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css",
                "~/Content/v2/vendors/bootstrap-daterangepicker/daterangepicker.css",
                 "~/Content/v2/vendors/animate.css/animate.min.css",
                "~/Content/v2/build/css/custom.min.css"));

            bundles.Add(new ScriptBundle("~/bundles/v2/scripts").Include(
                "~/Content/v2/vendors/fastclick/lib/fastclick.js",
                "~/Content/v2/vendors/nprogress/nprogress.js",
                "~/Content/v2/vendors/bootstrap-progressbar/bootstrap-progressbar.min.js",
                "~/Content/v2/vendors/skycons/skycons.js",
                "~/Content/v2/build/js/custom.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/Styles/bootstrap.css", "~/Content/Styles/form.css", "~/Content/Styles/shared.css"));
            bundles.Add(new ScriptBundle("~/bundles/cpf").Include(
                                  "~/Content/Scripts/corejsmvc.js",
                                  "~/Content/Scripts/jstz.js",
                                  "~/Content/Scripts/validation.js",
                                    "~/Content/Scripts/members.js",
                                     "~/Content/Scripts/settings.js",
                                     "~/Content/Scripts/changepassword.js",
                                     "~/Content/Scripts/feedback.js",
                                     "~/Content/Scripts/lightbox.js"
                                  ));
        }
    }
}