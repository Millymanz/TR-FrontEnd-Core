using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Membership;

namespace TradeRiser.Core.Membership
{

    /// <summary>
    /// A password generator using the membership policy
    /// </summary>
    public class PasswordGenerator //: IPasswordGenerator
    {
        /// <summary>
        /// The membership policy
        /// </summary>
        private MembershipPolicy policy;

        /// <summary>
        /// Initializes a new instance of the <see cref="PasswordGenerator"/> class.
        /// </summary>
        /// <param name="policy">The policy.</param>
        public PasswordGenerator(MembershipPolicy policy)
        {
            if (policy == null)
            {
                throw new ArgumentNullException("policy");
            }

            this.policy = policy;
        }

        /// <summary>
        /// Generates a new password.
        /// </summary>
        public string GeneratePassword()
        {
            string password = CpfHash.GeneratePassword(
               this.policy.PasswordLength.Limit,
               this.policy.PasswordMinDigits.Limit,
               this.policy.PasswordUpperCharacters.Limit,
               this.policy.PasswordLowerCharacters.Limit);

            return password;
        }
    }
}
