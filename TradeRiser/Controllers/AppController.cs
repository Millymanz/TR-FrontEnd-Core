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
        public ActionResult Index(string parameter)
        {
            String username = HttpContext.User.Identity.Name;

            CustomToken customToken = new CustomToken();
            customToken.Binarycrypt = username;

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
        public string GetUserProfile()
        {
            String username = HttpContext.User.Identity.Name;

            var restClient = new RestClient();
            return restClient.GetUserProfile(username);   
        }

        [HttpPost]
        public void UnfollowQuery(String query)
        {
            String username = HttpContext.User.Identity.Name;
            var restClient = new RestClient();
            restClient.UnfollowQuery(username, query);            
        }

        [HttpPost]
        public void FollowQuery(String query)
        {
            String username = HttpContext.User.Identity.Name;

            var restClient = new RestClient();
            restClient.FollowQuery(username, query);            
        }
       
        [HttpPost]
        public string GetAnswer(String searchQuery)
        {
            var restClient = new RestClient();
            String username = HttpContext.User.Identity.Name;

            var response = restClient.GetAnswer(searchQuery, username);
            return response;
        }

        [HttpPost]
        public JsonResult GetDataResult(String selectionID)
        {
            //var arrayIDs = selectionID.Split('*');

            //String queryId = arrayIDs.FirstOrDefault();
            //String selectingSymbol = arrayIDs.LastOrDefault();

            //QueryHandler queryHandler = new QueryHandler();
            //var data = queryHandler.GetDataResult(queryId, selectingSymbol);

            //if (data == null) return Json("");

            //var presentRender = new PresentationRenderer(data);

            return null;
            //return Json(presentRender);            
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
