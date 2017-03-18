using System;
using System.Collections.Generic;

namespace TradeRiser.Core.Configuration.Core
{
    /// <summary>
    /// Class to hold the Vault Items
    /// </summary>
    public class MemoryItem
    {
        #region  Properties and Indexers

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        public object Data
        {
            get;
            set;
        }

        /// <summary>
        /// Gets or sets the expiration.
        /// </summary>
        /// <value>
        /// The expiration.
        /// </value>
        public DateTime Expiration
        {
            get;
            set;
        }

        /// <summary>
        /// Gets a value indicating whether this instance is stale.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is stale; otherwise, <c>false</c>.
        /// </value>
        public bool IsStale
        {
            get
            {
                // if this item has a renew function, assume it is never stale. The restful renew process will renew it soon
                if (this.RenewFunc != null)
                {
                    return false;
                }

                return DateTime.UtcNow > this.Expiration;
            }
        }

        /// <summary>
        /// Gets the last accessed date time.
        /// </summary>
        /// <value>
        /// The last accessed date time.
        /// </value>
        public DateTime LastAccessedDateTime
        {
            get;
            set;
        }

        /// <summary>
        /// Gets a value indicating whether [garbage collect allowed].
        /// </summary>
        /// <value>
        /// <c>true</c> if [garbage collect allowed]; otherwise, <c>false</c>.
        /// </value>
        public bool GarbageCollectAllowed
        {
            get;
            private set;
        }

        /// <summary>
        /// Gets or sets the categories.
        /// </summary>
        /// <value>
        /// The categories.
        /// </value>
        public List<string> Categories
        {
            get;
            set;
        }

        public Action RenewFunc
        {
            get;
            set;
        }

        #endregion

        #region  Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="MemoryItem"/> class.
        /// </summary>
        public MemoryItem()
            : this(null, DateTime.MaxValue)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MemoryItem"/> class.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <param name="expiration"></param>
        /// <param name="allowGarbageCollect"></param>
        public MemoryItem(object data, DateTime expiration, bool allowGarbageCollect = true)
        {
            this.Data = data;
            this.Expiration = expiration;
            this.LastAccessedDateTime = DateTime.UtcNow;
            this.GarbageCollectAllowed = allowGarbageCollect;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MemoryItem" /> class.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <param name="expiration">The expiration.</param>
        /// <param name="renewFunc">The renew function.</param>
        public MemoryItem(object data, DateTime expiration, Action renewFunc)
            : this(data, expiration, true)
        {
            this.RenewFunc = renewFunc;
        }

        #endregion

        #region  Public Methods

        /// <summary>
        /// Updates the last accessed.
        /// </summary>
        public void UpdateLastAccessed()
        {
            this.LastAccessedDateTime = DateTime.UtcNow;
        }

        #endregion
    }
}
