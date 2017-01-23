using System.Web;
using System.Web.Optimization;

namespace TradeRiser
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/typeahead").Include(
                        "~/Scripts/typeahead.js"));
            bundles.Add(new ScriptBundle("~/bundles/hogan").Include(
                        "~/Scripts/hogan-2.0.0.js"));
            bundles.Add(new ScriptBundle("~/bundles/main").Include(
                "~/Scripts/main.js"));
            bundles.Add(new ScriptBundle("~/bundles/ghostwritermin").Include(
                "~/Scripts/ghostwriter.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/ghostwriter").Include(
                "~/Scripts/ghostwriter.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));
            bundles.Add(new StyleBundle("~/Content/v2/css").Include(
                "~/Content/v2/vendors/bootstrap/dist/css/bootstrap.min.css",
                "~/Content/v2/vendors/font-awesome/css/font-awesome.min.css",
                "~/Content/v2/vendors/nprogress/nprogress.css",
                "~/Content/v2/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css",
                "~/Content/v2/vendors/bootstrap-daterangepicker/daterangepicker.css",
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
                                     "~/Content/Scripts/feedback.js"
                                  ));
            /* bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/main.css"));
             bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/ormalize.min.css"));
             */

            //bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
            //            "~/Content/themes/base/jquery.ui.core.css",
            //            "~/Content/themes/base/jquery.ui.resizable.css",
            //            "~/Content/themes/base/jquery.ui.selectable.css",
            //            "~/Content/themes/base/jquery.ui.accordion.css",
            //            "~/Content/themes/base/jquery.ui.autocomplete.css",
            //            "~/Content/themes/base/jquery.ui.button.css",
            //            "~/Content/themes/base/jquery.ui.dialog.css",
            //            "~/Content/themes/base/jquery.ui.slider.css",
            //            "~/Content/themes/base/jquery.ui.tabs.css",
            //            "~/Content/themes/base/jquery.ui.datepicker.css",
            //            "~/Content/themes/base/jquery.ui.progressbar.css",
            //            "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}