using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TradeRiser.UI.Attributes;
using TradeRiser.UI.Controls;

namespace TradeRiser.UI.Controllers
{
    public class ControlsController : Controller
    {
   /////// <summary>
   ////         /// Dates the picker.
   ////         /// </summary>
   ////         /// <param name="model">The model.</param>
   ////         /// <param name="view">The view.</param>
   ////         /// <param name="options">The options.</param>
   ////         [Unprotected]
   ////         public ViewResult DatePicker(object model, string view, DatePicker options)
   ////         {
   ////             string viewName = string.Format("DatePicker" + view);
   ////             return this.View(string.Format("~/views/controls/{0}.cshtml", viewName), options);
   ////         }

   ////         public ViewResult DatePickerCalendar(object model, DatePicker options, DatePickerOptions configuration)
   ////         {
   ////             this.ViewBag.ControlID = options.ID;

   ////             return this.View("~/views/controls/DatePickerCalendar.cshtml", configuration);
   ////         }

   ////         public ActionResult GetDatePickerHtml(DatePicker options)
   ////         {
   ////             ResultBag resultBag = null;

   ////             try
   ////             {
   ////                 string datePickerHtml = this.RenderPartialToString("DatePicker", options);

   ////                 if (!string.IsNullOrEmpty(datePickerHtml))
   ////                 {
   ////                     resultBag = new ResultBag(true, datePickerHtml);
   ////                 }
   ////                 else
   ////                 {
   ////                     string message = "Error could not generate Date Picker";
   ////                     throw new Exception(message);
   ////                 }
   ////             }
   ////             catch (Exception e)
   ////             {
   ////                 Log.Exception(this.Director.User.UserID, "ControlsController.GetDatePickerHtml", "TradeRiser.Core.Controllers", e);
   ////                 resultBag = new ResultBag(new Alert(e.Message, AlertType.Error), false);
   ////             }

   ////             return new JsonActionResult(resultBag);
   ////         }

            /// <summary>
            /// Validations the tool tip.
            /// </summary>
            /// <returns>Validation Tool tip.</returns>
            public ViewResult ValidationToolTip()
            {
                return this.View("~/views/controls/ValidationToolTip.cshtml");
            }

            /// <summary>
            /// Translations the tool tip.
            /// </summary>
            /// <returns></returns>
            public ViewResult TranslationToolTip()
            {
                return this.View("~/views/controls/TranslationToolTip.cshtml");
            }

            /// <summary>
            /// Validations the help.
            /// </summary>
            /// <param name="validationHelp">The validation help.</param>
            /// <returns>
            /// Validation Help.
            /// </returns>
            public ViewResult ValidationHelp(ValidationHelp validationHelp)
            {
                return this.View("~/views/controls/ValidationHelp.cshtml", validationHelp);
            }

            ///// <summary>
            ///// Auto complete grid control view.
            ///// </summary>
            ///// <param name="model">The model.</param>
            ///// <returns>View for the AutoComplete control.</returns>
            //public ActionResult AutoCompleteGrid(AutoCompleteGrid model)
            //{
            //    return this.View("~/views/controls/AutoCompleteGrid.cshtml", model);
            //}

            //public ActionResult AutoCompleteData(AutoCompleteRequest request)
            //{
            //    RepoFile repoFile = this.Director.Repo.GetFile(request.VirtualFilePath);

            //    if (repoFile == null)
            //    {
            //        string message = string.Format("Could not find repository file at specified path {0}.", request.VirtualFilePath);
            //        ArgumentException ex = new ArgumentException(message);
            //        Log.Exception("ControlsController", "AutoCompleteData", ex);
            //    }

            //    string content = repoFile.GetContent<string>();

            //    if (string.IsNullOrEmpty(content))
            //    {
            //        string message = string.Format("Repository path {0} content is empty.", request.VirtualFilePath);
            //        ArgumentException ex = new ArgumentException(message);
            //        Log.Exception("ControlsController", "AutoCompleteData", ex);
            //        throw ex;
            //    }

            //    SearchServiceRequest searchRequest = ObjectSerializer.FileDeserializeObject<SearchServiceRequest>(content, "text/xml", null);
            //    ISearchAccess service = Dependency.Get<ISearchAccess>(this.Director);
            //    List<AutoCompleteGridItem> data = new AutoCompleteDataProvider(this.Director, service).ProcessRequest(searchRequest, request, repoFile);

