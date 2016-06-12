namespace TradeRiser.Core.Common
{
    using System;
    using System.IO.Ports;

    /// <summary>
    /// The settings for a policy.
    /// </summary>
    /// <typeparam name="T">The type of the setting the policy holds.</typeparam>
    [Serializable]
    public class PolicySetting<T>
    {
		#region properties 

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="PolicySetting&lt;T&gt;"/> is enabled.
        /// </summary>
        /// <value><c>True</c> if enabled; otherwise, <c>false</c>.</value>
        public bool Enabled { get; set; }

        /// <summary>
        /// Gets or sets the policy name.
        /// </summary>
        /// <value>The name of the policy.</value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the value for the policy.
        /// </summary>
        /// <value>The value for the policy.</value>
        public T Value { get; set; }

		#endregion properties 
    }
}