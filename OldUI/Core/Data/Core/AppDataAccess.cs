//using System.Collections.Generic;
//using TradeRiser.Core.Logging;


//namespace TradeRiser.Core.Data
//{
 
//    public class AppDataAccess 
//    {
//        #region private fields

//        /// <summary>
//        /// The component.
//        /// </summary>
//        private const string Component = "TradeRiser.Core.App";

//        /// <summary>
//        /// The sender.
//        /// </summary>
//        private const string Sender = "AppDataAccess";

//        #endregion private fields

//        #region properties

//        /// <summary>
//        /// Gets the data access helper.
//        /// </summary>
//        public IDataAccess Database
//        {
//            get
//            {
//                return new DataAccess();              
//            }
//        }

//        #endregion properties

//        #region public methods

//        /// <summary>
//        /// Creates the user.
//        /// </summary>
//        /// <param name="user">The user.</param>
//        /// <param name="userId">The user id.</param>
//        public bool SubmitFeedback(Feedback feedback)
//        {
//            using (IDataAccess data = this.Database)
//            {
//                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "traderiser.FeedbacksUpdate");

//                settings.Parameters.Add(new DataParameter() {ParameterName = "@Name", Value = feedback.Name});
//                settings.Parameters.Add(new DataParameter() {ParameterName = "@Email", Value = feedback.Email});
//                settings.Parameters.Add(new DataParameter() {ParameterName = "@Message", Value = feedback.Message});
//                DataResult result = data.ExecuteNonQuery(settings);
//                if (!result.Success)
//                {
//                    Log.Exception(AppDataAccess.Component,
//                        string.Format("{0}.{1}", AppDataAccess.Sender, "FeedbacksUpdate"), result.Exception);
//                    throw result.Exception;
//                }

//            }
//            return true;
//        }


        
//        /// <summary>
//        /// Gets all users.
//        /// </summary>
//        public List<Feedback> GetFeedbacks()
//        {
//            List<Feedback> users = null;

//            using (IDataAccess data = this.Database)
//            {
//                users = data.Get<Feedback>(new DataSettings(CoreConnections.MembershipDirectConnection, "traderiser.FeedbackSelect", "feedback"));
//            }

//            return users;
//        }

//        #endregion public methods

//      }
//}
