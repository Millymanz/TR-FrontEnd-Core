using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TradeRiser.Models
{
    public class AutoComplete
    {
        //public List<QueryService.QueryHelperDefinition> GetAutoComplete(String input)
        //{
        //    using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient())
        //    {
        //        var res = queryServiceProxy.GetAutoComplete(input);
        //        return res.ToList();
        //    }
        //}

        public IList<QueryService.QueryHelperDefinition> GetAutoComplete(String input)
        {
            BroadcastorCallback cb = new BroadcastorCallback();
            cb.SetHandler(Poller.HandleBroadcast);

            System.ServiceModel.InstanceContext context =
                new System.ServiceModel.InstanceContext(cb);


            using (QueryService.QueryServiceClient queryServiceProxy = new QueryService.QueryServiceClient(context))
            {
                var res = queryServiceProxy.GetAutoComplete(input);
                return res;
            }
        }
    }
}