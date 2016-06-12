namespace TradeRiser.Core.Common
{
    using System;
    using System.IO;
    using System.Security.Cryptography;
    

    /// <summary>
    /// Provides symmetric encryption functions.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Encryptor", Justification = "Matching .NET Framework method names.")]
    public class SymmetricEncryptor //: ICryptoProvider
    {
		#region private fields 

        /// <summary>
        /// The symmetric key. 
        /// </summary>
        private byte[] key = null;

        /// <summary>
        /// Encrypted block is INT + IV + INT + DATA.
        /// </summary>
        private const int MinimumEncryptedBlockSize = sizeof(int) + 1 + sizeof(int) + 1;

		#endregion private fields 

		#region properties 

        ///// <summary>
        ///// Gets or sets the configuration.
        ///// </summary>
        ///// <value>
        ///// The configuration.
        ///// </value>
        //public Configuration.IConfigurationService Configuration
        //{
        //    get;
        //    set;
        //}

		#endregion properties 

		#region public static methods 

        /// <summary>
        /// Generates a random key.
        /// </summary>
        /// <returns>
        /// A byte array containing a cryptographically random series of bytes suitable for use as an encryption key.
        /// </returns>
        public static byte[] GenerateRandomKey()
        {
            RijndaelManaged rm = new RijndaelManaged();
            rm.GenerateKey();
            return rm.Key;
        }

		#endregion public static methods 

		#region public methods 

        /////// <summary>
        /////// Decrypts data that has been encrypted with the SymmetricEncryptor.Encrypt() function.
        /////// </summary>
        /////// <param name="data">The data to decrypt.</param>
        /////// <returns>
        /////// The decypted bytes.
        /////// </returns>
        ////public byte[] Decrypt(byte[] data)
        ////{
        ////    Validate.ArgumentNotNull(data, "data");

        ////    return this.DecryptDataInternal(data);
        ////}

        /// <summary>
        /// Encrypts the data with the specified key.
        /// A random IV is used and stored with the encrypted data and can only be decrypted with the SymmetricEncryptor.Decrypt() function.
        /// </summary>
        /// <param name="data">The data to encrypt.</param>
        /// <returns>
        /// The encypted bytes.
        /// </returns>
        public byte[] Encrypt(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");

            return this.EncryptDataInternal(data);
        }

		#endregion public methods 

		#region private methods 

        /////// <summary>
        /////// Decrypts the data internal.
        /////// </summary>
        /////// <param name="data">The data.</param>
        /////// <returns>The encrypted data.</returns>
        ////private byte[] DecryptDataInternal(byte[] data)
        ////{
        ////    if (data.Length <= Hash.HashSizeBytes + MinimumEncryptedBlockSize)
        ////    {
        ////        throw new Exception(CryptographyResources.InvalidDataSize);
        ////    }

        ////    this.GetKey();

        ////    // extract the hash from the front of the block
        ////    byte[] hash = new byte[Hash.HashSizeBytes];
        ////    Array.Copy(data, hash, hash.Length);

        ////    // check the stored hash code against the hash of the remaining data
        ////    byte[] block = new byte[data.Length - hash.Length];
        ////    Array.Copy(data, hash.Length, block, 0, block.Length);

        ////    byte[] blockHash = Hash.ComputeHash(block);

        ////    if (!blockHash.IsEquivalentTo(hash))
        ////    {
        ////        throw new Exception(CryptographyResources.HashFailed);
        ////    }

        ////    // the data is valid, so can safely read the IV and encrypted block
        ////    MemoryStream ms = new MemoryStream(block);
        ////    BinaryReader br = new BinaryReader(ms);

        ////    int initVectorLength = br.ReadInt32();
        ////    byte[] iv = br.ReadBytes(initVectorLength);
        ////    int dataLength = br.ReadInt32();
        ////    byte[] encrypted = br.ReadBytes(dataLength);
        ////    br.Close();

        ////    RijndaelManaged rm = new RijndaelManaged();
            
        ////    byte[] decrypted;

        ////    using (ICryptoTransform dec = rm.CreateDecryptor(this.key, iv))
        ////    {
        ////        decrypted = dec.TransformFinalBlock(encrypted, 0, encrypted.Length);
        ////    }

        ////    return decrypted;
        ////}

        /// <summary>
        /// Encrypts the data internal.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <returns>The encrypted data.</returns>
        private byte[] EncryptDataInternal(byte[] data)
        {
            RijndaelManaged rm = new RijndaelManaged();
            byte[] encrypted;

            this.GetKey();

            using (ICryptoTransform enc = rm.CreateEncryptor(this.key, rm.IV))
            {
                encrypted = enc.TransformFinalBlock(data, 0, data.Length);
            }

            MemoryStream ms = new MemoryStream();
            BinaryWriter bw = new BinaryWriter(ms);
            bw.Write(rm.IV.Length);
            bw.Write(rm.IV);
            bw.Write(encrypted.Length);
            bw.Write(encrypted);
            bw.Close();

            // compute the hash
            byte[] hash = Hash.ComputeHash(ms.ToArray());
            byte[] block = ms.ToArray();

            // attach the hash to the front of the encrypted block
            byte[] results = new byte[hash.Length + block.Length];
            Array.Copy(hash, results, hash.Length);
            Array.Copy(block, 0, results, hash.Length, block.Length);

            return results;
        }

        /// <summary>
        /// Gets the key.
        /// </summary>
        private void GetKey()
        {
            if (this.key == null)
            {
                //if (this.Configuration == null)
                //{
                //    throw new ArgumentNullException("Configuration");
                //}
                //else
                //{
                //    // Get the key from the database.
                //}
            }
        }

		#endregion private methods 
    }
}
