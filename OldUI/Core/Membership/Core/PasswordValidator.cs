using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Membership
{
    /// <summary>
    /// Provides password validation functions against the configured policySet.
    /// </summary>
    public class PasswordValidator
    {
        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="PasswordValidator"/> class.
        /// </summary>
        /// <param name="membershipPolicy">The membership policySet.</param>
        public PasswordValidator(MembershipPolicy membershipPolicy)
        {
            this.MembershipPolicy = membershipPolicy;
        }

        #endregion constructors

        #region private properties

        private MembershipPolicy MembershipPolicy { get; set; }

        #endregion private properties

        #region public methods

        /// <summary>
        /// Validates the password against the configured policySet.
        /// </summary>
        /// <param name="password">The password to validate.</param>
        /// <param name="result">The result of the validation is assigned to this output parameter.</param>
        /// <returns>True if the password validates, otherwise false.</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1021:AvoidOutParameters", MessageId = "1#", Justification = "Output parameter required.")]
        public bool ValidatePassword(string password, out PasswordActionResult result)
        {
            if (String.IsNullOrEmpty(password))
            {
                result = PasswordActionResult.FailedNullOrEmptyPolicy;
                return false;
            }

            if (this.MembershipPolicy.PasswordLength.Evaluate(password))
            {
                result = PasswordActionResult.FailedMinimumLengthPolicy;
                return false;
            }

            if (this.MembershipPolicy.PasswordLowerCharacters.Evaluate(password))
            {
                result = PasswordActionResult.FailedLowercaseCharacterPolicy;
                return false;
            }

            if (this.MembershipPolicy.PasswordUpperCharacters.Evaluate(password))
            {
                result = PasswordActionResult.FailedUppercaseCharacterPolicy;
                return false;
            }

            if (this.MembershipPolicy.PasswordMinDigits.Evaluate(password))
            {
                result = PasswordActionResult.FailedMinimumDigitPolicy;
                return false;
            }

            result = PasswordActionResult.Ok;
            return true;
        }

        #endregion public methods
    }
}
