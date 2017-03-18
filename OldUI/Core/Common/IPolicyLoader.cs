
namespace TradeRiser.Core.Common
{
    public interface IPolicyLoader
    {
        #region properties

        string ConnectionDetails { get; set; }

        #endregion properties

        #region methods

        void LoadPolicy(PolicySet policySet);

        #endregion methods
    } 
}
 