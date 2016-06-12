namespace TradeRiser.Core.Mail
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Mail;
    using System.Net.Mime;
    using System.Text;
    using TradeRiser.Core.Common;
    using TradeRiser.Core.Configuration;


    /// <summary>
    /// MultipartEmail contains text and HTML messages within
    /// the same email
    /// </summary>
    public class MultipartEmail
    {
        #region private fields

        /// <summary>
        /// The email settings.
        /// </summary>
        private readonly ConfigurationService configuration;

        /// <summary>
        /// Collection of mime types.
        /// </summary>
        private static readonly Dictionary<string, string> MimeTypes = MultipartEmail.InitializeImageMimeTypes();

        #endregion private fields

        #region constructors

        // Used For MultipartEmailTests
        public MultipartEmail(ConfigurationService iConfiguration)
        {
            this.configuration = iConfiguration;
        }

        #endregion constructors

        #region public methods

        /// <summary>
        ///  Adds text and html views to email message
        ///  According to the multipart MIME spec (http://www.w3.org/Protocols/rfc1341/7_2_Multipart.html), 
        ///  the order of the parts is important.
        ///  They should be added in order of low fidelity to high fidelity (so add text first). 
        /// </summary>
        /// <param name="email"></param>
        /// <returns>MailMessage</returns>
        /// <exception cref="NotImplementedException"></exception>
        public MailMessage CreateMultipartEmail(IEmail email)
        {
            Validate.ArgumentNotNull(email, "email");

            MailMessage message = new MailMessage
            {
                From = new MailAddress(email.From, email.FromDisplayName)
            };
            message.To.Add(email.To);
            message.Subject = email.Subject;
            message.SubjectEncoding = Encoding.UTF8;

            // set attachment if defined
            if (email.Attachments.Count > 0)
            {
                // ReSharper disable once LoopCanBePartlyConvertedToQuery
                foreach (EmailAttachment attachment in email.Attachments)
                {
                    message.Attachments.Add(new Attachment(attachment.FullFileName, new ContentType { Name = attachment.FileName, MediaType = attachment.ContentType }));
                }
            }

            MultipartEmail.AddPlainView(email, message);
            //TODO: PA Fix multipart email in outlook 2013
            //this.AddHtmlView(email, message);

            return message;
        }

        #endregion public methods

        #region private methods

        /// <summary>
        /// Builds the text email view
        /// </summary>
        private static void AddPlainView(IEmail email, MailMessage message)
        {
            AlternateView plainView = AlternateView.CreateAlternateViewFromString(email.Message, null, MediaTypeNames.Text.Plain);
            message.AlternateViews.Add(plainView);
        }

        /// <summary>
        /// Builds the HTML email view from the DB stored template
        /// </summary>
        private void AddHtmlView(IEmail email, MailMessage message)
        {
            string htmlTemplate = this.configuration.GetConfigItem("Core.Email.HTML-Template", string.Empty);
            string htmlFooter = this.configuration.GetConfigItem("Core.Email.HTML-Footer", string.Empty);

            if (!string.IsNullOrWhiteSpace(htmlTemplate))
            {
                htmlTemplate = htmlTemplate.Replace("%HEADING%", email.Subject);
                htmlTemplate = htmlTemplate.Replace("%MESSAGE%", email.Message);
                htmlTemplate = htmlTemplate.Replace("%FOOTER%", htmlFooter);

                LinkedResource logo = this.CreateLinkedResource();

                if (logo != null)
                {
                    htmlTemplate = htmlTemplate.Replace("%DISPLAY_IMG%", "block");
                    htmlTemplate = htmlTemplate.Replace("%IMG_SRC%", logo.ContentType.Name);
                }
                else
                {
                    htmlTemplate = htmlTemplate.Replace("%DISPLAY_IMG%", "none");
                }

                AlternateView htmlView = AlternateView.CreateAlternateViewFromString(htmlTemplate, null, MediaTypeNames.Text.Html);

                if (logo != null)
                {
                    htmlView.LinkedResources.Add(logo);
                }

                message.AlternateViews.Add(htmlView);
            }
        }

        /// <summary>
        /// Gets the logo to be embedded in the HTML email
        /// </summary>
        /// <returns>LinkedResource</returns>
        private LinkedResource CreateLinkedResource()
        {
            // Get logo url
            string logoUrl = this.configuration.GetConfigItem("Core.ExternalApplicationAddress", string.Empty) + this.configuration.GetConfigItem("Core.Email.LogoURL", string.Empty);

            if (string.IsNullOrWhiteSpace(logoUrl)) return null;

            string logoName = MultipartEmail.GetImageName(logoUrl);
            string contentType = MultipartEmail.GetContentType(Path.GetExtension(logoUrl));
            MemoryStream memoryStream = MultipartEmail.LoadPictureFromUrl(logoUrl);

            return memoryStream != null ? new LinkedResource(memoryStream, contentType) { ContentType = { Name = logoName }, ContentId = contentType } : null;
        }

        /// <summary>
        /// Creates a memory stream from an image URL
        /// </summary>
        /// <returns>memorystream</returns>
        private static MemoryStream LoadPictureFromUrl(string url)
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    return new MemoryStream(client.DownloadData(url));
                }
            }
            catch (Exception ex)
            {
                Logging.Log.Exception("MultipartEmail", "MultipartEmail.LoadPictureFromURL", ex);
                return null;
            }
        }

        /// <summary>
        /// Gets the type of the content.
        /// </summary>
        /// <param name="resourceName">Name of the resource.</param>
        /// <returns>The content type.</returns>
        private static string GetContentType(string resourceName)
        {
            string extension = resourceName.Substring(resourceName.LastIndexOf('.')).ToLower();
            return MultipartEmail.MimeTypes[extension];
        }

        /// <summary>
        /// Initializes the MIME types.
        /// </summary>
        /// <returns>Dictionary of mime types.</returns>
        private static Dictionary<string, string> InitializeImageMimeTypes()
        {
            Dictionary<string, string> mimes = new Dictionary<string, string>
                {
                    { ".gif", "image/gif" },
                    { ".png", "image/png" },
                    { ".jpg", "image/jpeg" },
                    { ".ico", "image/x-icon" }
                };

            return mimes;
        }

        /// <summary>
        /// Grabs the image name from image url
        /// </summary>
        /// <param name="resourceName">image url</param>
        /// <returns>string</returns>
        private static string GetImageName(string resourceName)
        {
            return resourceName.Split('/').Last();
        }

        #endregion private methods
    }
}