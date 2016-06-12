namespace TradeRiser.Core.Common.Validation
{
    using System;

    /// <summary>
    /// Provides a library of regular expressions.
    /// </summary>
    public static class RegexLibrary
    {
		#region constants 

        /// <summary>
        /// Regex for validating email addresses.
        /// </summary>
        public const string RegexEmailAddress = @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$";

		#endregion constants 
    }
}
