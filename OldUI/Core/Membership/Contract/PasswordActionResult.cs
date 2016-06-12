namespace TradeRiser.Core.Membership
{
    /// <summary>
    /// Defines the result of attempts to create a new user with a specified password or attempts to change a password.
    /// </summary>
    public enum PasswordActionResult
    {
        /// <summary>
        /// The action cannot be completed as the user does not exist.
        /// </summary>
        FailedUserDoesNotExist,

        /// <summary>
        /// The action cannot be completed as the new password is the same as the old password.
        /// </summary>
        FailedNewPasswordSameAsOldPassword,

        /// <summary>
        /// The action cannot be completed as integrated users cannot perform password operations.
        /// </summary>
        FailedIntegratedUsersCannotChangePassword,

        /// <summary>
        /// The action cannot be completed as the supplied password is not valid for the users account.
        /// </summary>
        FailedIncorrectPassword,

        /// <summary>
        /// The action cannot be completed as the new password is null or an empty string.
        /// </summary>
        FailedNullOrEmptyPolicy,

        /// <summary>
        /// The action cannot be completed as the new password has not met the minimum length policy.
        /// </summary>
        FailedMinimumLengthPolicy,

        /// <summary>
        /// The action cannot be completed as the new password does not have the required number of lowercase characters.
        /// </summary>
        FailedLowercaseCharacterPolicy,

        /// <summary>
        /// The action cannot be completed as the new password does not have the required number of uppercase characters.
        /// </summary>
        FailedUppercaseCharacterPolicy,

        /// <summary>
        /// The action cannot be completed as the new password does not have the required number of digits.
        /// </summary>
        FailedMinimumDigitPolicy,

        /// <summary>
        /// The action cannot be completed as the new password has previously been used.
        /// </summary>
        FailedPasswordAlreadyUsed,

        /// <summary>
        /// The action cannot be completed successfully.
        /// </summary>
        Ok
    }
}
