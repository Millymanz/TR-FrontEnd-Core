namespace TradeRiser.Core.Common
{
    using System;
    using System.Security.Cryptography;
 
    //using TradeRiser.Core.Configuration;

    /// <summary>
    /// Provides RSA encryption and key store integration functions.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Encryptor", Justification = "Matching .NET Framework method names.")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "RSA", Justification = "Matching .NET Framework object names.")]
    public class RSAEncryptor : ICryptoProvider, IDisposable
    {
		#region private fields 

        /// <summary>
        /// The RSA provider.
        /// </summary>
        private RSACryptoServiceProvider rsa;

		#endregion private fields 

		#region constructors 

        /// <summary>
        /// Finalizes an instance of the <see cref="RSAEncryptor"/> class.
        /// </summary>
        ~RSAEncryptor()
        {
            this.Dispose(false);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="RSAEncryptor"/> class.
        /// </summary>
        /// <param name="keyContainer">The key container.</param>
        public RSAEncryptor(string keyContainer)
        {
            CspParameters pars = new CspParameters();
            pars.Flags = CspProviderFlags.UseMachineKeyStore;
            pars.KeyContainerName = keyContainer;

            try
            {
                this.rsa = new RSACryptoServiceProvider(pars);
            }
            catch (CryptographicException ex)
            {
                throw ex;
               //throw new Exception(Resx.Format(CryptographyResources.FailedToCreateCSP, keyContainer), ex);
            }
        }

		#endregion constructors 

		#region properties 

        ///// <summary>
        ///// Gets or sets the configuration.
        ///// </summary>
        ///// <value>
        ///// The configuration.
        ///// </value>
        //public IConfigurationService Configuration
        //{
        //    get;
        //    set;
        //}

		#endregion properties 

		#region public static methods 

        /// <summary>
        /// Checks if the specified key container exists on this machine.
        /// </summary>
        /// <param name="keyContainerName">Name of the key container.</param>
        /// <returns>True if the key container exists; otherwise false.</returns>
        public static bool DoesKeyContainerExist(string keyContainerName)
        {
            Validate.ArgumentNotNullOrEmpty(keyContainerName, "keyContainerName");

            CspParameters pars = new CspParameters();
            pars.KeyContainerName = keyContainerName;
            pars.Flags = CspProviderFlags.UseMachineKeyStore;

            CspKeyContainerInfo info = new CspKeyContainerInfo(pars);
            return info.Accessible;
        }

        /// <summary>
        /// Generates a public private key pair.
        /// </summary>
        /// <returns>An xml representation of the RSA Crypto Service Provider.</returns>
        public static string GeneratePublicPrivateKey()
        {
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            return rsa.ToXmlString(true);
        }

        /// <summary>
        /// Removes the key from container.
        /// </summary>
        /// <param name="keyContainerName">Name of the key container.</param>
        public static void RemoveKeyFromContainer(string keyContainerName)
        {
            Validate.ArgumentNotNullOrEmpty(keyContainerName, "keyContainerName");

            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(CreateCspParameters(keyContainerName));
            rsa.PersistKeyInCsp = false;
            rsa.Clear();
        }

        /// <summary>
        /// Stores the key in a key container with the specified name.
        /// </summary>
        /// <param name="rsaXml">The RSA XML representation.</param>
        /// <param name="keyContainerName">Name of the key container.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "rsa", Justification = "Valid name.")]
        public static void StoreKeyInContainer(string rsaXml, string keyContainerName)
        {
            Validate.ArgumentNotNullOrEmpty(rsaXml, "rsaXml");
            Validate.ArgumentNotNullOrEmpty(keyContainerName, "keyContainerName");

            RSACryptoServiceProvider crypto = new RSACryptoServiceProvider(CreateCspParameters(keyContainerName));
            crypto.FromXmlString(rsaXml);
            crypto.PersistKeyInCsp = true;
        }

		#endregion public static methods 

		#region public methods 

        /// <summary>
        /// Decrypts the specified data.
        /// </summary>
        /// <param name="data">The data to decrypt.</param>
        /// <returns>The decrypted data.</returns>
        public byte[] Decrypt(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");
            return this.rsa.Decrypt(data, true);
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Encrypts the specified data.
        /// </summary>
        /// <param name="data">The data to encrypt.</param>
        /// <returns>The encrypted data.</returns>
        public byte[] Encrypt(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");

            return this.rsa.Encrypt(data, true);
        }

		#endregion public methods 

		#region protected methods 

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposing"><c>True</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                IDisposable rsaToDispose = this.rsa as IDisposable;

                if (rsaToDispose != null)
                {
                    rsaToDispose.Dispose();
                }
            }
        }

		#endregion protected methods 

		#region private static methods 

        /// <summary>
        /// Creates the CSP parameters.
        /// </summary>
        /// <param name="keyContainerName">Name of the key container.</param>
        private static CspParameters CreateCspParameters(string keyContainerName)
        {
            CspParameters pars = new CspParameters();
            pars.KeyContainerName = keyContainerName;
            pars.Flags = CspProviderFlags.UseMachineKeyStore;
            return pars;
        }

		#endregion private static methods 
    }
}
