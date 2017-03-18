namespace TradeRiser.Core.Common
{
    public class ValidationError
    {
        #region constructors

        public ValidationError(string key, object attemptedValue, string errorMessage)
        {
            this.Key = key;
            this.AttemptedValue = attemptedValue;
            this.ErrorMessage = errorMessage;
        }

        #endregion constructors

        #region properties

        public object AttemptedValue { get; set; }

        public string ErrorMessage { get; set; }

        public string Key { get; set; }

        #endregion properties
    }
}
