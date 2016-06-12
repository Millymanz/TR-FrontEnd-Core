namespace TradeRiser.Core.Logging
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Log configuration section in config file. 
    /// </summary>
    public class LogConfigurationSection : ConfigurationSection
    {
        #region properties

        [ConfigurationProperty("logProviderSettings", DefaultValue = "", IsRequired = true)]
        public string LogProviderSettings
        {
            get
            {
                return this["logProviderSettings"].ToString();
            }

            set
            {
                this["logProviderSettings"] = value;
            }
        }

        [ConfigurationProperty("enableLogging", DefaultValue = "true", IsRequired = false)]
        public bool EnableLogging
        {
            get
            {
                return Convert.ToBoolean(this["enableLogging"]);
            }
            set
            {
                this["enableLogging"] = value;
            }
        }

        [ConfigurationProperty("useWindowsEventLogAsBackup", DefaultValue = "true", IsRequired = false)]
        public bool UseWindowsEventLogAsBackup
        {
            get
            {
                return Convert.ToBoolean(this["useWindowsEventLogAsBackup"]);
            }
            set
            {
                this["useWindowsEventLogAsBackup"] = value;
            }
        }

        #endregion properties 
    }
}
