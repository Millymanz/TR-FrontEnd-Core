namespace TradeRiser.Core.Director
{
    using System;
using System.Collections.Generic;
using System.Collections.Specialized;

    /// <summary>
    /// NameValueCollection with extra get methods.
    /// </summary>
    [Serializable]
    public class NameValueCollectionWrapper
    {
        /// <summary>
        /// The actual collection.
        /// </summary>
        private NameValueCollection collection;

        /// <summary>
        /// Initializes a new instance of the <see cref="NameValueCollectionWrapper"/> class.
        /// </summary>
        /// <param name="collection">The collection.</param>
        public NameValueCollectionWrapper(NameValueCollection collection)
        {
            this.collection = collection;
        }

        /// <summary>
        /// Gets the specified value on the key querystring.
        /// </summary>
        /// <typeparam name="T">The type conversion for this key value.</typeparam>
        /// <param name="key">The key to look up on the querystring.</param>
        /// <returns>The value of key.</returns>
        public T Get<T>(string key)
        {
            return this.Get<T>(key, default(T));
        }

        /// <summary>
        /// Gets the specified value on the key querystring.
        /// </summary>
        /// <typeparam name="T">The type conversion for this key value.</typeparam>
        /// <param name="key">The key to look up on the querystring.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>The value of key.</returns>
        public T Get<T>(string key, T defaultValue)
        {
            T value = defaultValue;

            if (this.collection[key] != null)
            {
                try
                {
                    if (typeof(T) == typeof(System.Guid))
                    {
                        Guid guid = new Guid(this.collection[key]);
                        value = (T)Convert.ChangeType(guid, typeof(T));
                    }
                    else if (typeof(T).BaseType == typeof(Enum))
                    {
                        value = (T)Enum.Parse(typeof(T), this.collection[key], true);
                    }
                    else
                    {
                        value = (T)Convert.ChangeType(this.collection[key], typeof(T));
                    }
                }
                catch
                {
                    value = defaultValue;
                }
            }

            return value;
        }

        public Dictionary<string, string> All()
        {
            Dictionary<string, string> all = new Dictionary<string, string>();
            foreach (var item in this.collection.AllKeys)
            {
                all.Add(item, this.Get<string>(item));
            }

            return all;
        }
    }
}
