
namespace TradeRiser.Core.Common
 {
    public class MinimumLengthPolicy : LimitPolicyBase<string, int>
    {
        #region public methods

        public override bool Evaluate(string value)
        {
            if (this.Enabled)
            {
                return value.Length < this.Limit;
            }
            return false;
        }

        #endregion public methods
    }
}
