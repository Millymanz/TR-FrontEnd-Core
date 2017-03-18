namespace TradeRiser.Core.Common
{
    using System;
    using System.Security.Cryptography;
    using System.Text;

    public static class Hash
    {
        #region constructors

        static Hash()
        {
            HashSizeBytes = new SHA1Managed().HashSize / 8;
        }

        #endregion constructors

        #region properties

        public static int HashSizeBytes { get; internal set; }

        #endregion properties

        #region public methods

        public static string ComputeHash(string input)
        {
            Validate.ArgumentNotNullOrEmpty(input, "input");

            SHA1Managed sha1 = new SHA1Managed();
            byte[] hashBytes = sha1.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(hashBytes);
        }

        public static byte[] ComputeHash(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");

            SHA1Managed sha1 = new SHA1Managed();
            return sha1.ComputeHash(data);
        }

        public static string ComputeKeyedHash(string input, string key)
        {
            Validate.ArgumentNotNullOrEmpty(input, "input");
            Validate.ArgumentNotNullOrEmpty(key, "salt");

            HMACSHA1 hmac = new HMACSHA1(Encoding.UTF8.GetBytes(key), true);
            byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(hashBytes);
        }

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
