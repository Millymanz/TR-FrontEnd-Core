﻿namespace TradeRiser.Core.Common
{
    using System.Linq;

    /// <summary>
    /// Specifies a policy to evaluate a string contains a minimum number of uppercase characters.
    /// The policy evaluates if the string does not have the minimum number of uppercase characters.
    /// </summary>
    public class UppercaseCharactersPolicy : LimitPolicyBase<string, int>
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
                int upperCount = 0;

                foreach (char c in value)
                {
                    if (char.IsUpper(c))
                    {
                        upperCount++;
                    }
                }

                return upperCount < this.Limit;
            }
            else
            {
                return false;
            }
        }

		#endregion public methods 
    }
}
