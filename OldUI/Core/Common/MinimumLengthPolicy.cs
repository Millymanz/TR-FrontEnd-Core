namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Specifies a policy to evaluate a string meets a minimum length.
    /// The policy evaluates if the the string does not meet the required length.
    /// </summary>
    public class MinimumLengthPolicy : LimitPolicyBase<string, int>
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
                return value.Length < this.Limit;
            }
            else
            {
                return false;
            }
        }

		#endregion public methods 
    }
}
