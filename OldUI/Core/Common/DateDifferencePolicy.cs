namespace TradeRiser.Core.Common
{

    using System;

    public class DateDifferencePolicy : LimitPolicyBase<DateTime, int>
    {
        #region public methods

        public override bool Evaluate(DateTime value)
        {
            if (this.Enabled)
            {
                return DateTime.Now.Subtract(value).TotalDays > this.Limit;
            }
            return false;
        }

        #endregion public methods
    }
}
