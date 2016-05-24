using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI
{
    public class ResultBag
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CpfAlert"/> class.
        /// </summary>
        public ResultBag()
        {

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResultBag"/> class.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <param name="success">if set to <c>true</c> [success].</param>
        public ResultBag(bool success, object data)
        {
            this.Data = data;
            this.Success = success;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CpfAlert"/> class.
        /// </summary>
        /// <param name="alert">The alert.</param>
        /// <param name="success">if set to <c>true</c> [success].</param>
        /// <param name="data">The data.</param>
        public ResultBag(Alert alert, bool success, object data = null)
        {
            this.Success = success;
            this.Data = data;
            if (alert != null)
            {
                this.Message = alert.Message;
                this.Blink = alert.Blink;
                this.Delayed = alert.Delayed;
                this.SetAlertType(alert.Type);
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="CpfAlert"/> class.
        /// </summary>
        /// <param name="alert">The alert.</param>
        /// <param name="success">if set to <c>true</c> [success].</param>
        /// <param name="errorLog">The error log.</param>
        /// <param name="unhandled">if set to <c>true</c> [unhandled].</param>
        /// <param name="data">The data.</param>
        public ResultBag(Alert alert, bool success, string errorLog, bool unhandled = false, object data = null)
        {
            this.Success = success;
            this.ErrorLog = errorLog;
            this.Unhandled = unhandled;
            this.Data = data;
            if (alert != null)
            {
                this.Message = alert.Message;
                this.Blink = alert.Blink;
                this.Delayed = alert.Delayed;
                this.SetAlertType(alert.Type);
            }
        }

        /// <summary>
        /// Sets the type of the alert.
        /// </summary>
        /// <param name="alertType">Type of the alert.</param>
        private void SetAlertType(AlertType alertType)
        {
            switch (alertType)
            {
                case UI.AlertType.Error:
                    this.AlertType = "e";
                    break;
                case UI.AlertType.Information:
                    this.AlertType = "i";
                    break;
                case UI.AlertType.Success:
                    this.AlertType = "s";
                    break;
                case UI.AlertType.Warning:
                    this.AlertType = "w";
                    break;
                default:
                    this.AlertType = "i";
                    break;
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="CpfAlert"/> is success.
        /// </summary>
        /// <value>
        ///   <c>True</c> if success; otherwise, <c>false</c>.
        /// </value>
        [JsonProperty("success")]
        public bool Success { get; set; }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        [JsonProperty("message")]
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the error log.
        /// </summary>
        /// <value>
        /// The error log.
        /// </value>
        [JsonProperty("errorLog")]
        public string ErrorLog { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is delayed.
        /// </summary>
        /// <value>
        /// 	<c>True</c> if this instance is delayed; otherwise, <c>false</c>.
        /// </value>
        [JsonProperty("delayed")]
        public bool Delayed { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is unhandled.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if this instance is unhandled; otherwise, <c>false</c>.
        /// </value>
        [JsonProperty("unhandled")]
        public bool Unhandled { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="CpfAlert"/> is blink.
        /// </summary>
        /// <value>
        ///   <c>true</c> if blink; otherwise, <c>false</c>.
        /// </value>
        [JsonProperty("blink")]
        public bool Blink { get; set; }

        /// <summary>
        /// Gets or sets the type of the alert.
        /// </summary>
        /// <value>
        /// The type of the alert.
        /// </value>
        [JsonProperty("alertType")]
        public string AlertType { get; set; }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        [JsonProperty("data")]
        public object Data { get; set; }

        /// <summary>
        /// Gets or sets the redirect URL.
        /// </summary>
        /// <value>
        /// The redirect URL.
        /// </value>
        [JsonProperty("redirectUrl")]
        public string RedirectUrl { get; set; }
    }
}