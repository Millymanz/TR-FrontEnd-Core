namespace TradeRiser.Core.Common
{
    /// <summary>
    /// Specifies a policy to evaluate a value against a specified limit.
    /// The policy evaluates if the value exceeds the limit.
    /// </summary>
    public class ValueExceededLimitPolicy : LimitPolicyBase<int, int>
    {
		#region public methods 

        /// <summary>
        /// Evaluates the specified value against the policy limit.
        /// </summary>
        /// <param name="value">The value to evaluate against the policy limit.</param>
        /// <returns>
        /// True if the value exceeds the policy limit, otherwise false.  Always returns false if the policy is not enabled.
        /// </returns>
        public override bool Evaluate(int value)
        {
            if (this.Enabled)
            {
                return value > this.Limit;
            }
            else
            {
                return false;
            }
        }

		#endregion public methods 
    }
}
