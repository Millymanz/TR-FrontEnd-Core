using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Data;

namespace TradeRiser.Core.Membership
{
    [Serializable]
    public class User : IEquatable<User>, IDataBound
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets the maximum workspace storage in MBs
        /// </summary>
        public short MaximumWorkspaceStorage { get; set; }

        /// <summary>
        /// Gets or sets the type of the user.
        /// </summary>
        /// <value>
        /// The type of the user.
        /// </value>
        public string UserType { get; set; }

        /// <summary>
        /// Gets or sets the brand ID.
        /// </summary>
        /// <value>The brand ID.</value>
        public Guid BrandID { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether [change password].
        /// </summary>
        /// <value>
        ///   <c>True</c> if [change password]; otherwise, <c>false</c>.
        /// </value>
        public bool ChangePassword { get; set; }

        /// <summary>
        /// Gets or sets the created date.
        /// </summary>
        /// <value>The created date.</value>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the delegate user ID for use when this user is out of the office.
        /// </summary>
        /// <value>The delegate user ID.</value>
        public Guid DelegateUserID
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="User"/> account is disabled.
        /// </summary>
        /// <value><c>True</c> if account is disabled; otherwise, <c>false</c>.</value>
        public bool Disabled { get; set; }

        /// <summary>
        /// Gets or sets the email.
        /// </summary>
        /// <value>The email.</value>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the employee ID.
        /// </summary>
        /// <value>
        /// The employee ID.
        /// </value>
        public string EmployeeID { get; set; }

        /// <summary>
        /// Gets or sets the escalation user ID.
        /// </summary>
        /// <value>
        /// The escalation user ID.
        /// </value>
        public Guid EscalationUserID
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the users first name.
        /// </summary>
        /// <value>The users first name.</value>
        //[StringLength(100)]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the user has a photo set.
        /// </summary>
        /// <value><c>True</c> if the user has a photo available; otherwise, <c>false</c>.</value>
        public bool HasPhoto { get; set; }

        /// <summary>
        /// Gets or sets the number invalid logon attempts made by the user.
        /// </summary>
        /// <value>The number of invalid logon attempts.</value>
        public short InvalidLogOnAttempts { get; set; }

        /// <summary>
        /// Gets or sets the language code.
        /// </summary>
        /// <value>The language code.</value>
        public string LanguageCode { get; set; }

        /// <summary>
        /// Gets or sets the last lock date.
        /// </summary>
        /// <value>The last lock date.</value>
        public DateTime? LastLockDate { get; set; }

        /// <summary>
        /// Gets or sets the last log on date.
        /// </summary>
        /// <value>The last log on date.</value>
        public DateTime LastLogOnDate { get; set; }

        /// <summary>
        /// Gets or sets the users last name.
        /// </summary>
        /// <value>The users last name.</value>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the date and time of the last password reset.
        /// </summary>
        /// <value>The date and time of the last password reset.</value>
        public DateTime LastPasswordReset { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this user has locked their account by abuse E.g. wrong password too many times.
        /// </summary>
        /// <value><c>True</c> if locked; otherwise, <c>false</c>.</value>
        public bool Locked { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the user has the out of office setting on.
        /// </summary>
        /// <value><c>True</c> if out of office is on; otherwise, <c>false</c>.</value>
        public bool OutOfOffice
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the users password.
        /// </summary>
        /// <value>The password.</value>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the primary contact number.
        /// </summary>
        /// <value>The primary contact number.</value>
        public string Phone1 { get; set; }


        public string Country { get; set; }


        public string Broker { get; set; }
        /// <summary>
        /// Gets or sets the second contact number.
        /// </summary>
        /// <value>The second contact number.</value>
        public string Phone2 { get; set; }

        /// <summary>
        /// Gets or sets the primary location ID. May be null.
        /// </summary>
        /// <value>The primary location ID.</value>
        public string PrimaryLocationID
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets a value indicating whether [send alerts as email].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [send alerts as email]; otherwise, <c>false</c>.
        /// </value>
        public bool SendAlertsAsEmail
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the time zone for the user.
        /// </summary>
        /// <value>The users time zone.</value>
        public string TimeZone { get; set; }

        /// <summary>
        /// Gets the display name of the user.
        /// </summary>
        /// <value>The display name of the user.</value>
        public string UserDisplayName
        {
            get
            {
                return string.Format("{0} {1}", this.FirstName, this.LastName);
            }
        }

        /// <summary>
        /// Gets or sets the user id.
        /// </summary>
        /// <value>The user id.</value>
        public virtual Guid UserID { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>The name of the user.</value>
        public string UserName { get; set; }

        /// <summary>
        /// Gets or sets the users physical repo root.
        /// </summary>
        /// <value>
        /// The users physical repo root.
        /// </value>
        public string PhysicalRepoRoot { get; set; }

        /// <summary>
        /// Gets or sets the users physical workspace root.
        /// </summary>
        /// <value>
        /// The users physical workspace root.
        /// </value>
        public string PhysicalWorkspaceRoot { get; set; }

        /// <summary>
        /// Gets or sets the user preferences.
        /// </summary>
        /// <value>
        /// The user preferences.
        /// </value>
        public string UserPreferences { get; set; }

        /// <summary>
        /// Gets or sets the last updated.
        /// </summary>
        /// <value>
        /// The last updated.
        /// </value>
        public DateTime LastUpdated { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="User"/> is deleted.
        /// </summary>
        /// <value>
        ///   <c>True</c> if deleted; otherwise, <c>false</c>.
        /// </value>
        public bool Deleted { get; set; }

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="User"/> class.
        /// </summary>
        public User()
        {
            this.SendAlertsAsEmail = false;
            this.EscalationUserID = Guid.Empty;
            this.DelegateUserID = Guid.Empty;
            this.UserType = "Normal";
            this.UserPreferences = null;
            this.LastUpdated = DateTime.MinValue;
            this.PrimaryLocationID = null;
            this.MaximumWorkspaceStorage = -1; // Default to Configuration Item based value.

        }

        #endregion

        #region IEquatable<User> Members

        /// <summary>
        /// Indicates whether the current object is equal to another object of the same type.
        /// </summary>
        /// <param name="other">An object to compare with this object.</param>
        /// <returns>
        /// True if the current object is equal to the <paramref name="other"/> parameter; otherwise, false.
        /// </returns>
        public bool Equals(User other)
        {
            if (other == null)
            {
                return false;
            }

            DateTime? lastLockDate = this.LastLockDate;
            bool equals =
                lastLockDate != null && (other.LastLockDate != null && (this.Email == other.Email &&
                    this.UserID == other.UserID &&
                    this.UserName == other.UserName &&
                    this.FirstName == other.FirstName &&
                    this.LastName == other.LastName &&
                    this.Phone1 == other.Phone1 &&
                    this.Phone2 == other.Phone2 &&
                    this.HasPhoto == other.HasPhoto &&
                    this.LanguageCode == other.LanguageCode &&
                    this.Locked == other.Locked &&
                    this.Disabled == other.Disabled &&
                    this.Password == other.Password &&
                    this.ChangePassword == other.ChangePassword &&
                    this.InvalidLogOnAttempts == other.InvalidLogOnAttempts &&
                    this.TimeZone == other.TimeZone &&
                    this.LastPasswordReset.Subtract(other.LastPasswordReset).Seconds == 0 &&
                    this.CreatedDate.Subtract(other.CreatedDate).Seconds == 0 &&
                    this.LastLogOnDate.Subtract(other.LastLogOnDate).Seconds == 0 &&
                    this.Country == other.Country &&
                    this.Broker == other.Broker &&
                    ((lastLockDate.Value.Subtract((DateTime)other.LastLockDate).Seconds == 0))));


            return @equals;
        }

        #endregion

        #region IDataBound Members

        /// <summary>
        /// Hydrate this type from the given IReader.
        /// </summary>
        /// <param name="reader">The reader.</param>
        public void Load(IReader reader)
        {
            this.UserID = reader.Get<Guid>(0);
            this.UserName = reader.Get<string>(1);
            this.Email = reader.Get<string>(2);
            this.FirstName = reader.Get<string>(3);
            this.LastName = reader.Get<string>(4);
            this.Phone1 = reader.Get<string>(5);
            this.Phone2 = reader.Get<string>(6);
            this.LanguageCode = reader.Get<string>(7);
            this.TimeZone = reader.Get<string>(8);
            this.Locked = reader.Get<bool>(9);
            this.Disabled = reader.Get<bool>(10);
            this.ChangePassword = reader.Get<bool>(11);
            this.Password = reader.Get<string>(12);
            this.LastPasswordReset = reader.Get<DateTime>(13);
            this.CreatedDate = reader.Get<DateTime>(14);
            this.LastLogOnDate = reader.Get<DateTime>(15);
            this.LastLockDate = reader.Get<DateTime>(16);
            this.InvalidLogOnAttempts = reader.Get<short>(17);
            this.HasPhoto = !reader.IsNull(18);
            this.BrandID = reader.Get<Guid>(19);
            this.Deleted = reader.Get<bool>("Deleted");
            //this.PhysicalRepoRoot = reader.Get("RepoRoot", string.Empty);
            //this.PhysicalWorkspaceRoot = reader.Get("WorkspaceRoot", string.Empty);
            this.EmployeeID = reader.Get("EmployeeID", string.Empty);
            this.OutOfOffice = reader.Get("OutOfOfficeFlg", false);
            this.DelegateUserID = reader.Get("DelegateUserID", Guid.Empty);
            this.UserPreferences = reader.Get<string>("UserPreferences");
            this.SendAlertsAsEmail = reader.Get("SendAlertsAsEmail", false);
            this.EscalationUserID = reader.Get("EscalationUserID", Guid.Empty);
            this.PrimaryLocationID = reader.Get<string>("PrimaryLocationID", null);
            this.Country = reader.Get<string>("Country", null);
            this.Broker = reader.Get<string>("Broker", null);
        }

        /// <summary>
        /// Gets the vault data key - used by theVault to load the class
        /// </summary>
        /// <value>
        /// The vault data key.
        /// </value>
        public object VaultDataKey
        {
            get
            {
                return this.UserID;
            }
        }

        #endregion

        #region  Public Methods

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
            User user = obj as User;

            return user != null && this.Equals(user);
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


        #endregion
    }
}
