using System;
using System.Linq;
using TradeRiser.Core.Director;
using TradeRiser.Core.Logging;

namespace TradeRiser.Core.Configuration.Core
{
    using System.Collections;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Net;
    using System.Runtime;
    using Newtonsoft.Json;
   

    public class MemoryStoreGarbageCollectResult
    {
        #region Properties and Indexers

        [JsonProperty("cleared")]
        public int ItemsCleared { get; set; }

        [JsonProperty("renewed")]
        public int ItemsRenewed { get; set; }

        #endregion
    }

    public class MemoryManager
    {
        /// <summary>
        ///     Determines whether the specified tag list is birdie.
        /// </summary>
        /// <param name="tagList">The tag list.</param>
        public bool IsBirdie(string tagList)
        {
            //PAREMOVE
            throw new Exception();
            //if (string.IsNullOrEmpty(tagList))
            //{
            //    return false;
            //}

            //if (!VaultLoader.Config.EnableBirdie)
            //{
            //    return false;
            //}

            //if (string.IsNullOrEmpty(VaultLoader.Config.SearchTags))
            //{
            //    return false;
            //}

            //string[] tags;

            //tags = tagList.Split(tagList.Contains(",") ? ',' : ' ');

            //return tags.Any(tag => VaultLoader.Config.SearchTags.Contains(tag));
        }

        #region  Public Methods

        /// <summary>
        ///     Removes all entries in the vault that are marked as available for garbage collection and have expired.
        /// </summary>
        /// <returns></returns>
        public MemoryStoreGarbageCollectResult DoGarbageCollection()
        {
            DateTime current = DateTime.UtcNow;
            int numberOfItemsAffected = 0;
            int countofRenews = 0;

            foreach (KeyValuePair<string, MemoryItem> vaultItem in MemoryStore.TheVault.Where(vaultItem => vaultItem.Value.GarbageCollectAllowed && vaultItem.Value.Expiration <= current))
            {
                if (vaultItem.Value.RenewFunc != null)
                {
                    try
                    {
                        vaultItem.Value.RenewFunc();
                        countofRenews++;
                    }
                    catch (Exception ex)
                    {
                        Log.Exception("MemoryManager", "DoGarbageCollection", new Exception(string.Format("Failed to renew item '{0}'", vaultItem.Key), ex));
                    }
                }
                else
                {
                    MemoryItem item;
                    bool removedOk = MemoryStore.TheVault.TryRemove(vaultItem.Key, out item);

                    if (!removedOk)
                    {
                        continue;
                    }

                    numberOfItemsAffected++;
                }
            }

            if (numberOfItemsAffected > 0)
            {
                GCSettings.LargeObjectHeapCompactionMode = GCLargeObjectHeapCompactionMode.CompactOnce;
                GC.Collect();
            }

            return new MemoryStoreGarbageCollectResult { ItemsCleared = numberOfItemsAffected, ItemsRenewed = countofRenews };
        }

        /// <summary>
        ///     Returns information on the current cache population.
        /// </summary>
        /// <returns>
        ///     A sorted list (by key asc) of vault key, string[] in the form: [Categories, Last Accessed DT, Expiration DT,
        ///     Garbage Collect Allowed, Is Stale, Data Item Count].
        /// </returns>
        public SortedList<string, string[]> GetCacheInfo()
        {
            SortedList<string, string[]> info = new SortedList<string, string[]>();

            foreach (KeyValuePair<string, MemoryItem> vaultItem in MemoryStore.TheVault)
            {
                string[] entry = { (vaultItem.Value.Categories != null) ? string.Join(",", vaultItem.Value.Categories) : string.Empty, vaultItem.Value.LastAccessedDateTime.ToString(CultureInfo.InvariantCulture), vaultItem.Value.Expiration.ToString(CultureInfo.InvariantCulture), vaultItem.Value.GarbageCollectAllowed.ToString(), vaultItem.Value.IsStale.ToString(), MemoryManager.GetDataItemCount(vaultItem.Value.Data).ToString() };

                info.Add(vaultItem.Key, entry);
            }

            return info;
        }

