namespace TradeRiser.Core.Common
{
    using System;

    /// <summary>
    /// Specifies a policy to evaluate the difference in time from the current date and time.
    /// The policy evaluates if the difference between the dates exceeds the specified difference.
    /// </summary>
    public class DateDifferencePolicy : LimitPolicyBase<DateTime, int>
    {
		#region public methods 

        /// <summary>
        /// Evaluates the specified value against the policy.
        /// </summary>
        /// <param name="value">The value to evaluate against the policy.</param>
        /// <returns>
        /// True if the value evaluates against the policy, otherwise false.  Always returns false if the policy is not enabled.
        /// </returns>
        public override bool Evaluate(DateTime value)
        {
            if (this.Enabled)
            {
                return DateTime.Now.Subtract(value).TotalDays > this.Limit;
            }
            else
            {
                return false;
            }
        }

		#endregion public methods 
    }
}
