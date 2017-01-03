namespace TradeRiser.UI.Controls
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.IO;
    using System.Text;
    using System.Web.Mvc;
    using System.Web.Mvc.Html;
    using System.Web.Routing;

    using System.Web.Mvc;
    using TradeRiser.Core.Director;
    public static class HtmlHelperExtensions
    {
        #region  Public Methods

        /// <summary>
        /// Validations the control.
        /// </summary>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="inputControl">The input control.</param>
        /// <param name="required">If set to <c>true</c> [required].</param>
        /// <returns>Validation attributes.</returns>
        public static MvcHtmlString ValidationControl(this HtmlHelper htmlHelper, string inputControl, bool required)
        {
            return htmlHelper.Action("ValidationHelp", "Controls", new
            {
                area = "cpf",
                model = new ValidationHelp { InputControl = inputControl, Required = required }
            });
        }

        /// <summary>
        /// Validations the attributes.
        /// </summary>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="attributes">The attributes.</param>
        /// <returns>Validation attributes.</returns>
        public static MvcHtmlString ValidationAttributes(this HtmlHelper htmlHelper, ValidationAttributes attributes)
        {
            return MvcHtmlString.Create(attributes.ToString());
        }

        /////// <summary>
        /////// Begins the form group.
        /////// </summary>
        /////// <param name="htmlHelper">The HTML helper.</param>
        /////// <param name="title">The title.</param>
        ////public static CpfFormGroup BeginFormGroup(this HtmlHelper htmlHelper, string title)
        ////{
        ////    string rawUrl = htmlHelper.ViewContext.HttpContext.Request.RawUrl;
        ////    return htmlHelper.FormGroupHelper(title, new RouteValueDictionary());
        ////}

        /////// <summary>
        /////// Begins the form group.
        /////// </summary>
        /////// <param name="htmlHelper">The HTML helper.</param>
        /////// <param name="id">The id.</param>
        /////// <param name="title">The title.</param>
        ////public static CpfFormGroup BeginFormGroup(this HtmlHelper htmlHelper, string id, string title)
        ////{
        ////    string rawUrl = htmlHelper.ViewContext.HttpContext.Request.RawUrl;
        ////    return htmlHelper.FormGroupHelper(title, new RouteValueDictionary(new { Id = id }));
        ////}

        /////// <summary>
        /////// Begins the form group.
        /////// </summary>
        /////// <param name="htmlHelper">The HTML helper.</param>
        /////// <param name="title">The title.</param>
        /////// <param name="htmlAttributes">The HTML attributes.</param>
        ////public static CpfFormGroup BeginFormGroup(this HtmlHelper htmlHelper, string title, object htmlAttributes)
        ////{
        ////    string rawUrl = htmlHelper.ViewContext.HttpContext.Request.RawUrl;
        ////    RouteValueDictionary attributes = new RouteValueDictionary(htmlAttributes);
        ////    return htmlHelper.FormGroupHelper(title, attributes);
        ////}

        /////// <summary>
        /////// Begins the form group.
        /////// </summary>
        /////// <param name="htmlHelper">The HTML helper.</param>
        /////// <param name="id">The id.</param>
        /////// <param name="title">The title.</param>
        /////// <param name="htmlAttributes">The HTML attributes.</param>
        ////public static CpfFormGroup BeginFormGroup(this HtmlHelper htmlHelper, string id, string title, object htmlAttributes)
        ////{
        ////    string rawUrl = htmlHelper.ViewContext.HttpContext.Request.RawUrl;
        ////    RouteValueDictionary attributes = new RouteValueDictionary(htmlAttributes);
        ////    attributes.Add("Id", id);
        ////    return htmlHelper.FormGroupHelper(title, attributes);
        ////}

        /// <summary>
        /// Renders the specified HTML helper.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="htmlHelper">The HTML helper.</param>
        public static T Render<T>(this HtmlHelper htmlHelper) where T : ICpfControl, new()
        {
            T t = new T();
            t.Initialise(htmlHelper, null);
            return t;
        }

        /// <summary>
        /// Renders the specified HTML helper.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="htmlHelper">The HTML helper.</param>
        /// <param name="htmlAttributes">The HTML attributes.</param>
        public static T Render<T>(this HtmlHelper htmlHelper, object htmlAttributes) where T : ICpfControl, new()
        {
            T t = new T();
            t.Initialise(htmlHelper, htmlAttributes);
            return t;
        }

        public static string CpfContent(this UrlHelper urlHelper, string scriptPath, IDirector director)
        {
            // ~/scripts/corejs.ui.js
            string actualPath = urlHelper.Content(scriptPath);
            if (director == null)
            {
                return actualPath;
            }

            string versionData = string.Format("___v{0}_{1}", director.BuildVersion.Replace(".", string.Empty), director.CultureCode);
            string extension = Path.GetExtension(actualPath);

            return actualPath.Replace(extension, string.Format("{0}{1}", versionData, extension));
        }

        #endregion

        #region  Private Methods

        /////// <summary>
        /////// Forms the group helper.
        /////// </summary>
        /////// <param name="htmlHelper">The HTML helper.</param>
        /////// <param name="title">The title.</param>
        /////// <param name="htmlAttributes">The HTML attributes.</param>
        ////private static CpfFormGroup FormGroupHelper(this HtmlHelper htmlHelper, string title, IDictionary<string, object> htmlAttributes)
        ////{
        ////    StringBuilder html = new StringBuilder();

        ////    TagBuilder builder = new TagBuilder("fieldset");
        ////    builder.MergeAttributes(htmlAttributes);
        ////    builder.AddCssClass("cpf-formgroup");
        ////    html.AppendLine(builder.ToString(TagRenderMode.StartTag));

        ////    TagBuilder span = new TagBuilder("span");
        ////    span.SetInnerText("4");

        ////    string innerText = span.ToString(TagRenderMode.Normal) + title;
        ////    TagBuilder legend = new TagBuilder("legend");
        ////    legend.InnerHtml = innerText;

        ////    TagBuilder legendContainer = new TagBuilder("div");
        ////    legendContainer.AddCssClass("legend-container");
        ////    legendContainer.InnerHtml = legend.ToString(TagRenderMode.Normal);
        ////    html.AppendLine(legendContainer.ToString(TagRenderMode.Normal));

        ////    TagBuilder body = new TagBuilder("div");
        ////    body.AddCssClass("formgroupbody");
        ////    html.AppendLine(body.ToString(TagRenderMode.StartTag));

        ////    htmlHelper.ViewContext.Writer.Write(html.ToString());
        ////    CpfFormGroup form = new CpfFormGroup(htmlHelper.ViewContext);

        ////    return form;
        ////}

        #endregion
    }
}