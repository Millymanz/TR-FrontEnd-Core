namespace TradeRiser.Core.Logging
{
	/// <summary>
	/// Configuration Provider.
	/// </summary>
	public class ConfigurationProvider
	{
		#region private fields 

		/// <summary>
		/// Configuration object.
		/// </summary>
		private static LogConfigurationSection config;

		/// <summary>
		/// The lock object for the config.
		/// </summary>
		private static object configLock = new object();

		/// <summary>
		/// Element name in config file.
		/// </summary>
		private static string sectionName = "log";

		#endregion private fields 

		#region properties 

		/// <summary>
		/// Gets or sets the name of the section.
		/// </summary>
		/// <value>
		/// The name of the section.
		/// </value>
		public static string SectionName
		{
			get { return ConfigurationProvider.sectionName; }
			set { ConfigurationProvider.sectionName = value; }
		}

		#endregion properties 

		#region public static methods 

		/// <summary>
		/// Gets the configuration settings.
		/// </summary>
		/// <returns>Configuration Settings.</returns>
		public static LogConfigurationSection GetConfigurationSettings()
		{
			try
			{
				lock (ConfigurationProvider.configLock)
				{
					ConfigurationProvider.config = System.Configuration.ConfigurationManager.GetSection(ConfigurationProvider.SectionName) as LogConfigurationSection;
					if (ConfigurationProvider.config == null)
					{
						ConfigurationProvider.config = ConfigurationProvider.GetDefaultConfig();
					}
				}
			}
			catch
			{
				// cannot read logging config, default to a disabled version
				lock (ConfigurationProvider.configLock)
				{
					ConfigurationProvider.config = ConfigurationProvider.GetDefaultConfig();
				}
			}

			return ConfigurationProvider.config;
		}

		#endregion public static methods 

		#region private static methods 

		/// <summary>
		/// Gets a default config setting with everything turned off.
		/// </summary>
		/// <returns>A default config setting with everything turned off.</returns>
		private static LogConfigurationSection GetDefaultConfig()
		{
			LogConfigurationSection element = new LogConfigurationSection()
			{
				EnableLogging = true,
                LogProviderSettings = string.Empty,
                UseWindowsEventLogAsBackup = true
			};

			return element;
		}

		#endregion private static methods 
	}
}
