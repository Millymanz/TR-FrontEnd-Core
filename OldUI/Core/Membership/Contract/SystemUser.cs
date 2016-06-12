using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{
    /// <summary>
    /// The system wide admin user.
    /// </summary>
    [Serializable]
    public class SystemUser : User
    {
        public static readonly Guid Id = new Guid("C33E8F4A-A54A-48CB-86AD-21301DE89CF8");

        /// <summary>
        /// Gets or sets the user id.
        /// </summary>
        /// <value>The user id.</value>
        public override Guid UserID
        {
            get
            {
                return Id;
            }
            set
            {
                // do nothing
            }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="SystemUser"/> class.
        /// </summary>
        public SystemUser()
        {
            this.TimeZone = System.TimeZone.CurrentTimeZone.StandardName;
        }
    }
}
