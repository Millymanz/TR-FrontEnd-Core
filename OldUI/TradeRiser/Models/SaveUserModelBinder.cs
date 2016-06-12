using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace TradeRiser.UI.Models
{
    /// <summary>
    /// User group model binder.
    /// </summary>
    public class SaveUserModelBinder : CpfModelBinder
    {
        /// <summary>
        /// Binds the model to a value by using the specified controller context and binding context.
        /// </summary>
        /// <param name="controllerContext">The controller context.</param>
        /// <param name="bindingContext">The binding context.</param>
        /// <returns>The bound value.</returns>
        public override object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            base.BindModel(controllerContext, bindingContext);

            string rawJson = this.Director.Request.Payload;
            JObject jobject = null;

            if (!string.IsNullOrEmpty(rawJson))
            {
                jobject = JObject.Parse(rawJson);
            }

            string userId = this.Get<string>("userId", string.Empty);
            string userName = this.Get<string>("username", string.Empty);
            string firstName = this.Get<string>("firstName", string.Empty);
            string lastName = this.Get<string>("lastName", string.Empty);
            string email = this.Get<string>("email", string.Empty);
            string phone1 = this.Get<string>("phone1", string.Empty);
            string phone2 = this.Get<string>("phone2", string.Empty);
            string languageCode = this.Get<string>("language", string.Empty);
            string timeZone = this.Get<string>("timeZone", string.Empty);
            bool locked = this.Get<bool>("locked", false);
            bool disabled = this.Get<bool>("disabled", false);
            string employeeId = this.Get<string>("employeeId", string.Empty);
            string primaryLocationId = this.Get<string>("primaryLocationId", string.Empty);
            string country = this.Get<string>("country", string.Empty);
            string broker = this.Get<string>("broker", string.Empty);
            SaveUserModel model = new SaveUserModel()
            {
                UserName = userName,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Phone1 = phone1,
                Phone2 = phone2,
                LanguageCode = languageCode,
                TimeZone = timeZone,
                Locked = locked,
                Disabled = disabled,
                EmployeeID = employeeId,
                PrimaryLocationID = primaryLocationId,
                Country = country,
                Broker = broker
            };

            if (!string.IsNullOrEmpty(userId))
            {
                Guid uid;
                if (Guid.TryParse(userId, out uid))
                {
                    model.UserID = uid;
                }
            }
            else
            {
                model.UserID = Guid.NewGuid();
                model.IsNewUser = true;
                model.ChangePassword = true;
            }

            ////add user location and groups to model
            //if (jobject != null)
            //{
            //    model.UserGroups = this.GetUserGroups(jobject);
            //    model.UserLocationGroups = this.GetUserLocationGroups(jobject);
            //    model.UserPreferecencesData = this.GetUserPreferecencesData(jobject);
            //}

            return model;
        }

  
          }
}