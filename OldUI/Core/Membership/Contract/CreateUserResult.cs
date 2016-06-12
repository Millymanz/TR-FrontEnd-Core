using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{
    public class CreateUserResult
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateUserResult"/> class.
        /// </summary>
        public CreateUserResult()
        {
            this.Messages = new List<string>();
        }

        /// <summary>
        /// Gets or sets a value indicating whether the user was created.
        /// </summary>
        /// <value><c>True</c> if [user created]; otherwise, <c>false</c>.</value>
        public bool UserCreated { get; set; }

        /// <summary>
        /// Gets or sets the messages.
        /// </summary>
        /// <value>The messages.</value>
        public List<string> Messages { get; set; }

        /// <summary>
        /// Gets or sets the user ID.
        /// </summary>
        /// <value>The user ID.</value>
        public Guid UserID { get; set; }
    }
}
