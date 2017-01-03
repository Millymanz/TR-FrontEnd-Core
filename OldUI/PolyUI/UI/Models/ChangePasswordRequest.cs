namespace TradeRiser.UI.Models
{
    using System;
    using Newtonsoft.Json;

    /// <summary>
    /// Change Password Request
    /// </summary>
    public class ChangePasswordRequest
    {
        [JsonProperty("resetToken")]
        public Guid ResetToken { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }

        [JsonProperty("confirmPassword")]
        public string ConfirmPassword { get; set; }
    }
}