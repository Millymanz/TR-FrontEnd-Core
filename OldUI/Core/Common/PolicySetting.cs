namespace TradeRiser.Core.Common
{
    using System;

    [Serializable]
    public class PolicySetting<T>
    {
        #region properties

        public bool Enabled { get; set; }

        public string Name { get; set; }

        public T Value { get; set; }

        #endregion properties
    }
}