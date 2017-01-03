namespace TradeRiser.UI.Models
{

    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using TradeRiser.Core.Membership;
    /// <summary>
    /// User Model.
    /// </summary>
    [ModelBinder(typeof(UserModelBinder))]
    public class UserModel
    {
        /// <summary>
        /// Gets or sets the first name.
        /// </summary>
        /// <value>The first name.</value>
        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the last name.
        /// </summary>
        /// <value>The last name.</value>
        [JsonProperty("lastName")]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the email address.
        /// </summary>
        /// <value>The email address.</value>
        [JsonProperty("emailAddress")]
        public string EmailAddress { get; set; }

        /// <summary>
        /// Gets or sets the password.
        /// </summary>
        /// <value>The password.</value>
        [JsonProperty("password")]
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the confirm password.
        /// </summary>
        /// <value>The confirm password.</value>
        [JsonProperty("confirmPassword")]
        public string ConfirmPassword { get; set; }

        /// <summary>
        /// Gets or sets the phone1.
        /// </summary>
        /// <value>The phone1.</value>
        [JsonProperty("phone1")]
        public string Phone1 { get; set; }

        /// <summary>
        /// Gets or sets the phone2.
        /// </summary>
        /// <value>The phone2.</value>
        [JsonProperty("phone2")]
        public string Phone2 { get; set; }

        /// <summary>
        /// Gets or sets the time zone.
        /// </summary>
        /// <value>The time zone.</value>
        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

        /// <summary>
        /// Gets or sets the language.
        /// </summary>
        /// <value>
        /// The language.
        /// </value>
        [JsonProperty("language")]
        public string Language { get; set; }

        /// <summary>
        /// Gets or sets the language list.
        /// </summary>
        /// <value>
        /// The language list.
        /// </value>
        [JsonProperty("languageList")]
        public Dictionary<string, string> LanguageList { get; set; }

        public List<User> Users { get; set; }
        ///// <summary>
        ///// Gets or sets the apps.
        ///// </summary>
        ///// <value>
        ///// The apps.
        ///// </value>
        //[JsonProperty("apps")]
        //public List<Apps> Apps { get; set; }

        ///// <summary>
        ///// Gets or sets the existing values.
        ///// </summary>
        ///// <value>
        ///// The existing values.
        ///// </value>
        //[JsonProperty("existingvalues")]
        //public Preferences ExistingValues { get; set; }

        ///// <summary>
        ///// Gets or sets the users theme preferences.
        ///// </summary>
        ///// <value>
        ///// The users theme preferences.
        ///// </value>
        //[JsonProperty("themePreferences")]
        //public ThemePreferences ThemePreferences { get; set; }


        /////// <summary>
        /////// Initializes a new instance of the <see cref="UserModel"/> class.
        /////// </summary>
        ////public UserModel()
        ////{
        ////    this.ExistingValues = new Preferences();
        ////}

        /// <summary>
        /// Parses the specified json.
        /// </summary>
        /// <param name="json">The json.</param>
        public static UserModel Parse(string json)
        {
            return JsonConvert.DeserializeObject<UserModel>(json);
        }

    }
}