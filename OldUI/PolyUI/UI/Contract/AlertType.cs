using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TradeRiser.Core.Director;

namespace TradeRiser.UI
{

    /// <summary>
    /// Available alert types for the CpfAlertMessage.
    /// </summary>
    public enum AlertType
    {
        /// <summary>
        /// Presents a success message to the user. E.g. "User added successfully" or "Operation complete".
        /// </summary>
        Success,

        /// <summary>
        /// Represents a general informative message to the user. E.g. "You have no saved messages".
        /// </summary>
        Information,

        /// <summary>
        /// Represents a warning or prompt to the user. E.g. "Please select a user first" or "Password not strng enough".
        /// </summary>
        Warning,

        /// <summary>
        /// Represents an error or exception in application use or logic. E.g. "Cannot connect to service" or "Unknown response from server".
        /// </summary>
        Error
    }

    /// <summary>
    /// Holds details of a CPF alert for transporting.
    /// </summary>
    [Serializable]
    public class Alert
    {
        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="Alert"/> class.
        /// </summary>
        public Alert()
        {
            this.Type = AlertType.Information;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Alert"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        public Alert(string message)
        {
            this.Message = message;
            this.Type = AlertType.Information;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Alert"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="alertType">Type of the alert.</param>
        public Alert(string message, AlertType alertType)
        {
            this.Message = message;
            this.Type = alertType;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Alert"/> class.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="alertType">Type of the alert.</param>
        /// <param name="blink">If set to <c>true</c> the alert will blink.</param>
        public Alert(string message, AlertType alertType, bool blink)
        {
            this.Message = message;
            this.Type = alertType;
            this.Blink = blink;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets the type of the alert.
        /// </summary>
        /// <value>The type of the alert.</value>
        [JsonProperty("alertType")]
        public AlertType Type
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="Alert"/> should blink.
        /// </summary>
        /// <value><c>True</c> to blink; otherwise, <c>false</c>.</value>
        [JsonProperty("blink")]
        public bool Blink
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>The message.</value>
        [JsonProperty("message")]
        public string Message
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is delayed.
        /// </summary>
        /// <value>
        /// 	<c>True</c> if this instance is delayed; otherwise, <c>false</c>.
        /// </value>
        [JsonProperty("delayed")]
        public bool Delayed { get; set; }

        #endregion properties

        #region public methods

        /// <summary>
        /// Return a javascript function call string for client execution.
        /// </summary>
        /// <returns>A javascript string for client execution.</returns>
        public IHtmlString ToJavascriptFuncationCall()
        {
            return MvcHtmlString.Create(string.Format("corejs.alert(\"{0}\", \"{1}\", {2});", this.Message, this.Type.ToString().ToLower(), this.Blink.ToString().ToLower()));
        }

        /// <summary>
        /// Determines whether the specified <see cref="T:System.Object"/> is equal to the current <see cref="T:System.Object"/>.
        /// </summary>
        /// <param name="obj">The <see cref="T:System.Object"/> to compare with the current <see cref="T:System.Object"/>.</param>
        /// <returns>
        /// True if the specified <see cref="T:System.Object"/> is equal to the current <see cref="T:System.Object"/>; otherwise, false.
        /// </returns>
        /// <exception cref="T:System.NullReferenceException">The <paramref name="obj"/> parameter is null.</exception>
        public override bool Equals(object obj)
        {
            Alert compare = obj as Alert;
            if (compare == null)
            {
                return false;
            }

            return compare.Type == this.Type && (string.Compare(compare.Message, this.Message, StringComparison.CurrentCulture) == 0);
        }

        /// <summary>
        /// Serves as a hash function for a particular type.
        /// </summary>
        /// <returns>
        /// A hash code for the current <see cref="T:System.Object"/>.
        /// </returns>
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        #endregion public methods
    }

    [Serializable]
    public class DelayedAlert : Alert
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DelayedAlert"/> class.
        /// </summary>
        /// <param name="alert">The alert.</param>
        public DelayedAlert(Alert alert)
        {
            this.Blink = alert.Blink;
            this.Message = alert.Message;
            this.Type = alert.Type;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="DelayedAlert"/> class.
        /// </summary>
        public DelayedAlert()
        {
        }

        /// <summary>
        /// Gets or sets the user ID this alert is for.
        /// </summary>
        /// <value>The user ID this alert is for.</value>
        public Guid UserID
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the UTC time this alert was generated.
        /// </summary>
        /// <value>The UTC time this alert was generated.</value>
        public DateTime UtcTime
        {
            get;
            set;
        }

        /// <summary>
        /// Gets a base 64 encoded representation of the alert. Pass this on the querystring or post with key alert to show on another page.
        /// </summary>
        /// <param name="alert">The alert.</param>
        /// <param name="director">The director.</param>
        public static string EncodeAlert(Alert alert, IDirector director)
        {
            DelayedAlert delayed = new DelayedAlert(alert);
            delayed.UserID = director.User.UserID;
            delayed.UtcTime = DateTime.UtcNow;

            byte[] bytes = System.Text.Encoding.Unicode.GetBytes(JsonConvert.SerializeObject(delayed));
            string returnValue = System.Convert.ToBase64String(bytes);

            return returnValue;
        }

        /// <summary>
        /// Decodes the base 64 delayed alert string.
        /// </summary>
        /// <param name="encodedAlert">The encoded alert.</param>
        /// <param name="director">The director.</param>
        public static Alert DecodeDelayedAlert(string encodedAlert, IDirector director)
        {
            try
            {
                byte[] bytes = System.Convert.FromBase64String(encodedAlert);
                string json = System.Text.Encoding.Unicode.GetString(bytes);
                DelayedAlert delayed = JsonConvert.DeserializeObject<DelayedAlert>(json);
                if (delayed != null)
                {
                    // check this alert is still valid
                    if (delayed.UserID == director.User.UserID && delayed.UtcTime.AddMinutes(3) >= DateTime.UtcNow)
                    {
                        return (Alert)delayed;
                    }
                }
            }
            catch
            {
                return null;
            }

            return null;
        }
    }
}