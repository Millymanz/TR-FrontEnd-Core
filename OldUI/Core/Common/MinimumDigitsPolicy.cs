
namespace TradeRiser.Core.Common
 {
    using System.Text.RegularExpressions;

    public class MinimumDigitsPolicy : LimitPolicyBase<string, int>
    {
        #region public methods

        public override bool Evaluate(string value)
        {
            if (this.Enabled)
            {
                Regex regex = new Regex("[0-9]");
                return regex.Matches(value).Count < this.Limit;
            }
            return false;
        }

        #endregion public methods
    }
}
