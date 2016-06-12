using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TradeRiser.Core.Data
{
    public class DataResult : IDisposable
    {
        private readonly DateTime startTime;
        private DateTime? stopTime;
        private bool success;

        #region constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="DataResult"/> class.
        /// </summary>
        public DataResult()
        {
            this.success = true;
            this.startTime = DateTime.UtcNow;
            this.stopTime = null;
            this.WasCompleted = true;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets or sets the affected rows. Set when performing a non query.
        /// </summary>
        /// <value>
        /// The affected rows.
        /// </value>
        public int AffectedRows
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the exception. Only set when there is an unhandled exception in a data operation. Test with <see cref="DataResult"/> Success.
        /// </summary>
        /// <value>
        /// The exception.
        /// </value>
        public Exception Exception
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the message, if relevant. Usually a warning. Normally null.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the reader over the IDatabase when executing a query.
        /// </summary>
        /// <value>
        /// The reader.
        /// </value>
        public IReader Reader
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the request text used by the DataProvider.
        /// </summary>
        public string RequestText { get; set; }

        /// <summary>
        /// Gets the scalar. Use when data operation is expected to return a scalar.
        /// </summary>
        /// <value>
        /// The scalar.
        /// </value>
        /// <exception cref="System.Exception">
        /// Attempt to access scalar on DataResult when IReader is null.
        /// or
        /// Attempt to access scalar on DataResult when IReader retuned no results.
        /// </exception>
        public object Scalar
        {
            get
            {
                if (this.Reader == null)
                {
                    throw new Exception("Attempt to access scalar on DataResult when IReader is null.");
                }

                if (this.Reader.FieldCount == 0) return null;

                object[] values = new object[this.Reader.FieldCount];

                // if we use a scalar, it is really just the first row first value of the reader.
                while (this.Reader.Read())
                {
                    this.Reader.GetValues(values);
                }

                if (values[0] == null)
                {
                    throw new Exception("Attempt to access scalar on DataResult when IReader returned no results.");
                }

                return values[0];
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the data operation was successful.
        /// </summary>
        /// <value>
        ///   <c>True</c> if the operation was a success; otherwise, <c>false</c>.
        /// </value>
        public bool Success
        {
            get { return this.success; }
            set
            {
                // Ensure the stop time is updated.
                if (this.stopTime == null)
                {
                    this.stopTime = DateTime.UtcNow;
                    this.executionTime = this.stopTime.Value.Subtract(this.startTime);
                }

                this.success = value;
            }
        }

        /// <summary>
        /// Gets or sets a value indicating whether the operation was completed in full.
        /// </summary>
        public bool WasCompleted { get; set; }

        private TimeSpan? executionTime;

        /// <summary>
        /// Gets or sets a value indicating the elapsed execution time.
        /// </summary>
        public TimeSpan ExecutionTime
        {
            get
            {
                if (this.executionTime != null) return this.executionTime.Value;

                // Ensure the stop time is updated.
                if (this.stopTime != null) return this.executionTime.Value;

                this.stopTime = DateTime.UtcNow;
                this.executionTime = this.stopTime.Value.Subtract(this.startTime);

                return this.executionTime.Value;
            }
            private set { this.executionTime = value; }
        }

        #endregion properties

        ///// <summary>
        ///// Loads this data result from a transporter.
        ///// </summary>
        ///// <param name="transporter">The transporter.</param>
        //public void LoadFromTransporter(ReaderTransporter transporter)
        //{
        //    if (!transporter.Success)
        //    {
        //        this.Success = false;
        //        this.Exception = transporter.Exception;
        //    }
        //    else
        //    {
        //        DataServiceHostReader reader = new DataServiceHostReader(transporter);

        //        this.Success = true;
        //        this.ExecutionTime = transporter.ExecutionTime;
        //        this.Reader = reader;
        //        this.AffectedRows = transporter.AffectedRows;
        //        this.Message = transporter.Message;
        //        this.RequestText = transporter.RequestText;
        //    }
        //}

        public void Dispose()
        {
            if (this.Reader == null) return;

            try
            {
                this.Reader.Dispose();
            }
            catch
            {
                // ignored
            }
        }
    }
}
