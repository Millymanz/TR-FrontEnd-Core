namespace TradeRiser.Core.Common
{
    using System;
    [Serializable]
    public class PermissionException : Exception
    {
        #region constructors

        public PermissionException()
            : base()
        {
        }

        public PermissionException(string message)
            : base(message)
        {
        }

        public PermissionException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        #endregion constructors
    }
}
