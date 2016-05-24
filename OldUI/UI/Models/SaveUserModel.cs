using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Http.ModelBinding;
using TradeRiser.Core.Membership;

namespace TradeRiser.UI.Models
{
    [ModelBinder(typeof(SaveUserModelBinder))]
    public class SaveUserModel : User
    {

        #region Fields



        #endregion Fields

        /// <summary>
        /// Brand Id.
        /// </summary>
        public const string DefaultBrandID = "a4395ac6-8a59-48eb-8a8d-2e41b783d850";

        /// <summary>
        /// Gets or sets a value indicating whether this instance is new user.
        /// </summary>
        /// <value>
        /// 	<c>True</c> if this instance is new user; otherwise, <c>false</c>.
        /// </value>
        public bool IsNewUser { get; set; }






        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="SaveUserModel"/> class.
        /// </summary>
        /// <param name="user">The user.</param>
        public SaveUserModel(User user)
        {
            this.BrandID = Guid.Parse(DefaultBrandID);
            this.CreatedDate = user.CreatedDate;
            this.DelegateUserID = user.DelegateUserID;
            this.Disabled = user.Disabled;
            this.Email = user.Email;
            this.EmployeeID = user.EmployeeID;
            this.FirstName = user.FirstName;
            this.HasPhoto = user.HasPhoto;
            this.InvalidLogOnAttempts = user.InvalidLogOnAttempts;
            this.LanguageCode = user.LanguageCode;
            this.LastLockDate = user.LastLockDate;
            this.LastLogOnDate = user.LastLogOnDate;
            this.LastName = user.LastName;
            this.LastPasswordReset = user.LastPasswordReset;
            this.Locked = user.Locked;
            this.ChangePassword = user.ChangePassword;
            this.OutOfOffice = user.OutOfOffice;
            this.Password = user.Password;
            this.Phone1 = user.Phone1;
            this.Phone2 = user.Phone2;
            this.TimeZone = user.TimeZone;
            this.UserID = user.UserID;
            this.UserName = user.UserName;
            this.PhysicalRepoRoot = user.PhysicalRepoRoot;
            this.PrimaryLocationID = user.PrimaryLocationID;
            this.Country = user.Country;
            this.Broker = user.Broker;
            this.Countries = this.GetCountries();
        }


        /// <summary>
        /// Initializes a new instance of the <see cref="SaveUserModel"/> class.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="languages">The languages.</param>
        public SaveUserModel(User user, Dictionary<string, string> languages)
        {
            if (user != null)
            {
                this.BrandID = Guid.Parse(DefaultBrandID);
                this.CreatedDate = user.CreatedDate;
                this.DelegateUserID = user.DelegateUserID;
                this.Disabled = user.Disabled;
                this.Email = user.Email;
                this.EmployeeID = user.EmployeeID;
                this.FirstName = user.FirstName;
                this.HasPhoto = user.HasPhoto;
                this.InvalidLogOnAttempts = user.InvalidLogOnAttempts;
                this.LanguageCode = user.LanguageCode;
                this.LastLockDate = user.LastLockDate;
                this.LastLogOnDate = user.LastLogOnDate;
                this.LastName = user.LastName;
                this.LastPasswordReset = user.LastPasswordReset;
                this.Locked = user.Locked;
                this.ChangePassword = user.ChangePassword;
                this.OutOfOffice = user.OutOfOffice;
                this.Password = user.Password;
                this.Phone1 = user.Phone1;
                this.Phone2 = user.Phone2;
                this.TimeZone = user.TimeZone;
                this.UserID = user.UserID;
                this.UserName = user.UserName;
                this.PhysicalRepoRoot = user.PhysicalRepoRoot;
                this.PrimaryLocationID = user.PrimaryLocationID;
                this.Country = user.Country;
                this.Broker = user.Broker;
                //this.UserGroups = user.UserGroups;
                //this.UserLocationGroups = user.UserLocationGroups;
            }
            else
            {
                //this.UserGroups = new List<Group>();
                //this.UserLocationGroups = new List<MembershipLocationGroup>();
            }

            Guid userId = Guid.Empty;
            if (this.UserID != null)
            {
                userId = this.UserID;
            }
            this.Countries = this.GetCountries();
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="SaveUserModel"/> class.
        /// </summary>
        public SaveUserModel()
        {
            this.Countries = this.GetCountries();

        }

        #endregion Constructors

        #region Methods

        /// <summary>
        /// Gets the user.
        /// </summary>
        /// <param name="defaultUser">The default user.</param>
        /// <returns>
        /// User object.
        /// </returns>
        public User GetUser(User defaultUser)
        {
            User user = new User()
            {
                BrandID = Guid.Parse(SaveUserModel.DefaultBrandID),
                CreatedDate = this.IsNewUser ? this.CreatedDate : defaultUser.CreatedDate,
                DelegateUserID = this.IsNewUser ? this.DelegateUserID : defaultUser.DelegateUserID,
                Disabled = this.Disabled,
                Email = this.Email,
                EmployeeID = this.EmployeeID,
                EscalationUserID = this.IsNewUser ? this.EscalationUserID : defaultUser.EscalationUserID,
                FirstName = this.FirstName,
                HasPhoto = this.HasPhoto,
                InvalidLogOnAttempts = this.IsNewUser ? this.InvalidLogOnAttempts : defaultUser.InvalidLogOnAttempts,
                LanguageCode = this.LanguageCode,
                LastLockDate = this.IsNewUser ? this.LastLockDate : defaultUser.LastLockDate,
                LastLogOnDate = this.IsNewUser ? this.LastLogOnDate : defaultUser.LastLogOnDate,
                LastName = this.LastName,
                LastPasswordReset = this.IsNewUser ? this.LastPasswordReset : defaultUser.LastPasswordReset,
                Locked = this.Locked,
                ChangePassword = this.IsNewUser ? true : defaultUser.ChangePassword,
                OutOfOffice = this.IsNewUser ? this.OutOfOffice : defaultUser.OutOfOffice,
                Password = this.IsNewUser ? this.Password : defaultUser.Password,
                Phone1 = this.Phone1,
                Phone2 = this.Phone2,
                SendAlertsAsEmail = this.IsNewUser ? this.SendAlertsAsEmail : defaultUser.SendAlertsAsEmail,
                TimeZone = this.IsNewUser ? "UTC" : defaultUser.TimeZone,
                UserID = this.UserID,
                UserName = this.UserName,
                Country = this.Country,
                Broker = this.Broker
        
            };

            return user;
        }

        public Dictionary<string, string> Countries { get; set; }

        private Dictionary<string, string> GetCountries()
        {
            Dictionary<string, string> countries = new Dictionary<string, string>();
            foreach (CultureInfo ci in CultureInfo.GetCultures(CultureTypes.SpecificCultures))
            {
                var ri = new RegionInfo(ci.Name);
                countries.Add(ci.Name, ri.DisplayName);
            }

            return countries.OrderBy(n => n.Value).ToDictionary(t => t.Key, t => t.Value);
        }

        #endregion Methods




    }
}