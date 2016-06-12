using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.UI.Models
{
    public class PasswordModel
    {
        /// <summary>
        /// Gets or sets the old password.
        /// </summary>
        /// <value>The old password.</value>
        [JsonProperty("oldPassword")]
        public string OldPassword { get; set; }

        /// <summary>
        /// Gets or sets the new password.
        /// </summary>
        /// <value>The new password.</value>
        [JsonProperty("newPassword")]
        public string NewPassword { get; set; }

        /// <summary>
        /// Gets or sets the confirm password.
        /// </summary>
        /// <value>The confirm password.</value>
        [JsonProperty("confirmPassword")]
        public string ConfirmPassword { get; set; }

        /// <summary>
        /// Parses the specified json.
        /// </summary>
        /// <param name="json">The json.</param>
        public static PasswordModel Parse(string json)
        {
            return JsonConvert.DeserializeObject<PasswordModel>(json);
        }
    }
}