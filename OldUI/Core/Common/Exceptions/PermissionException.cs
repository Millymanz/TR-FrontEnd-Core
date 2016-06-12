using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Common
{

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
