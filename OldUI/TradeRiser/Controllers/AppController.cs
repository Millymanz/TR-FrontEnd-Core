using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using TradeRiser.Models;

using System.Data.SqlClient;
using System.Data;
using System.Runtime.Serialization;

namespace TradeRiser.UI.Controllers
{
    public class AppController : CpfController
    {
        [OutputCache(NoStore = true, Duration = 0)]
        public ActionResult Index()
        {
            var ct = new CustomToken();
            ct.Username = User.Identity.Name;
            ct.Password = "rrgrgrgfefe";
            ct.AccessToken = "rfroihgorgorjgorngrg$";

            return View();
        }

        [OutputCache(NoStore = true, Duration = 0)]
        public ActionResult LogOff()
        {
            return View();
        }

        //[OutputCache(NoStore = true, Duration = 0)]
        //public ActionResult Index(CustomToken model)
        //{
        //    var customTokenItem = Session["accesstoken"];

        //    if (customTokenItem != null)
        //    {
        //        var customToken = (CustomToken)customTokenItem;

        //        if (customToken != null)
        //        {
        //            return View(customToken);
        //        }
        //    }
        //    return RedirectToAction("Index", "AppInfo");
        //}

        [HttpPost]
        public string GetInfo()
        {
            return TradeUtility.GetInfo();
        }

        [HttpPost]
        public string GetInstrumentCoverage()
        {
            return TradeUtility.GetInstrumentCoverage();
        }

        [HttpPost]
        public string GetLegalInfo()
        {
            return TradeUtility.GetLegalInfo();
        }

        [HttpPost]
        public string GetAllCompletedPatternDefaults()
        {
            var restClient = new RestClient();
            var response = restClient.GetAllCompletedPatternDefaults();
            return response;
        }

        [HttpPost]
        public string GetAllEmergingPatternDefaults()
        {
            var restClient = new RestClient();
            var response = restClient.GetAllEmergingPatternDefaults();
            return response;
        }

        [HttpPost]
        public string GetUserProfile(string accessToken)
        {
            String username = HttpContext.User.Identity.Name;

            var restClient = new RestClient();
            return restClient.GetUserProfile(username, accessToken);
        }

        [HttpPost]
        public void UnfollowQuery(String query, string accessToken)
        {
            String username = HttpContext.User.Identity.Name;
            var restClient = new RestClient();
            restClient.UnfollowQuery(username, query, accessToken);
        }

        [HttpPost]
        public void FollowQuery(String query, string accessToken)
        {
            String username = HttpContext.User.Identity.Name;

            var restClient = new RestClient();
            restClient.FollowQuery(username, query, accessToken);
        }


        [HttpPost]
        public string GetAnswer(String searchQuery, string accessToken)
        {
            var restClient = new RestClient();
            String username = HttpContext.User.Identity.Name;

            var response = restClient.GetAnswer(searchQuery, username, accessToken);
            return response;
        }

        [HttpPost]
        public void UnsaveQuery(String query, string accessToken)
        {
            String username = HttpContext.User.Identity.Name;
            var restClient = new RestClient();
            restClient.UnsaveQuery(username, query, accessToken);
        }

        [HttpPost]
        public void SaveQuery(String query, string accessToken)
        {
            String username = HttpContext.User.Identity.Name;

            var restClient = new RestClient();
            restClient.SaveQuery(username, query, accessToken);
        }

        [HttpPost]
        public string GetSymbolData(string symbolID, string timeFrame, string accessToken)
        {
            var restClient = new RestClient();
            String username = HttpContext.User.Identity.Name;

            var response = restClient.GetSymbolData(symbolID, timeFrame, accessToken);
            return response;
        }

        [HttpPost]
        public string GetDataResult(string selectionID, string accessToken)
        {
            var arrayIDs = selectionID.Split('*');
            String queryId = arrayIDs.LastOrDefault();
            String selectingSymbol = arrayIDs.FirstOrDefault();

            var restClient = new RestClient();
            String username = HttpContext.User.Identity.Name;

            var response = restClient.GetDataResult(queryId, selectingSymbol, accessToken);
            return response;
        }

        [HttpPost]
        public string GetQuestions(string userTxt)
        {
          //  string data = "[ { fullname: 'foo' },{ fullname: 'bar' },"
          //+"{ fullname: 'twbs' },"
          //+"{ fullname: 'eurusd' },"
          //+"{ fullname: 'eursek' },"
          //+"{ fullname: 'eurjpy' },"
          //+"{ fullname: 'eurnok' },"
          //+"{ fullname: 'eurnzd' },"
          //+"{ fullname: 'eurpln' },"
          //+"{ fullname: 'eurpln bullish price changes' },"
          //+"{ fullname: 'correlation' },"
          //+"{ fullname: 'audcad' },"
          //+"{ fullname: 'daily' }]";


            General gen = new General();
            gen.fullname = "foo";


           // string data = "[ { fullname: 'foo' },{ fullname: 'bar' }]";
            string data = "[[fullname: 'foo'],[fullname: 'bar']]";


            return data;

            //var arrayIDs = selectionID.Split('*');
            //String queryId = arrayIDs.LastOrDefault();
            //String selectingSymbol = arrayIDs.FirstOrDefault();

            //var restClient = new RestClient();
            //String username = HttpContext.User.Identity.Name;

            //var response = restClient.GetDataResult(queryId, selectingSymbol, accessToken);
            //return response;
        }

        [HttpPost]
        public JsonResult GetChartData(string symbolID)
        {
            //QueryHandler queryHandler = new QueryHandler();
            //var data = queryHandler.GetChartData(symbolID);

            return null;

            //return Json(data);            
        }
    }
}
