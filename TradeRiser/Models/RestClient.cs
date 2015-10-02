using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using System.IO;
using System.Configuration;
using System.Net;
using System.Xml.XPath;

namespace TradeRiser.Models
{
    public class RestClient
    {
        private string GetAccessToken(string username, string password)
        {
            try
            {
                var url = System.Configuration.ConfigurationManager.AppSettings["REST_URL"].ToString() + "token";
                //var apikeyInsert = System.Configuration.ConfigurationManager.AppSettings["TradeRiserAPI_Key"].ToString();

                WebRequest request = WebRequest.Create(url);
                // Set the Method property of the request to POST.
                request.Method = "POST";

                string postData = "username=" + username + "&grant_type=password" + "&password=" + password;


                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                // Set the ContentType property of the WebRequest.
                request.ContentType = "application/x-www-form-urlencoded";
                // Set the ContentLength property of the WebRequest.
                request.ContentLength = byteArray.Length;
                // Get the request stream.
                Stream dataStream = request.GetRequestStream();
                // Write the data to the request stream.
                dataStream.Write(byteArray, 0, byteArray.Length);
                // Close the Stream object.
                dataStream.Close();



                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.
                dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                // Clean up the streams.
                reader.Close();
                dataStream.Close();
                response.Close();

                dynamic json = Newtonsoft.Json.JsonConvert.DeserializeObject(responseFromServer);
                return (string)json["access_token"];
            }
            catch (Exception ex)
            {
                return String.Empty;
            }
        }

        private string GetAccessToken()
        {
            var url = System.Configuration.ConfigurationManager.AppSettings["REST_URL"].ToString() + "token";
            var apikeyInsert = System.Configuration.ConfigurationManager.AppSettings["TradeRiserAPI_Key"].ToString();

            WebRequest request = WebRequest.Create(url);
            // Set the Method property of the request to POST.
            request.Method = "POST";
        
            string postData = "username="+ apikeyInsert + "&grant_type=password";


            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            // Set the ContentType property of the WebRequest.
            request.ContentType = "application/x-www-form-urlencoded";
            // Set the ContentLength property of the WebRequest.
            request.ContentLength = byteArray.Length;
            // Get the request stream.
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.
            dataStream.Close();



            // Get the response.
            WebResponse response = request.GetResponse();
            // Display the status.
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.
            dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.
            string responseFromServer = reader.ReadToEnd();
            // Display the content.
            Console.WriteLine(responseFromServer);
            // Clean up the streams.
            reader.Close();
            dataStream.Close();
            response.Close();

            dynamic json = Newtonsoft.Json.JsonConvert.DeserializeObject(responseFromServer);
            return (string)json["access_token"];
        }

        public CustomToken AuthenticateUser(string username, string password)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/UserAuth/Authenticate";

            var model = new LoginModel();
            model.UserName = username;
            model.Password = password;

            //userinfo object is returned 
            string accessTokenRaw = GetAccessToken(username, password);
            //dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(accessTokenRaw);

            if (String.IsNullOrEmpty(accessTokenRaw) == false)
            {
                var regModel = new RegisterModel
                {
                    UserName = username,
                    AccessToken = accessTokenRaw
                };
                if (Register(regModel))
                {
                    var customToken = new CustomToken
                    {
                        Username = regModel.UserName,
                        AccessToken = regModel.AccessToken,
                        Password = password
                    };
                    return customToken;
                }
            }
            return null;
            //var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(model);

            //string response = PostToRestService(apiUrl, serialized);
            //dynamic json = Newtonsoft.Json.JsonConvert.DeserializeObject(response);

            //return Convert.ToBoolean((string)json["LoginSuccessful"]);


            //return string.IsNullOrEmpty(response) ? false : Convert.ToBoolean(response);
        }

        public bool LogOff(string username, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/UserAuth/Logout";
           
            var usernameItem = new UserNameItem();
            usernameItem.UserName = username;

            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(usernameItem);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return string.IsNullOrEmpty(response) ? false : Convert.ToBoolean(response);
        }


