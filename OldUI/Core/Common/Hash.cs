namespace TradeRiser.Core.Common
{
    using System;
    using System.Security.Cryptography;
    using System.Text;
    using TradeRiser.Core.Common;

    /// <summary>
    /// Performs SHA1 based hashing functions.
    /// </summary>
    public static class Hash
    {
        #region constructors

        /// <summary>
        /// Initializes static members of the <see cref="Hash"/> class.
        /// </summary>
        static Hash()
        {
            HashSizeBytes = new SHA1Managed().HashSize / 8;
        }

        #endregion constructors

        #region properties

        /// <summary>
        /// Gets the size of the hash in bytes.
        /// </summary>
        /// <value>The size of the hash in bytes.</value>
        public static int HashSizeBytes { get; internal set; }

        #endregion properties

        #region public methods

        /// <summary>
        /// Computes the SHA1 hash for the input string.
        /// </summary>
        /// <param name="input">The string to hash.</param>
        /// <returns>A base 64 encoded default sha1 hash of the input string.</returns>
        public static string ComputeHash(string input)
        {
            Validate.ArgumentNotNullOrEmpty(input, "input");

            SHA1Managed sha1 = new SHA1Managed();
            byte[] hashBytes = sha1.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(hashBytes);
        }

        /// <summary>
        /// Computes the hash for the supplied bytes.
        /// </summary>
        /// <param name="data">The data to hash.</param>
        /// <returns>A byte array containing the hash of the supplied data.</returns>
        public static byte[] ComputeHash(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");

            SHA1Managed sha1 = new SHA1Managed();
            return sha1.ComputeHash(data);
        }

        /// <summary>
        /// Computes the HMAC SHA1 hash for the input string using the specified key.
        /// </summary>
        /// <param name="input">The string to hash.</param>
        /// <param name="key">The key for the hash.</param>
        /// <returns>A base 64 encoded keyed hash of the input string.</returns>
        public static string ComputeKeyedHash(string input, string key)
        {
            Validate.ArgumentNotNullOrEmpty(input, "input");
            Validate.ArgumentNotNullOrEmpty(key, "salt");

            HMACSHA1 hmac = new HMACSHA1(Encoding.UTF8.GetBytes(key), true);
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(hashBytes);
        }

        /// <summary>
        /// Computes the sh a1 hash.
        /// </summary>
        /// <param name="input">The input.</param>
        /// <returns></returns>
        public static string ComputeSHA1Hash(string input)
        {
            SHA1CryptoServiceProvider SHA1provider = new SHA1CryptoServiceProvider();
            byte[] hasedvalue = SHA1provider.ComputeHash(Encoding.UTF8.GetBytes(input));
            
            StringBuilder str = new StringBuilder();
            
            for (int i = 0; i < hasedvalue.Length; i++)
            {
                str.Append(hasedvalue[i].ToString("X1"));
            }
            return str.ToString();
        }
        #endregion public methods
    }
}
