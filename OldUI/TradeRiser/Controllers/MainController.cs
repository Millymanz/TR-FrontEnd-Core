using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Util;
using TradeRiser.Core.Data;
using TradeRiser.Core.Logging;
using TradeRiser.Core.Membership;
using TradeRiser.Core.SignOn;
using TradeRiser.UI.Attributes;
using TradeRiser.UI.Models;
using TradeRiser.UI.Security;

namespace TradeRiser.UI.Controllers
{
  //  [RouteArea("cpf")]
    //[Route("core/{action}")]
    public class MainController: CpfController
    {
        /// <summary>
        /// Default action returns the portal.
        /// </summary>
        /// <returns>View result.</returns>
        public ActionResult Index()
        {
            return this.View("Index");
        }

    }
}
