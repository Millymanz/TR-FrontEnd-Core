namespace TradeRiser.Core.Common
{
    using System.Text.RegularExpressions;

    /// <summary>
    /// Specifies a policy to evaluate a string contains a limited number of digits.
    /// The policy evaluates if the the string does not have the minimum number of embedded digits.
    /// </summary>
    public class MinimumDigitsPolicy : LimitPolicyBase<string, int>
    {
        #region public methods

        /// <summary>
        /// Evaluates the specified value against the policy.
        /// </summary>
        /// <param name="value">The value to evaluate against the policy.</param>
        /// <returns>
        /// True if the value evaluates against the policy, otherwise false.  Always returns false if the policy is not enabled.
        /// </returns>
        public override bool Evaluate(string value)
        {
            if (this.Enabled)
            {
                Regex regex = new Regex("[0-9]");
                return regex.Matches(value).Count < this.Limit;
            }
            else
            {
                return false;
            }
        }

        #endregion public methods
    }
}
