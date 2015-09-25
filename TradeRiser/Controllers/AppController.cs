using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using TradeRiser.Models;

using System.Data.SqlClient;
using System.Data;
using System.Runtime.Serialization;

namespace TradeRiser.Controllers
{
    [Authorize]
    public class AppController : Controller
    {
        //[HttpGet]
        //public ActionResult Index()
        //{
        //    var username = HttpContext.User.Identity.Name;

        //    CustomToken customToken = new CustomToken();
        //    customToken.Binarycrypt = username;

        //    return View(customToken);
        //}

        [HttpGet]
        public ActionResult Index()
        {
            var customTokenItem = Session["accesstoken"];
            var customToken = (CustomToken) customTokenItem;
            //customT.Username = customTokenItem["Username"];

            return View(customToken);
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
        public JsonResult GetChartData(string symbolID)
        {
            //QueryHandler queryHandler = new QueryHandler();
            //var data = queryHandler.GetChartData(symbolID);
            
            return null;

            //return Json(data);            
        }
    }
}
