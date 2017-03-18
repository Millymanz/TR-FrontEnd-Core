namespace TradeRiser.Core.Common
{
    public class ValueReachedLimitPolicy : LimitPolicyBase<int, int>
    {
        #region public methods

        public override bool Evaluate(int value)
        {
            if (this.Enabled)
            {
                return value >= this.Limit;
            }
            return false;
        }

        #endregion public methods
    }
}