            //    return this.Content(JsonConvert.SerializeObject(data));
            //}

            /// <summary>
            /// Helps the specified help.
            /// </summary>
            /// <param name="help">The help.</param>
            /// <returns></returns>
            public PartialViewResult Help(HelpControl help)
            {
                return this.PartialView("~/views/controls/Help.cshtml", help);
            }

            /////// <summary>
            /////// Autoes the complete help.
            /////// </summary>
            /////// <returns></returns>
            ////public ViewResult AutoCompleteHelp()
            ////{
            ////    return this.View("~/views/controls/AutoCompleteHelp.cshtml");
            ////}

            /////// <summary>
            /////// Translations control.
            /////// </summary>
            /////// <param name="translationControl">The translation control.</param>
            /////// <returns>Translation control.</returns>
            ////public ActionResult TranslationControl(TranslationControl translationControl)
            ////{
            ////    if (this.Director.Configuration.GetConfigItem<bool>("Translator.Enabled") == false)
            ////    {
            ////        return new EmptyResult();
            ////    }

            ////    if (translationControl.Languages == null || translationControl.Languages.Count == 0)
            ////    {
            ////        translationControl.SetLanguages(this.Languages);
            ////    }

            ////    return this.View("~/views/controls/TranslationControl.cshtml", translationControl);
            ////}

            /////// <summary>
            /////// Multis the select panel.
            /////// </summary>
            /////// <param name="multiSelectPanel">The multi select panel.</param>
            /////// <returns>Multi select panel.</returns>
            ////public ViewResult MultiSelectPanel(MultiSelectPanel multiSelectPanel)
            ////{
            ////    return this.View("~/views/controls/MultiSelectPanel.cshtml", multiSelectPanel);
            ////}

            /////// <summary>
            /////// Action to load a dynamic toolbar.
            /////// </summary>
            /////// <param name="toolbarModel">The toolbar model.</param>
            /////// <returns></returns>
            ////public ActionResult Toolbar(DynamicToolbarModel toolbarModel)
            ////{
            ////    if (toolbarModel == null)
            ////    {
            ////        return new EmptyResult();
            ////    }

            ////    DynamicToolbar toolbar = null;

            ////    toolbar = this.LoadToolbar(toolbarModel.VirtualFilePath, toolbarModel.TargetIdentifier);
            ////    this.ViewBag.PersistToolbar = toolbarModel.Persist;

            ////    return this.View("~/views/controls/toolbar.cshtml", toolbar);
            ////}

            /////// <summary>
            /////// Loads a toolbar from the repo based on a virtual file path.
            /////// </summary>
            /////// <param name="virtualFilePath">The virtual file path.</param>
            /////// <param name="identifier">The identifier.</param>
            /////// <returns></returns>
            ////private DynamicToolbar LoadToolbar(string virtualFilePath, RepoIdentifier identifier)
            ////{
            ////    try
            ////    {
            ////        RepoFile toolbar = null;

            ////        if (identifier != null)
            ////        {
            ////            toolbar = this.Director.Repo.GetFile(virtualFilePath, identifier.Version);
            ////        }
            ////        else
            ////        {
            ////            toolbar = this.Director.Repo.GetFile(virtualFilePath);
            ////        }

            ////        if (toolbar == null)
            ////        {
            ////            string message = string.Format("Could not find repository file at specified path {0}.", virtualFilePath);
            ////            ArgumentException ex = new ArgumentException(message);
            ////            Log.Exception("ControlsController", "LoadToolbar", ex);
            ////            throw ex;
            ////        }

            ////        string content = toolbar.GetContent<string>();

            ////        if (string.IsNullOrEmpty(content))
            ////        {
            ////            string message = string.Format("Repository path {0} content is empty.", virtualFilePath);
            ////            ArgumentException ex = new ArgumentException(message);
            ////            Log.Exception("ControlsController", "LoadToolbar", ex);
            ////            throw ex;
            ////        }

            ////        DynamicToolbar dToolBar = new DynamicToolbar(this.Director, content);

            ////        return dToolBar;
            ////    }
            ////    catch (Exception ex)
            ////    {
            ////        Log.Exception("CpfController", "LoadToolbar", ex, this.Director);
            ////        return null;
            ////    }
            ////}
        

    }
}