        public bool Register(RegisterModel model)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/UserAuth/Register";

            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(model);

            string response = PostToRestService(apiUrl, serialized, model.AccessToken);

            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(response);

            return string.IsNullOrEmpty(response) 
                || jsonObj == null ? false : jsonObj["LoginSuccessful"];
        }

        public bool TokenChecker(string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/UserAuth/SessionTokenActive";

            string response = GetFromRestService(apiUrl, accessToken);
            try
            {
                if (String.IsNullOrEmpty(response) == false)
                {
                    if (Convert.ToBoolean(response))
                    {
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return false;


            //return string.IsNullOrEmpty(response) ? false : Convert.ToBoolean(response);
        }

        public string GetUserProfile(string username, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/GetUserProfile";

            var usernameItem = new UserNameItem();
            usernameItem.UserName = username;
            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(usernameItem);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return response;
        }

        public string GetAnswer(string searchQuery, string username, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/GetAnswer";

            var search = new SearchQuery();
            search.Query = searchQuery;
            search.Username = username;

            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(search);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return response;
        }

        public string GetDataResult(string queryId, string selectingSymbol, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/GetDataResult";

            var dataResultRetriever = new DataResultRetriever();
            dataResultRetriever.QueryId = queryId;
            dataResultRetriever.SelectingSymbol = selectingSymbol;

            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(dataResultRetriever);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return response;
        }

        public string GetSymbolData(string symbolID, string timeFrame, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/GetSymbolData";

            var symbolData = new SymbolData();
            symbolData.SymbolID = symbolID;
            symbolData.TimeFrame = timeFrame;

            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(symbolData);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return response;
        }

        public string FollowQuery(string username, string query, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/FollowQuery";

            var subMan = new SubscripitionManagment();
            subMan.UserName = username;
            subMan.Query = query;
            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(subMan);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return response;
        }

        public string UnfollowQuery(string username, string query, string accessToken)
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/UnfollowQuery";

            var subMan = new SubscripitionManagment();
            subMan.UserName = username;
            subMan.Query = query;
            var serialized = Newtonsoft.Json.JsonConvert.SerializeObject(subMan);

            string response = PostToRestService(apiUrl, serialized, accessToken);
            return response;
        }

        public string GetAllEmergingPatternDefaults()
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/GetAllEmergingPatternDefaults";

            string response = GetFromRestService(apiUrl);
            return response;
        }

        public string GetAllCompletedPatternDefaults()
        {
            var apiUrl = ConfigurationManager.AppSettings["REST_URL"] + "api/Query/GetAllCompletedPatternDefaults";

            string response = GetFromRestService(apiUrl);
            return response;
        }

        private string GetFromRestService(string url, string accessTokenItem)
        {
            try
            {
                var accessToken = accessTokenItem;
                var apiUrl = url;
                WebRequest request = WebRequest.Create(apiUrl);
                // Set the Method property of the request to POST.
                request.Method = "GET";

                request.Headers.Add("Authorization", "Bearer " + accessToken);


                // Set the ContentType property of the WebRequest.
                //request.ContentType = "application/x-www-form-urlencoded";
                request.ContentType = "application/json";


                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.
                var dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                // Clean up the streams.
                reader.Close();
                response.Close();

                return responseFromServer;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return "";
        }

        private string GetFromRestService(string url)
        {
            //store access token locally for reuse- if it expires then
            //login again
            try
            {
                var accessToken = GetAccessToken();
                var apiUrl = url;
                WebRequest request = WebRequest.Create(apiUrl);
                // Set the Method property of the request to POST.
                request.Method = "GET";

                request.Headers.Add("Authorization", "Bearer " + accessToken);


                // Set the ContentType property of the WebRequest.
                //request.ContentType = "application/x-www-form-urlencoded";
                request.ContentType = "application/json";


                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.
                var dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                // Clean up the streams.
                reader.Close();
                response.Close();

                return responseFromServer;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return "";
        }

        private string PostToRestService(string url, string accessTokenItem)
        {
            try
            {
                var accessToken = accessTokenItem;
                var apiUrl = url;

                WebRequest request = WebRequest.Create(apiUrl);
                // Set the Method property of the request to POST.
                request.Method = "POST";

                request.Headers.Add("Authorization", "Bearer " + accessToken);
                request.ContentType = "application/json";

                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.
                var dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                // Clean up the streams.
                reader.Close();
                dataStream.Close();
                response.Close();

                return responseFromServer;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return "";
        }


        private string PostToRestService(string url, string serialized, string accessTokenItem)
        {
            //store access token locally for reuse- if it expires then
            //login again

            //Is it possible to make the username not be an email, but rather a special id

            try
            {
                var accessToken = accessTokenItem;
                var apiUrl = url;


                //var search = new SearchQuery();
                //search.Query = postParameter;

                //var msg = Newtonsoft.Json.JsonConvert.SerializeObject(search);

                WebRequest request = WebRequest.Create(apiUrl);
                // Set the Method property of the request to POST.
                request.Method = "POST";

                request.Headers.Add("Authorization", "Bearer " + accessToken);


                // Create POST data and convert it to a byte array.
                string postData = serialized;
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                // Set the ContentType property of the WebRequest.
                //request.ContentType = "application/x-www-form-urlencoded";
                request.ContentType = "application/json";


                // Set the ContentLength property of the WebRequest.
                request.ContentLength = byteArray.Length;
                // Get the request stream.
                Stream dataStream = request.GetRequestStream();
                // Write the data to the request stream.
                dataStream.Write(byteArray, 0, byteArray.Length);
                // Close the Stream object.
                dataStream.Close();


                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.
                dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                // Clean up the streams.
                reader.Close();
                dataStream.Close();
                response.Close();

                return responseFromServer;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return "";
        }
                
        private bool PostToRestServiceNonAuth(string url, string username, string password)
        {
            try
            {
                var apiUrl = url;

                var login = new LoginModel();
                login.UserName = username;
                login.Password = password;

                var msg = Newtonsoft.Json.JsonConvert.SerializeObject(login);

                WebRequest request = WebRequest.Create(apiUrl);
                // Set the Method property of the request to POST.
                request.Method = "POST";

                //request.Headers.Add("Authorization", "Bearer " + accessToken);


                // Create POST data and convert it to a byte array.
                string postData = msg;
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                // Set the ContentType property of the WebRequest.
                //request.ContentType = "application/x-www-form-urlencoded";
                request.ContentType = "application/json";


                // Set the ContentLength property of the WebRequest.
                request.ContentLength = byteArray.Length;
                // Get the request stream.
                Stream dataStream = request.GetRequestStream();
                // Write the data to the request stream.
                dataStream.Write(byteArray, 0, byteArray.Length);
                // Close the Stream object.
                dataStream.Close();


                // Get the response.
                WebResponse response = request.GetResponse();
                // Display the status.
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                // Get the stream containing content returned by the server.
                dataStream = response.GetResponseStream();
                // Open the stream using a StreamReader for easy access.
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.
                string responseFromServer = reader.ReadToEnd();
                // Display the content.
                Console.WriteLine(responseFromServer);
                // Clean up the streams.
                reader.Close();
                dataStream.Close();
                response.Close();

                return Convert.ToBoolean(responseFromServer);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return false;
        }

    }

    public class DataResultRetriever
    {
        public string QueryId { get; set; }
        public string SelectingSymbol { get; set; }
    }


    public class SearchQuery
    {
        public string Username { get; set; }
        public string Query { get; set; }
    }

    public class SymbolData
    {
        public string SymbolID { get; set; }
        public string TimeFrame { get; set; }
    }

    public class SubscripitionManagment
    {
        public string UserName { get; set; }
        public string Query { get; set; }
    }

    public class UserNameItem
    {
        public string UserName { get; set; }
    }

}