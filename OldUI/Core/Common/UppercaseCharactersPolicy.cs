namespace TradeRiser.Core.Common
{
    public class UppercaseCharactersPolicy : LimitPolicyBase<string, int>
    {
        #region public methods

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
            return false;
        }

        #endregion public methods
    }
}
