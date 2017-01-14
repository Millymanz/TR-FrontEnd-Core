using System;
using System.Linq;
using System.Web.Mvc;
using TradeRiser.Models;
using TradeRiser.Core.Data;
using TradeRiser.Core.Mail;

namespace TradeRiser.UI.Controllers
{
    public class NewAppController : CpfController
    {
        //
        // GET: /NewApp/

        public ActionResult Index()
        {
            return View();
        }

    }
}
