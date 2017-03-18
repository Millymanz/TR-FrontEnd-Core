namespace TradeRiser.Core.Common
{
    public interface ICryptoProvider
    {
        byte[] Decrypt(byte[] data);

        byte[] Encrypt(byte[] data);
    }
}
 