        /// <summary>
        ///     Adds the specified vault identifier.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <param name="data">The data.</param>
        /// <param name="timeToLive">The time to live.</param>
        /// <param name="categories">Related categories.</param>
        public void Add(string vaultId, object data, TimeSpan? timeToLive = null, List<string> categories = null)
        {
            vaultId = MemoryManager.SanatiseKey(vaultId);
            MemoryItem item = new MemoryItem { Data = data, Categories = categories };

            if (timeToLive.HasValue)
            {
                item.Expiration = DateTime.UtcNow + timeToLive.Value;
            }

            MemoryStore.TheVault.AddOrUpdate(vaultId, item, (key, oldData) => item);
        }

        /// <summary>
        ///     Adds the specified vault identifier.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <param name="data">The data.</param>
        /// <param name="renewFunc">The renew function.</param>
        /// <param name="timeToLive">The time to live.</param>
        /// <param name="categories">Related categories.</param>
        public void Add(string vaultId, object data, Action renewFunc, TimeSpan? timeToLive = null, List<string> categories = null)
        {
            vaultId = MemoryManager.SanatiseKey(vaultId);
            MemoryItem item = new MemoryItem { Data = data, Categories = categories, RenewFunc = renewFunc };

            if (timeToLive.HasValue)
            {
                item.Expiration = DateTime.UtcNow + timeToLive.Value;
            }

            MemoryStore.TheVault.AddOrUpdate(vaultId, item, (key, oldData) => item);
        }

        public void Purge(string vaultId, bool purgeRelatedCategories = false)
        {
            this.PurgeGlobal(vaultId, null, purgeRelatedCategories);
        }

        /// <summary>
        ///     Purges the specified vault identifier from the local cache.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <param name="purgeRelatedCategories">Purges related categories.</param>
        public void PurgeLocal(string vaultId, bool purgeRelatedCategories = false)
        {
            vaultId = MemoryManager.SanatiseKey(vaultId);
            List<string> relatedCategories = new List<string>();

            if (MemoryStore.TheVault.ContainsKey(vaultId))
            {
                MemoryItem oldData;
                MemoryStore.TheVault.TryRemove(vaultId, out oldData);

                if (oldData != null)
                {
                    relatedCategories = oldData.Categories;
                }
            }

            if (purgeRelatedCategories)
            {
                this.PurgeGlobalCategory(relatedCategories);
            }
        }

        /// <summary>
        /// Purges all caches across the group.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <param name="category">The category.</param>
        /// <param name="purgeRelatedCategories">Purges related categories.</param>
        public void PurgeGlobal(string vaultId, string category, bool purgeRelatedCategories = false)
        {
            if (!string.IsNullOrWhiteSpace(vaultId))
            {
                vaultId = MemoryManager.SanatiseKey(vaultId);
                this.PurgeLocal(vaultId, purgeRelatedCategories);
            }

            MemoryManager.NotifyPeers(vaultId, category, purgeRelatedCategories);
        }

        /// <summary>
        ///     Sanatises the key.
        /// </summary>
        /// <param name="key">The key.</param>
        private static string SanatiseKey(string key)
        {
            if (key.StartsWith("/", StringComparison.InvariantCultureIgnoreCase))
            {
                key = key.TrimStart('/');
            }

            if (key.EndsWith("/", StringComparison.InvariantCultureIgnoreCase))
            {
                key = key.TrimEnd('/');
            }

            return key;
        }

        /// <summary>
        ///     Purges the vault.
        /// </summary>
        public void PurgeTheVault()
        {
            MemoryStore.TheVault = new ConcurrentDictionary<string, MemoryItem>();
        }

        /// <summary>
        ///     Purges the Vault by category.
        /// </summary>
        /// <param name="categories">The categories.</param>
        /// MT - code review comment - linq is very slow - the code below may have performance issues with large numbers of vault items
        public void PurgeGlobalCategory(List<string> categories)
        {
            foreach (string category in categories)
            {
                this.PurgeGlobalCategory(category);
            }
        }

        public void PurgeGlobalCategory(string category)
        {
            this.PurgeLocalCategory(category);
            this.PurgeGlobal(string.Empty, category, false);
        }

        public void PurgeLocalCategory(string category)
        {
            foreach (KeyValuePair<string, MemoryItem> kvp in MemoryStore.TheVault)
            {
                if (kvp.Value.Categories != null && kvp.Value.Categories.Contains(category))
                {
                    this.PurgeLocal(kvp.Key);
                }
            }
        }

