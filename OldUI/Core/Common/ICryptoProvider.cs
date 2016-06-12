namespace TradeRiser.Core.Common
{
    using System;
    //using TradeRiser.Core.Configuration;

    /// <summary>
    /// Interface for pluggable encryption providers.
    /// </summary>
    public interface ICryptoProvider
    {
        ///// <summary>
        ///// Gets or sets the configuration.
        ///// </summary>
        ///// <value>
        ///// The configuration.
        ///// </value>
        //IConfigurationService Configuration { get; set; }

        /// <summary>
        /// Decrypts the specified data.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <returns>The encrypted data.</returns>
        byte[] Decrypt(byte[] data);

        /// <summary>
        /// Encrypts the specified data.
        /// </summary>
        /// <param name="data">The data.</param>
        /// <returns>The decrypted data.</returns>
        byte[] Encrypt(byte[] data);
    }
}
