
namespace TradeRiser.Core.Common
{
    public class LowercaseCharactersPolicy : LimitPolicyBase<string, int>
    {
        #region public methods

        public override bool Evaluate(string value)
        {
            if (this.Enabled)
            {
                int lowerCount = 0;

                foreach (char c in value)
                {
                    if (char.IsLower(c))
                    {
                        lowerCount++;
                    }
                }

                return lowerCount < this.Limit;
            }
            return false;
        }

        #endregion public methods
    }
}
