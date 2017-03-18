
namespace TradeRiser.Core.Common
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "Valid type.")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "C", Justification = "Valid type.")]
    public abstract class LimitPolicyBase<T, C> : PolicyBase<T>
    {
        #region properties

        public C Limit { get; set; }

        #endregion properties
    }
}
