using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TradeRiser.UI
{
    public class JsonActionResult : ActionResult
    {
        #region private fields

        /// <summary>
        /// Result Bag.
        /// </summary>
        private readonly ResultBag resultBag = null;

        #endregion private fields

        #region constructors

        public JsonActionResult(ResultBag resultBag)
        {
            this.resultBag = resultBag;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="JsonActionResult"/> class.
        /// </summary>
        /// <param name="success">If set to <c>true</c>, the operation was successful.</param>
        /// <param name="data">The data.</param>
        public JsonActionResult(bool success, object data)
        {
            this.resultBag = new ResultBag(success, data);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="JsonActionResult"/> class.
        /// </summary>
        /// <param name="success">if set to <c>true</c> [success].</param>
        /// <param name="message">The message.</param>
        public JsonActionResult(bool success, string message)
        {
            Alert alert = new Alert(message, success ? AlertType.Success : AlertType.Error);
            this.resultBag = new ResultBag(alert, success);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="JsonActionResult"/> class.
        /// </summary>
        /// <param name="success">if set to <c>true</c> [success].</param>
        /// <param name="message">The message.</param>
        /// <param name="data">The data.</param>
        public JsonActionResult(bool success, string message, object data, bool delayedMessage = false)
        {
            Alert alert = new Alert(message, success ? AlertType.Success : AlertType.Error);
            alert.Delayed = delayedMessage;

            this.resultBag = new ResultBag(alert, success, data);
        }

        #endregion constructors

        #region public methods

        /// <summary>
        /// Enables processing of the result of an action method by a custom type that inherits from the <see cref="T:System.Web.Mvc.ActionResult"/> class.
        /// </summary>
        /// <param name="context">The context in which the result is executed. The context information includes the controller, HTTP content, request context, and route data.</param>
        public override void ExecuteResult(ControllerContext context)
        {
            HttpContextBase contextBase = context.HttpContext;
            contextBase.Response.Clear();
            contextBase.Response.ContentType = "text/json";
            contextBase.Response.Write(JsonConvert.SerializeObject(this.resultBag, Formatting.None, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }));
        }

        #endregion public methods
    }
}