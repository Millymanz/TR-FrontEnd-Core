using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Net.Sockets;
using System.Net;
using System.Text;

namespace TradeRiser.Models
{
    public class QueryHandler
    {
        public QueryService.SessionTransact Submit(String userQuerySession, String query)
        {
            BroadcastorCallback cb = new BroadcastorCallback();
            cb.SetHandler(Poller.HandleBroadcast);

            System.ServiceModel.InstanceContext context =
                new System.ServiceModel.InstanceContext(cb);


            //QueryServiceServiceClient fg = new QueryServiceServiceClient();
            using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
            {
                QueryService.SessionTransact res = queryServiceProxy.Submit(userQuerySession, query);
                return res;
            }
        }

        public QueryService.AnswerPackage GetAllCompletedPatternDefaults()
        {
            try
            {
                BroadcastorCallback cb = new BroadcastorCallback();
                cb.SetHandler(Poller.HandleBroadcast);

                System.ServiceModel.InstanceContext context =
                    new System.ServiceModel.InstanceContext(cb);

                using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
                {
                    return queryServiceProxy.GetAllCompletedPatternDefaults("Forex");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Connection Fault :: " + ex.ToString());
            }
            return null;
        }

        public QueryService.AnswerPackage GetAllEmergingPatternDefaults()
        {
            try
            {
                BroadcastorCallback cb = new BroadcastorCallback();
                cb.SetHandler(Poller.HandleBroadcast);

                System.ServiceModel.InstanceContext context =
                    new System.ServiceModel.InstanceContext(cb);

                using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
                {
                    return queryServiceProxy.GetAllEmergingPatternDefaults("Forex");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Connection Fault :: " + ex.ToString());
            }
            return null;
        }     

        public QueryService.AnswerPackage SubmitQuery(String userQuerySession, String query)
        {
            try
            {
                BroadcastorCallback cb = new BroadcastorCallback();
                cb.SetHandler(Poller.HandleBroadcast);

                System.ServiceModel.InstanceContext context =
                    new System.ServiceModel.InstanceContext(cb);

                using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
                {
                    return queryServiceProxy.SubmitQuery(userQuerySession, query);
                }                
            }
            catch (Exception ex)
            {
                Console.WriteLine("Connection Fault :: " + ex.ToString());
            }
            return null;
        }     

        public double[][] GetChartData(String symbolID)
        {
            BroadcastorCallback cb = new BroadcastorCallback();
            cb.SetHandler(Poller.HandleBroadcast);

            System.ServiceModel.InstanceContext context =
                new System.ServiceModel.InstanceContext(cb);
            
            using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
            {
                return queryServiceProxy.GetChartData(symbolID);
            }
        }

        public QueryService.AnswerPackage GetDataResult(String queryId, String selectingSymbol)
        {
            BroadcastorCallback cb = new BroadcastorCallback();
            cb.SetHandler(Poller.HandleBroadcast);

            System.ServiceModel.InstanceContext context =
                new System.ServiceModel.InstanceContext(cb);

            using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
            {
                return queryServiceProxy.GetDataResult(queryId, selectingSymbol);
            }
        }

    }
}