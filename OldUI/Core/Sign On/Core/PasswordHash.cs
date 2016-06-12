namespace TradeRiser.Core.SignOn
{
    using System;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using TradeRiser.Core.Common;


    public static class PasswordHash
    {
        #region public methods

        /// <summary>
        /// Computes a hash on the given text.
        /// </summary>
        /// <param name="text">The text to perform the hash on.</param>
        /// <returns>A base 64 encoded representation of the hash value.</returns>
        public static string ComputeHash(string text)
        {
            Validate.ArgumentNotNullOrEmpty(text, "text");

            return ComputeHashInternal(text, null);
        }

        /// <summary>
        /// Generates the password.
        /// </summary>
        /// <param name="minLength">Minimum password length.</param>
        /// <param name="minDigits">The minimum number of digits.</param>
        /// <param name="minUpperChars">The minimum number of uppercase chars.</param>
        /// <param name="minLowerChars">The minimim number of lowercase chars.</param>
        /// <returns>The generated random password.</returns>
        public static string GeneratePassword(int minLength, int minDigits, int minUpperChars, int minLowerChars)
        {
            return GeneratePasswordInternal(minLength, minDigits, minUpperChars, minLowerChars);
        }

        /// <summary>
        /// Verifies the hash.
        /// </summary>
        /// <param name="text">The original text to verify.</param>
        /// <param name="hash">The hash to verify against.</param>
        /// <returns>True if the hash of the original text matches the hash value, otherwise false.</returns>
        public static bool VerifyHash(string text, string hash)
        {
            Validate.ArgumentNotNullOrEmpty(text, "text");
            Validate.ArgumentNotNullOrEmpty(hash, "hash");

            return VerifyHashInternal(text, hash);
        }

        #endregion public methods

        #region private methods

        /// <summary>
        /// Computes a hash on the given text.
        /// </summary>
        /// <param name="text">The text to perform the hash on.</param>
        /// <param name="saltBytes">The salt bytes.</param>
        /// <returns>A base 64 encoded representation of the hash value.</returns>
        private static string ComputeHashInternal(string text, byte[] saltBytes)
        {
            if (saltBytes == null)
            {
                // min and max salt sizes
                int minSaltSize = 4;
                int maxSaltSize = 8;

                // random salt size
                Random random = new Random();
                int saltSize = random.Next(minSaltSize, maxSaltSize);
                saltBytes = new byte[saltSize];

                // Initialize a random number generator and fill the salt with cryptographically strong byte values
                RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
                rng.GetNonZeroBytes(saltBytes);
            }

            // plain text to byte array
            byte[] textBytes = Encoding.UTF8.GetBytes(text);

            // array to hold text and salt
            byte[] textWithSaltBytes = new byte[textBytes.Length + saltBytes.Length];

            // Copy text bytes into array
            for (int i = 0; i < textBytes.Length; i++)
            {
                textWithSaltBytes[i] = textBytes[i];
            }

            // Append salt bytes
            for (int i = 0; i < saltBytes.Length; i++)
            {
                textWithSaltBytes[textBytes.Length + i] = saltBytes[i];
            }

            // NOTE: multiple algorithms can be supported here. So use HashAlgorithm. In this instance, only SHA256 is used.
            HashAlgorithm hash = new SHA256Managed();
            byte[] hashBytes = hash.ComputeHash(textWithSaltBytes);

            // array to hold hash and original salt bytes
            byte[] hashWithSaltBytes = new byte[hashBytes.Length + saltBytes.Length];

            // Copy hash bytes into resulting array
            for (int i = 0; i < hashBytes.Length; i++)
            {
                hashWithSaltBytes[i] = hashBytes[i];
            }

            // Append salt bytes to the result.
            for (int i = 0; i < saltBytes.Length; i++)
            {
                hashWithSaltBytes[hashBytes.Length + i] = saltBytes[i];
            }

            // Convert result into a base64-encoded string.
            string hashValue = Convert.ToBase64String(hashWithSaltBytes);

            // Return the result.
            return hashValue;
        }

        /// <summary>
        /// Generates the password.
        /// </summary>
        /// <param name="minLength">Length of the min.</param>
        /// <param name="minNumberOfDigits">The min number of digits.</param>
        /// <param name="minUpperChars">The min upper chars.</param>
        /// <param name="minLowerChars">The min lower chars.</param>
        private static string GeneratePasswordInternal(int minLength, int minNumberOfDigits, int minUpperChars, int minLowerChars)
        {
            byte[] baseBytes = new byte[minLength];

            RandomNumberGenerator rng = RandomNumberGenerator.Create();
            rng.GetBytes(baseBytes);

            // ensure characters in the A-Z, a-z, 0-9 range
            for (int i = 0; i < baseBytes.Length; i++)
            {
                char c = (char)baseBytes[i];

                if (!((c >= 'a' && c <= 'z') ||
                    (c >= 'A' && c <= 'Z') ||
                    (c >= '0' && c <= '9')))
                {
                    if (i % 3 == 0)
                    {
                        baseBytes[i] = (byte)((baseBytes[i] % 9) + 48);
                    }
                    else if (i % 2 == 0)
                    {
                        baseBytes[i] = (byte)((baseBytes[i] % 25) + 65);
                    }
                    else
                    {
                        baseBytes[i] = (byte)((baseBytes[i] % 25) + 97);
                    }
                }
            }

            string basePassword = Encoding.ASCII.GetString(baseBytes);
            byte[] sample = new byte[1];

            // ensure enough digits
            while (basePassword.ToCharArray().Count(a => char.IsDigit(a)) < minNumberOfDigits)
            {
                rng.GetBytes(sample);
                basePassword += (char)((sample[0] % 9) + 48);     // 48 is start of digits in ascii character set
            }

            // ensure enough uppercase characters
            while (basePassword.ToCharArray().Count(a => char.IsUpper(a)) < minUpperChars)
            {
                rng.GetBytes(sample);
                basePassword += (char)((sample[0] % 25) + 65);    // 65 is start of uppercase ascii character set
            }

            // ensure enough lowercase characters
            while (basePassword.ToCharArray().Count(a => char.IsLower(a)) < minLowerChars)
            {
                rng.GetBytes(sample);
                basePassword += (char)((sample[0] % 25) + 97);    // 97 is start of lowercase ascii character set
            }

            return basePassword;
        }

        /// <summary>
        /// Verifies the hash.
        /// </summary>
        /// <param name="text">The original text to verify.</param>
        /// <param name="hash">The hash to verify against.</param>
        /// <returns>True if the hash of the original text matches the hash value, otherwise false.</returns>
        private static bool VerifyHashInternal(string text, string hash)
        {
            // Convert base64-encoded hash value into a byte array.
            byte[] hashWithSaltBytes = Convert.FromBase64String(hash);

            // We must know size of hash (without salt).
            int hashSizeInBits = 256;
            int hashSizeInBytes = hashSizeInBits / 8;

            // Check hash length
            if (hashWithSaltBytes.Length < hashSizeInBytes)
            {
                return false;
            }

            // Allocate array to hold original salt bytes retrieved from hash
            byte[] saltBytes = new byte[hashWithSaltBytes.Length - hashSizeInBytes];

            // Copy salt from the end of the hash to the new array.
            for (int i = 0; i < saltBytes.Length; i++)
            {
                saltBytes[i] = hashWithSaltBytes[hashSizeInBytes + i];
            }

            string expectedHashString = ComputeHashInternal(text, saltBytes);
            return hash == expectedHashString;
        }

        #endregion private methods
    }
}
