namespace TradeRiser.Core.Configuration.Core
{
    using System.Collections.Concurrent;

    public class MemoryStore
    {
        /// <summary>
        /// The vault
        /// </summary>
        internal static ConcurrentDictionary<string, MemoryItem> TheVault = new ConcurrentDictionary<string, MemoryItem>();
    }
}
