using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Net;
using System.Data.SqlClient;
using System.Data;
using System.Xml;

namespace TradeRiser.Models
{

    public class General
    {
        public string fullname { get; set; }
    }


    public static class TradeUtility
    {
        private static Dictionary<String, String> _ForexSymbolLookUp = new Dictionary<String, String>();
        private static Dictionary<String, String> _CommoditiesSymbolLookUp = new Dictionary<String, String>();
        private static Dictionary<String, String> _IndicesSymbolLookUp = new Dictionary<String, String>();

        static TradeUtility()
        {
            //var path = System.Configuration.ConfigurationManager.AppSettings["ForexList"];
            ////System.Web.HttpServerUtility httpU = new HttpServerUtility();
            ////var path = httpU.MapPath("~/App_Data/FOREX.txt");


            ////var path = HttpContext.Current.Server.MapPath("~/App_Data/FOREX.txt");

            //using (StreamReader sr = new StreamReader(path))
            //{
            //    string line;

            //    while ((line = sr.ReadLine()) != null)
            //    {
            //        if (String.IsNullOrEmpty(line) == false)
            //        {
            //            var symbolArray = line.Split('/');
            //            var key = symbolArray[0] + symbolArray[1];
            //            _ForexSymbolLookUp.Add(key, line);
            //        }
            //    }
            //}
        }

        public static void Setup()
        {
            var path = System.Configuration.ConfigurationManager.AppSettings["ForexList"];
            using (StreamReader sr = new StreamReader(path))
            {
                string line;

                while ((line = sr.ReadLine()) != null)
                {
                    if (String.IsNullOrEmpty(line) == false)
                    {
                        var symbolArray = line.Split('/');
                        var key = symbolArray[0] + symbolArray[1];
                        _ForexSymbolLookUp.Add(key, line);
                    }
                }
            }           

        }

        public static String ConvertSymbolIntoFriendlyForm(String sym)
        {
            string friendlyVersion = "";
            
            _ForexSymbolLookUp.TryGetValue(sym, out friendlyVersion);

           return friendlyVersion;
        }

        public static string GetInstrumentCoverage()
        {
            string tableId = "idd" + DateTime.Now.Millisecond + DateTime.Now.Second;
            
            string summaryt = "<br/>";
            summaryt += "<p>This screen shows the instrument covered by TradeRiser. Select Next or Previous to toggle through the available symbol list, along with the intervals on which this instrument is monitored.</p>";
            summaryt += "<p>Forex Data:</p>";
            summaryt += "<p><table class='genericResultsTable' id='" + tableId + "'><thead><tr>";
            summaryt += "<td class='genericResultsHeaderCells'>Instrument</td>" +
                        "<td class='genericResultsHeaderCells'>Real Time</td>" +
                        "<td class='genericResultsHeaderCells'>5min</td>" +
                        "<td class='genericResultsHeaderCells'>10min</td>" +
                        "<td class='genericResultsHeaderCells'>15min</td>" +
                        "<td class='genericResultsHeaderCells'>30min</td>" +
                        "<td class='genericResultsHeaderCells'>1hour</td>" +
                        "<td class='genericResultsHeaderCells'>2hour</td>" +
                        "<td class='genericResultsHeaderCells'>3hour</td>" +
                        "<td class='genericResultsHeaderCells'>4hour</td>" +
                        "<td class='genericResultsHeaderCells'>Daily</td>" +
                        "</tr></thead>";

            foreach (var item in _ForexSymbolLookUp.Values)
            {
                summaryt += "<tr>";
                summaryt += "<td class='genericResultsCells'>" + item + "</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "</tr>";
            }
            summaryt += "</table></p>";
            summaryt += "<br/>";

            tableId = "ide" + DateTime.Now.Millisecond + DateTime.Now.Second;
            var indicesSymbolLookUp = new List<string>() { "DOW JONES IND AVG", 
                "FTSE 100","FTSE 250","FTSE 350", "RUSSELL 2000", "S&P 500", "S&P 100", "GERMANY 30", "US DOLLAR INDEX", "NASDAQ 100 INDEX", 
                "GOLD & SILVER INDEX", "MIDCAP MARKET INDEX"};

            summaryt += "<br/>";
            summaryt += "<p>Indices Data:</p>";
            summaryt += "<p><table class='genericResultsTable' id='" + tableId + "'><thead><tr>";
            summaryt += "<td class='genericResultsHeaderCells'>Instrument</td>" +
                        "<td class='genericResultsHeaderCells'>5min</td>" +
                        "<td class='genericResultsHeaderCells'>10min</td>" +
                        "<td class='genericResultsHeaderCells'>15min</td>" +
                        "<td class='genericResultsHeaderCells'>30min</td>" +
                        "<td class='genericResultsHeaderCells'>1hour</td>" +
                        "<td class='genericResultsHeaderCells'>2hour</td>" +
                        "<td class='genericResultsHeaderCells'>3hour</td>" +
                        "<td class='genericResultsHeaderCells'>4hour</td>" +
                        "<td class='genericResultsHeaderCells'>Daily</td>" +
                        "</tr></thead>";

            foreach (var item in indicesSymbolLookUp)
            {
                summaryt += "<tr>";
                summaryt += "<td class='genericResultsCells'>" + item + "</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "</tr>";
            }
            summaryt += "</table></p>";
            summaryt += "<br/>";




            tableId = "ire" + DateTime.Now.Millisecond + DateTime.Now.Second;
            var commoditiesSymbolLookUp = new List<string>() { "BRENT CRUDE OIL", 
                "COCOA","COFFEE","PLATINUM", "COTTON", "SUGAR", "PALLADIUM", "GAS"};

            summaryt += "<br/>";
            summaryt += "<p>Commodities Data:</p>";
            summaryt += "<p><table class='genericResultsTable' id='" + tableId + "'><thead><tr>";
            summaryt += "<td class='genericResultsHeaderCells'>Instrument</td>" +
                        "<td class='genericResultsHeaderCells'>5min</td>" +
                        "<td class='genericResultsHeaderCells'>10min</td>" +
                        "<td class='genericResultsHeaderCells'>15min</td>" +
                        "<td class='genericResultsHeaderCells'>30min</td>" +
                        "<td class='genericResultsHeaderCells'>1hour</td>" +
                        "<td class='genericResultsHeaderCells'>2hour</td>" +
                        "<td class='genericResultsHeaderCells'>3hour</td>" +
                        "<td class='genericResultsHeaderCells'>4hour</td>" +
                        "<td class='genericResultsHeaderCells'>Daily</td>" +
                        "</tr></thead>";

            foreach (var item in commoditiesSymbolLookUp)
            {
                summaryt += "<tr>";
                summaryt += "<td class='genericResultsCells'>" + item + "</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "<td class='genericResultsCells'>&#10004;</td>";
                summaryt += "</tr>";
            }
            summaryt += "</table></p>";
            summaryt += "<br/>";







            return summaryt;
        }

        public static string GetLegalInfo()
        {
            return "";
        }

        public static string GetInfo()
        {
            string info = "The platform currently handles specifc date queries, in the English Great Britain Format dd/mm/yyyy";
            return info;
        }
    }
}