        /// <summary>
        ///     Gets the specified vault identifier.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <returns></returns>
        public object Get(string vaultId)
        {
            vaultId = MemoryManager.SanatiseKey(vaultId);
            if (!MemoryStore.TheVault.ContainsKey(vaultId))
            {
                return null;
            }

            MemoryItem item = MemoryStore.TheVault[vaultId];

            if (item.IsStale)
            {
                this.Purge(vaultId);
                return null;
            }

            item.UpdateLastAccessed();
            return item.Data;
        }

        /// <summary>
        ///     Itemses the in vault.
        /// </summary>
        /// <returns></returns>
        public List<string> ItemsInVault()
        {
            return MemoryStore.TheVault.Keys.ToList();
        }

        /// <summary>
        ///     Returns the number of items in the vault.
        /// </summary>
        public int ItemCount
        {
            get
            {
                return MemoryStore.TheVault == null ? 0 : MemoryStore.TheVault.Count;
            }
        }

        /// <summary>
        ///     Gets the vault item.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <returns></returns>
        public MemoryItem GetVaultItem(string vaultId)
        {
            vaultId = MemoryManager.SanatiseKey(vaultId);
            if (!MemoryStore.TheVault.ContainsKey(vaultId))
            {
                return null;
            }

            MemoryItem item = MemoryStore.TheVault[vaultId];
            item.LastAccessedDateTime = DateTime.UtcNow;

            if (!item.IsStale)
            {
                return MemoryStore.TheVault[vaultId];
            }

            this.Purge(vaultId);
            return null;
        }

        /// <summary>
        ///     Gets a boolean to indicate whether the item is present in the vault.
        /// </summary>
        /// <param name="vaultId">The id of the item.</param>
        public bool ContainsItem(string vaultId)
        {
            vaultId = MemoryManager.SanatiseKey(vaultId);
            return MemoryStore.TheVault.ContainsKey(vaultId);
        }

        #endregion

        #region  Private Methods

        /// <summary>
        ///     Gets the data item count.
        /// </summary>
        /// <param name="data">The data.</param>
        private static int GetDataItemCount(object data)
        {
            Type type = data.GetType();

            if (type.IsArray)
            {
                return ((Array)data).Length;
            }

            if (type.GetInterface("System.Collections.IList", true) != null)
            {
                return ((IList)data).Count;
            }

            return type.GetInterface("System.Collections.IDictionary", true) != null ? ((IDictionary)data).Count : 1;
        }

        private static void NotifyPeers(string vaultId, bool purgeRelatedCategories = false)
        {
            MemoryManager.NotifyPeers(vaultId, null, purgeRelatedCategories);
        }

        /// <summary>
        /// Notifies the peers.
        /// </summary>
        /// <param name="vaultId">The vault identifier.</param>
        /// <param name="category">The category.</param>
        /// <param name="purgeRelatedCategories">If set to <c>true</c>, purge related categories.</param>
        private static void NotifyPeers(string vaultId, string category, bool purgeRelatedCategories = false)
        {
            try
            {
                if (vaultId == null)
                {
                    vaultId = string.Empty;
                }

                if (category == null)
                {
                    category = string.Empty;
                }

                //vaultId = MemoryManager.SanatiseKey(vaultId);
                //IConfigurationService configuration = Dependency.GetConfigurationService();

                //ServiceBusSettings settings = new ServiceBusSettings { Director = Dependency.Get<IDirector>(), Instance = configuration.GetConfigItem<string>("ServiceBus.RtiInstanceName"), Instruction = "SvcBus.Vault.Purge.On" };

                //Dictionary<string, object> properties = new Dictionary<string, object> { { "Initiator", Dns.GetHostName().ToLower() }, { "VaultID", vaultId }, { "PurgeRelatedCategories", purgeRelatedCategories.ToString() }, { "Category", category } };

                //ServiceBusMessage message = new ServiceBusMessage(string.Empty, properties);

                //IServiceBusClient client = Dependency.Get<IServiceBusClient>();
                //client.Send(settings, new[] { message });
            }
            catch (Exception e)
            {
                Log.Exception("MemoryManager", "NotifyPeers", e.InnerException);
            }
        }

        #endregion
    }
}
