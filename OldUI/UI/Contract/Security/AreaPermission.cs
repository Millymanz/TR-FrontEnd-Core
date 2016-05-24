namespace TradeRiser.UI.Security
{
    using System;

    /// <summary>
    /// An Area permission.
    /// </summary>
    public abstract class AreaPermission
    {
        /// <summary>
        /// Gets the ID.
        /// </summary>
        /// <value>The ID.</value>
        public abstract Guid ID { get; }

        /// <summary>
        /// Gets the name of this permission.
        /// </summary>
        /// <value>The name of this permission.</value>
        public abstract string Name { get; }
    }
}