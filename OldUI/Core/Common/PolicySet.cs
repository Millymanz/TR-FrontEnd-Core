namespace TradeRiser.Core.Common
{
    public abstract class PolicySet
    {
        #region constructors

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors", Justification = "Required for implementation.")]
        protected PolicySet(IPolicyLoader policyLoader)
        {
            this.Initialise();
            policyLoader.LoadPolicy(this);
        }

        #endregion constructors

        #region public methods

        public abstract void Initialise();

        #endregion public methods
    }
}
