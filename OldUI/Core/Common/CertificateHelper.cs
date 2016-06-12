namespace TradeRiser.Core.Common
{
    using System.Security.Cryptography.X509Certificates;

    /// <summary>
    /// Provides functions to help access certificates.
    /// </summary>
    public static class CertificateHelper
    {
        ////#region public static methods 

        /////// <summary>
        /////// Finds the certificates by subject name.
        /////// </summary>
        /////// <param name="subjectName">Certificate subject name.</param>
        /////// <returns>Certificate collection.</returns>
        ////public static X509Certificate2Collection FindBySubjectName(string subjectName)
        ////{
        ////    Validate.ArgumentNotNullOrEmpty(subjectName, "subjectName");

        ////    X509Store certStore = OpenCertificateStore();
        ////    X509Certificate2Collection certificates = certStore.Certificates.Find(X509FindType.FindBySubjectName, subjectName, true);

        ////    return certificates;
        ////}

        /////// <summary>
        /////// Finds the certificate by thumbprint.
        /////// </summary>
        /////// <param name="thumbprint">The certificate thumbprint.</param>
        /////// <returns>The certificate matching the thumprint.</returns>
        ////public static X509Certificate2 FindByThumbprint(string thumbprint)
        ////{
        ////    Validate.ArgumentNotNullOrEmpty(thumbprint, "thumbPrint");

        ////    X509Store certStore = OpenCertificateStore();
        ////    X509Certificate2Collection certificates = certStore.Certificates.Find(X509FindType.FindByThumbprint, thumbprint, true);

        ////    if (certificates.Count == 0)
        ////    {
        ////        return null;
        ////    }
        ////    else
        ////    {
        ////        return certificates[0];
        ////    }
        ////}

        ////#endregion public static methods 

        ////#region private static methods 

        /////// <summary>
        /////// Opens the certificate store.
        /////// </summary>
        ////private static X509Store OpenCertificateStore()
        ////{
        ////    X509Store certStore = new X509Store(StoreLocation.LocalMachine);
        ////    certStore.Open(OpenFlags.OpenExistingOnly | OpenFlags.ReadOnly);

        ////    return certStore;
        ////}

        ////#endregion private static methods 
    }
}
