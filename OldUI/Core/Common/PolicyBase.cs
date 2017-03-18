
namespace TradeRiser.Core.Common
{ 
    public abstract class PolicyBase<T>
    {
        #region constructors

        protected PolicyBase()
        {
            this.Enabled = true;
        }

        #endregion constructors

        #region properties

        public bool Enabled { get; set; }

        #endregion properties

        #region public methods

        public abstract bool Evaluate(T value);

        #endregion public methods
    }
}
