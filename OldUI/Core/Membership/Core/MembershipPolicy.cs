using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TradeRiser.Core.Common;

namespace TradeRiser.Core.Membership
{
    /// <summary>
    /// Membership Policy.
    /// </summary>
    public class MembershipPolicy : PolicySet
    {

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="MembershipPolicy"/> class.
        /// </summary>
        /// <param name="policyLoader">The policySet loader.</param>
        public MembershipPolicy(IPolicyLoader policyLoader)
            : base(policyLoader)
        {
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets the account locked timout representing the number of minutes after a lockout that the user can log back on.
        /// </summary>
        /// <value>The account lockout timeout in minutes.  Zero represents an infinite timeout.</value>
        public ValueReachedLimitPolicy AccountLockedTimeout { get; set; }

        /// <summary>
        /// Gets or sets the number of days after which accounts that have not been accessed are disabled.
        /// </summary>
        /// <value>The number of days after which inactive accounts are to be disabled.</value>
        public ValueReachedLimitPolicy InactiveDisableDays { get; set; }

        /// <summary>
        /// Gets or sets the account lockout policySet.
        /// </summary>
        /// <value>The account lockout policySet.</value>
        public ValueReachedLimitPolicy LockAccount { get; set; }

        /// <summary>
        /// Gets or sets the password expiry policySet.
        /// </summary>
        /// <value>The password expiry policySet.</value>
        public DateDifferencePolicy PasswordExpiry { get; set; }

        /// <summary>
        /// Gets or sets the password history policySet.
        /// </summary>
        /// <value>The number of previous password to check.</value>
        public ValueReachedLimitPolicy PasswordHistory { get; set; }

        /// <summary>
        /// Gets or sets the minimum length of the password.
        /// </summary>
        /// <value>The minimum length of the password.</value>
        public MinimumLengthPolicy PasswordLength { get; set; }

        /// <summary>
        /// Gets or sets the minimum number of lowercase characters required in a password.
        /// </summary>
        /// <value>The minimum number of lowercase characters required in a password.</value>
        public LowercaseCharactersPolicy PasswordLowerCharacters { get; set; }

        /// <summary>
        /// Gets or sets the minimum number of digits required in a password.
        /// </summary>
        /// <value>The minimum number of digits required in a password.</value>
        public MinimumDigitsPolicy PasswordMinDigits { get; set; }

        /// <summary>
        /// Gets or sets the minimum number of uppercase characters required in a password.
        /// </summary>
        /// <value>The minimum number of uppercase characters required in a password.</value>
        public UppercaseCharactersPolicy PasswordUpperCharacters { get; set; }

        #endregion properties

        #region public methods

        /// <summary>
        /// Builds the password creation policy message.
        /// </summary>
        /// <returns>A string containing the password policy applied when creating password.</returns>
        public string BuildPasswordCreationPolicyMessage()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(TradeRiserCoreResource.PolicyIntro);
            sb.AppendLine(Resx.Format(TradeRiserCoreResource.PolicyMinLength, this.PasswordLength.Limit));

            if (this.PasswordMinDigits.Limit > 0)
            {
                sb.AppendLine(Resx.Format(TradeRiserCoreResource.PolicyMinDigits, this.PasswordMinDigits.Limit));
            }

            if (this.PasswordUpperCharacters.Limit > 0)
            {
                sb.AppendLine(Resx.Format(TradeRiserCoreResource.PolicyUpperChars, this.PasswordUpperCharacters.Limit));
            }

            if (this.PasswordLowerCharacters.Limit > 0)
            {
                sb.AppendLine(Resx.Format(TradeRiserCoreResource.PolicyLowerChars, this.PasswordLowerCharacters.Limit));
            }

            return sb.ToString();
        }

        /// <summary>
        /// Initialises this instance.
        /// </summary>
        public override void Initialise()
        {
            this.LockAccount = new ValueReachedLimitPolicy();
            this.PasswordExpiry = new DateDifferencePolicy();
            this.PasswordLength = new MinimumLengthPolicy();
            this.PasswordMinDigits = new MinimumDigitsPolicy();
            this.PasswordHistory = new ValueReachedLimitPolicy();
            this.PasswordUpperCharacters = new UppercaseCharactersPolicy();
            this.PasswordLowerCharacters = new LowercaseCharactersPolicy();
            this.AccountLockedTimeout = new ValueReachedLimitPolicy();
            this.InactiveDisableDays = new ValueReachedLimitPolicy();
        }

        #endregion public methods
    }
}
