using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

using System.Threading;
using TradeRiser.Models;
using PokeIn.Comet;
using PokeIn;
using PokeIn.Comet;

namespace TradeRiser
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            //Ignore PokeIn AdvancedHandler route
            RouteTable.Routes.IgnoreRoute("{*allpokein}", new { allpokein = @".*\.pokein(/.*)?" });



            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            //temp
            StartQueryServicePolling();

            TradeRiser.Logger.Setup();
            TradeUtility.Setup();

        }

        static MvcApplication()
        {
            //our random price generator
            new Thread(delegate()
            {
                Random rndPrices = new Random();
                while (true)
                {
                    //Need filter to determine which data to send to which client
                    //*DOA - Get user creditenial session

                    if (HttpContext.Current != null)
                    {
                        var sessionIDs = HttpContext.Current.Session.SessionID;

                        int hhdff = 2;
                    }
                    
                    //string message = JSON.Method("UpdatePrices", "Stock1", rndPrices.Next(0, 99));

                    if (Poller.answerQueue.Count() > 0)
                    {
                        var answerPackage = Poller.answerQueue.Dequeue();

                        foreach (var res in answerPackage.ProcessedResults.ComputedResults)
                        {
                          //  int key = Convert.ToInt32(answerPackage.ProcessedResults.KeyFieldIndex.FirstOrDefault().FirstOrDefault());
                            // res[key]

                            string message = JSON.Method("UpdatePrices", "<div class='blob transition'><div class='blobhead'><p class='date'>" + res[5] + " - " + res[6] + "</p><div class='blobuser'><span class='imgbox'><img src='pix/user-avatar.png' width='35' height='35' alt=''></span><p>" + res[10] + "</p></div></div><div class='blobcontent'><p> " + res[5] + " consectetur adipiscing elit. Etiam gravida, urna a elementum gravida, lorem quam vestibulum purus, eu fermentum erat risus egestas mauris.</p></div></div>", rndPrices.Next(0, 99));


                            //string message = JSON.Method("UpdatePrices", "<div class='blob transition'><div class='blobhead'><p class='date'>"+ res[5] + " - "+ res[6] + "</p><div class='blobuser'><span class='imgbox'><img src='pix/user-avatar.png' width='35' height='35' alt=''></span><p>" + res[10] + "</p></div></div><div class='blobcontent'><p> "+ res[5] + " consectetur adipiscing elit. Etiam gravida, urna a elementum gravida, lorem quam vestibulum purus, eu fermentum erat risus egestas mauris.</p></div></div>", rndPrices.Next(0, 99));
                            CometWorker.Groups.Send("Stock1", message);

                            //CometWorker.Groups.
                        }
                    }
                    Thread.Sleep(1000);
                    //Generate a new random stock price every 1 second and send it to the channel
                    //Deploy this test application onto IIS to get better results. for example, try for 0.2 second
                }
            }).Start();

            CometWorker.OnClientConnected += new DefineClassObjects(CometWorker_OnClientConnected);

            CometWorker.OnClientCreated += new ClientCreatedDelegate(CometWorker_OnClientCreated);

        }

        static void CometWorker_OnClientConnected(ConnectionDetails details, ref Dictionary<string, object> classList)
        {
            //There is a new connection attempt from the browser side and
            //PokeIn wants you to define a class for this connection request
            classList.Add("StockDemo", new MyStockDemo(details.ClientId));
            //Please notice that the connection has not completed in this step yet.
            //If you need the exact moment of "client connection completed" then you should be listening OnClientCreated event
        }

        static void CometWorker_OnClientCreated(string clientId)
        {
            //Client connection is done
            string message = JSON.Method("UpdateString", "Now, you are connected!");
            CometWorker.SendToClient(clientId, message);
        }

        private void StartQueryServicePolling()
        {
            //Disable for now to prevent IIS issues
            ThreadStart pollerThreadStart = new ThreadStart(Poller.InitialiseClient);
            Thread pollerThread = new Thread(pollerThreadStart);

            pollerThread.Start();
        }

        void Session_Start(object sender, EventArgs e)
        {


        }

        void Session_End(object sender, EventArgs e)
        {
            int hj = 2;
        }

    }

    //public class MyStockDemo : IDisposable
    //{
    //    string _clientId;
    //    public MyStockDemo(string clientId)
    //    {
    //        _clientId = clientId;
    //    }

    //    public void Dispose()
    //    {
    //        //PokeIn will call this method after client is disconnected
    //    }

    //    //it is not important how many client is listening for this channel. Let PokeIn manage the messages
    //    //please notice that the FREE edition of PokeIn supports up to 10 concurrent connection
    //    //Get Commercial edition to break the limits
    //    public void JoinChannel()
    //    {

    //        CometWorker.Groups.PinClientID(_clientId, "Stock1");
    //        CometWorker.SendToClient(_clientId, "Pinned();");
    //    }

    //    public void LeaveChannel()
    //    {
    //        CometWorker.Groups.UnpinClient(_clientId, "Stock1");
    //        CometWorker.SendToClient(_clientId, "Unpinned();");
    //    }
    //}

}