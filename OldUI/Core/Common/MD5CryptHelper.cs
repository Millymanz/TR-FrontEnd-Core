namespace TradeRiser.Core.Common
{
    using System;
    using System.Globalization;
    using System.IO;
    using System.Security.Cryptography;

	/// <summary>
	/// Used to create a hash code which can be stored in database.
	/// </summary>
    [Serializable]
	public sealed class MD5CryptHelper
    {
		#region constructors 

        /// <summary>
        /// Prevents a default instance of the <see cref="MD5CryptHelper"/> class from being created.
        /// </summary>
        private MD5CryptHelper()
        {
        }

		#endregion constructors 

		#region public methods 

		/// <summary>
		/// Checks the value against hash.
		/// </summary>
		/// <param name="hash">The MD5 hash.</param>
		/// <param name="inputValue">The input value.</param>
        /// <returns><c>true</c> if the passed has and the hash of the input value are equal; otherwise, <c>false</c>.</returns>
		public static bool CheckValueAgainstHash(string hash, string inputValue)
		{
			return ComputeHash(inputValue).Equals(hash);
        }

        /// <summary>
		/// Computes the md5 hash.
		/// </summary>
		/// <param name="value">The value.</param>
		/// <returns>The hash string.</returns>
		public static string ComputeHash(string value)
		{
			// Create the md5 crypt service provider
			MD5 crypt = new MD5CryptoServiceProvider();
			StreamWriter valueWriter = new StreamWriter(new MemoryStream());
            valueWriter.Write(value);
            valueWriter.Flush();

			// Compute the hash code
            valueWriter.BaseStream.Seek(0, SeekOrigin.Begin);
            byte[] cryptHash = crypt.ComputeHash(valueWriter.BaseStream);

			// Convert the result to hex 
			string result = string.Empty;

            for (int i = 0; i < cryptHash.Length; i++)
			{
				byte buff = cryptHash[i];
				result += Convert((long)buff, 16);
			}

			return result;
		}

		#endregion public methods 

		#region private methods 

        /// <summary>
		/// Converts a number into different bases.
		/// </summary>
		/// <param name="dblCount">Value to convert.</param>
		/// <param name="intBaseformat">Numberbase e.x. 16 as Hex.</param>
		/// <returns>Converted number as a string.</returns>
		private static string Convert(long dblCount, int intBaseformat)
		{
			string result = string.Empty;
			int potenz = 1;
			long temp;
			long pow;

            while (dblCount / (long)Math.Pow(intBaseformat, potenz) >= intBaseformat)
            {
                potenz++;
            }

			while (potenz >= 0)
			{
				if (potenz == 0)
				{
					temp = dblCount;
					dblCount = 0;
				}
				else
				{
					pow = (long)Math.Pow(intBaseformat, potenz);
					temp = dblCount / pow;
					dblCount = dblCount - (temp * pow);
				}

                if (temp < 10)
                {
                    result += temp.ToString(CultureInfo.CurrentCulture);
                }
                else
                {
                    result += (char)('A' + (temp - 10));
                }

				potenz--;
			}

            if (string.IsNullOrEmpty(result))
            {
                result = "0";
            }

			return result;
        }

		#endregion private methods 
    }
}