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
        [HttpGet]
        public ActionResult Index()
        {
            var username = HttpContext.User.Identity.Name;

            CustomToken customToken = new CustomToken();
            customToken.Binarycrypt = username;

            return View(customToken);
        }

        [HttpPost]
        public JsonResult GetAllCompletedPatternDefaults()
        {
            PresentationRenderer presentRender = null;

            QueryHandler queryHandler = new QueryHandler();

            var answerTransferPackage = queryHandler.GetAllCompletedPatternDefaults();

            if (answerTransferPackage == null) return Json("");

            presentRender = new PresentationRenderer(answerTransferPackage);

            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult GetAllEmergingPatternDefaults()
        {
            PresentationRenderer presentRender = null;

            QueryHandler queryHandler = new QueryHandler();

            var answerTransferPackage = queryHandler.GetAllEmergingPatternDefaults();

            if (answerTransferPackage == null) return Json("");

            presentRender = new PresentationRenderer(answerTransferPackage);

            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult GetAllCompletedPatternDefaultsTest()
        {
            PresentationRenderer presentRender = null;
            presentRender = new PresentationRenderer();
            presentRender.InitializeContinousResultsDummyData();

            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult GetAllEmergingPatternDefaultsTest()
        {
            PresentationRenderer presentRender = null;
            presentRender = new PresentationRenderer();
            presentRender.InitializeContinousResultsDummyData();

            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult GetUserProfile()
        {
            String username = HttpContext.User.Identity.Name;

            PresentationRenderer presentRender = null;
            presentRender = new PresentationRenderer();

            DataModel dataModel = new DataModel();
            presentRender.UserProfileConfig = dataModel.GetUserProfile(username);
            //presentRender.GenerateDummyUserProfile();

            return Json(presentRender);
        }

        [HttpPost]
        public void UnfollowQuery(String query)
        {
            String username = HttpContext.User.Identity.Name;

            DataModel dataModel = new DataModel();
            dataModel.UnsubscribeQuery(username, query);
        }

        [HttpPost]
        public void FollowQuery(String query)
        {
            String username = HttpContext.User.Identity.Name;

            DataModel dataModel = new DataModel();
            dataModel.SubscribeToQuery(username, query);
        }
       
        [HttpPost]
        public JsonResult GetAnswer(String searchQuery)
        {
            DataModel dataModel = new DataModel();
            bool answered = false;

            String username = HttpContext.User.Identity.Name;


            PresentationRenderer presentRender = null;

            if (String.IsNullOrEmpty(searchQuery) == false)
            {
                QueryHandler queryHandler = new QueryHandler();

                var answerTransferPackage = queryHandler.SubmitQuery(username, searchQuery);

                if (answerTransferPackage == null)
                {
                    dataModel.LogQuery(username, searchQuery, answered);
                    return Json("");
                }
                else
                {
                    presentRender = new PresentationRenderer(answerTransferPackage);
                    
                    answered = true;
                    dataModel.LogQuery(username, searchQuery, answered);                   
                }
                ////Pass 
            }
            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult GetAnswerTest(String searchQuery)
        {
            PresentationRenderer presentRender = null;
            presentRender = new PresentationRenderer();
            presentRender.InitializeResultDummyData();

            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult Compute(String searchQuery)
        {
            PresentationRenderer presentRender = null;

            //if (String.IsNullOrEmpty(searchQuery) == false)
            //{
            //    QueryHandler queryHandler = new QueryHandler();

            //    //Find a way to get user login and pass it in
            //    //                var sessiontTransact = queryHandler.Submit("cityIndex", searchQuery);
            //    QueryService.SessionTransact sessiontTransact = queryHandler.Submit("cityIndex", searchQuery);

            //    if (sessiontTransact == null) return Json("");

            //    presentRender = new PresentationRenderer(sessiontTransact);
            //    //Pass 
            //}
            return Json(presentRender);
        }

        [HttpPost]
        public JsonResult GetDataResult(String selectionID)
        {
            var arrayIDs = selectionID.Split('*');

            String queryId = arrayIDs.FirstOrDefault();
            String selectingSymbol = arrayIDs.LastOrDefault();

            QueryHandler queryHandler = new QueryHandler();
            var data = queryHandler.GetDataResult(queryId, selectingSymbol);

            if (data == null) return Json("");

            var presentRender = new PresentationRenderer(data);

            return Json(presentRender);            
        }

        [HttpPost]
        public JsonResult GetChartData(string symbolID)
        {
            QueryHandler queryHandler = new QueryHandler();
            var data = queryHandler.GetChartData(symbolID);

            return Json(data);            
        }

        [HttpGet]
        public ActionResult QueryText()
        {
            Random rnd = new Random();
            String ext = ".json";
            String strCurrentN = System.Configuration.ConfigurationManager.AppSettings["QueryHelperName"];

            String strCurrentP = System.Configuration.ConfigurationManager.AppSettings["QueryHelperPath"];
            String nameOnly = strCurrentN + rnd.Next() + ext;

            //String NewFileName = System.IO.Directory.GetCurrentDirectory() + "\\" +  nameOnly;
            String temp = Server.MapPath(".").Remove(Server.MapPath(".").LastIndexOf('\\'));
            String NewFileName = temp + "\\" + nameOnly;
            String OldFileName = strCurrentP +  strCurrentN + ext;
            System.IO.File.Copy(OldFileName, NewFileName);

            return Json(new { file = nameOnly }, JsonRequestBehavior.AllowGet);

            //string text ="";
            //using (System.IO.TextReader reader = System.IO.File.OpenText(current + "\\datum1Extended.json"))
            ////using (System.IO.TextReader st = new System.IO.TextReader("datum1Extended.json"))
            //{
            //    text = reader.ReadToEnd();
            //}

            //return Content(text);

            //return Json(new { foo = "bar", baz = "Blech" }, JsonRequestBehavior.AllowGet);
            /*return Content("MyExt.json");*/
        }
    }
}
