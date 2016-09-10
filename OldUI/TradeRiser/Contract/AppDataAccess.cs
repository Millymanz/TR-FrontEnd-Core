using System;
using System.Collections.Generic;
using System.Data;
using TradeRiser.Core.Logging;



namespace TradeRiser.Core.Data
{
    public class AppDataAccess
    {
        #region private fields

        /// <summary>
        /// The component.
        /// </summary>
        private const string Component = "TradeRiser.Core.App";

        /// <summary>
        /// The sender.
        /// </summary>
        private const string Sender = "AppDataAccess";

        #endregion private fields

        #region properties

        /// <summary>
        /// Gets the data access helper.
        /// </summary>
        public IDataAccess Database
        {
            get
            {
                return new DataAccess();
            }
        }

        #endregion properties

        #region public methods

        /// <summary>
        /// Creates the user.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="userId">The user id.</param>
        public bool SubmitFeedback(Feedback feedback)
        {
            bool success;
            using (IDataAccess data = this.Database)
            {
                DataSettings settings = new DataSettings(CoreConnections.MembershipDirectConnection, "traderiser.FeedbacksUpdate");

                //if (feedback.ID != 0)
                //{
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@ID", Value = feedback.ID });
                //}

                settings.Parameters.Add(new DataParameter() { ParameterName = "@Name", Value = feedback.Name });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@FirstName", Value = feedback.FirstName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@LastName", Value = feedback.LastName });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Email", Value = feedback.Email });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Message", Value = feedback.Message });
                settings.Parameters.Add(new DataParameter() { ParameterName = "@Actioned", Value = feedback.Actioned });

                if (feedback.InsertDateTime > DateTime.MinValue)
                {
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@InsertDateTime", Value = feedback.InsertDateTime, DbType = DbType.DateTime });
                }
                else
                {
                    settings.Parameters.Add(new DataParameter() { ParameterName = "@InsertDateTime", Value = DBNull.Value, DbType = DbType.DateTime });
                }

                DataResult result = data.ExecuteNonQuery(settings);
                success = result.Success;
                if (!success)
                {

                    Log.Exception(AppDataAccess.Component,
                        string.Format("{0}.{1}", AppDataAccess.Sender, "FeedbacksUpdate"), result.Exception);
                    throw result.Exception;
                }

            }
            return success;
        }



        /// <summary>
        /// Gets all users.
        /// </summary>
        public List<Feedback> GetFeedbacks()
        {
            List<Feedback> users = null;

            using (IDataAccess data = this.Database)
            {
                users = data.Get<Feedback>(new DataSettings(CoreConnections.MembershipDirectConnection, "traderiser.FeedbackSelect", "feedback"));
            }

            return users;
        }

        #endregion public methods

    }
}
