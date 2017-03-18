namespace TradeRiser.Core.Common
{
    using System;
    using System.Security.Cryptography;

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Encryptor", Justification = "Matching .NET Framework method names.")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "RSA", Justification = "Matching .NET Framework object names.")]
    public class RSAEncryptor : ICryptoProvider, IDisposable
    {
        #region private fields

        private RSACryptoServiceProvider rsa;

        #endregion private fields

        #region constructors

        ~RSAEncryptor()
        {
            this.Dispose(false);
        }

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
                throw new Exception(Resx.Format("Failed To Create CSP", keyContainer), ex);
            }
        }

        #endregion constructors

        #region properties

        #endregion properties

        #region public static methods

        public static bool DoesKeyContainerExist(string keyContainerName)
        {
            Validate.ArgumentNotNullOrEmpty(keyContainerName, "keyContainerName");

            CspParameters pars = new CspParameters();
            pars.KeyContainerName = keyContainerName;
            pars.Flags = CspProviderFlags.UseMachineKeyStore;

            CspKeyContainerInfo info = new CspKeyContainerInfo(pars);
            return info.Accessible;
        }

        public static string GeneratePublicPrivateKey()
        {
            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
            return rsa.ToXmlString(true);
        }

        public static void RemoveKeyFromContainer(string keyContainerName)
        {
            Validate.ArgumentNotNullOrEmpty(keyContainerName, "keyContainerName");

            RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(CreateCspParameters(keyContainerName));
            rsa.PersistKeyInCsp = false;
            rsa.Clear();
        }

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

        public byte[] Decrypt(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");
            return this.rsa.Decrypt(data, true);
        }

        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }

        public byte[] Encrypt(byte[] data)
        {
            Validate.ArgumentNotNull(data, "data");

            return this.rsa.Encrypt(data, true);
        }

        #endregion public methods

        #region protected methods

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
