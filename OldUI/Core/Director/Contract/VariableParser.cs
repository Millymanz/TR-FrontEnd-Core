namespace TradeRiser.Core.Director
{
    using System;
    using System.Collections.Generic;
    using System.Text.RegularExpressions;
    using System.Web;
    using Configuration;
   
    using System.IO;


    /// <summary>
    /// Parses string replacing known tokens and function with system values and config items.
    /// </summary>
    [Serializable]
    public class VariableParser
    {
		#region private fields 

        /// <summary>
        /// Build version pattern.
        /// </summary>
        public const string BUILDPATTERNREGEX = @"\$ENV\((Build)\)";
        private static Regex buildPatternRX = null;

        /// <summary>
        /// Ajax timeout pattern.
        /// </summary>
        public const string AJAXTIMEOUTREGEX = @"\$ENV\((AjaxTimeout)\)";
        private static Regex ajaxTimeoutRX = null;

        /// <summary>
        /// Colour pattern.
        /// </summary>
        public const string COLOURREGEX = @"\$ENV\((Accent)\)";
        private static Regex colourRX = null;

        /// <summary>
        /// Application Path pattern.
        /// </summary>
        public const string APPLICATIONPATHREGEX = @"\$ENV\((ApplicationPath)\)";
        private static Regex applicationPathRX = null;

        /// <summary>
        /// Configuration item pattern.
        /// </summary>
        public const string CONFIGPATTERNREGEX = @"(\$CONFIG\('(.+)',.{0,}'(.+)'\))";
        private static Regex configurationPatternRX = null;

        /// <summary>
        /// Culture code pattern.
        /// </summary>
        public const string CULTUREPATTERNREGEX = @"\$ENV\((Culture)\)";
        private static Regex culturePatternRX = null;

        /// <summary>
        /// Forms pattern.
        /// </summary>
        public const string FORMPATTERNREGEX = @"(\$FORM\('(.+)',.{0,}'(.+)'\))";
        private static Regex formPatternRX = null;

        /// <summary>
        /// Pattern for $IN expression.
        /// </summary>
        public const string INEXPRESSIONREGEX = @"\$IN\(.*?,.*?\$\(.*?\)\)";
        private static Regex inExpressionRX = null;

        public const string VALUEEXPRESSIONREGEX = @"\$\((value)\)";
        private static Regex valueExpressionRX = null;

        /// <summary>
        /// Is anonymous pattern.
        /// </summary>
        public const string ISANONPATTERNREGEX = @"\$ENV\((IsAnonymous)\)";
        private static Regex isAnonPatternRX = null;

        /// <summary>
        /// Query string pattern.
        /// </summary>
        public const string QUERYSTRINGPATTERNREGEX = @"(\$QUERYSTRING\('(.+)',.{0,}'(.+)'\))";
        private static Regex queryStringPatternRX = null;

        /// <summary>
        /// Resource pattern.
        /// </summary>
        public const string RESXPATTERNREGEX = @"(\$RESX\('(.+)',.{0,}'(.+)',.{0,}'(.+)'\))";
        private static Regex resxPatternRX = null;

        /// <summary>
        /// Url Encode pattern.
        /// </summary>
        public const string URLENCODEPATTERNREGEX = @"(\$URLENCODE\((.+)\))";
        private static Regex urlEncodePatternRX = null;

        public const string REMOVEEXTENSIONPATTERNREGEX = @"(\$REMOVEEXTENSION\((.+)\))";
        private static Regex removeExtensionPatternRX = null;

        /// <summary>
        /// User display name pattern.
        /// </summary>
        public const string USERDISPLAYPATTERNREGEX = @"\$ENV\((UserDisplayName)\)";
        private static Regex userDisplayPatternRX = null;

        /// <summary>
        /// User ID pattern.
        /// </summary>
        public const string USERIDPATTERNREGEX = @"\$ENV\((UserID)\)";
        private static Regex userIdPatternRX = null;

        /// <summary>
        /// Variable pattern.
        /// </summary>
        public const string VARPATTERNREGEX = @"\$\(([A-Za-z0-9-_.]+)\)";
        private static Regex varPatternRX = null;

        public const string DYNOMODELPATTERNREGEX = @"(\$MODEL\((.+)\))";
        private static Regex dynoModelPatternRX = null;

        /// <summary>
        /// The current director.
        /// </summary>
        private IDirector director;

        ///// <summary>
        ///// The resourcing service.
        ///// </summary>
        //private static readonly ResourcingService ResourcingService = new ResourcingService();

		#endregion private fields 

		#region constructors 

        /// <summary>
        /// Initializes a new instance of the <see cref="VariableParser"/> class.
        /// </summary>
        /// <param name="director">The director.</param>
        public VariableParser(IDirector director)
        {
            this.director = director;

            if (configurationPatternRX == null)
            {
                // Initalise and compile all regular expression classes.
                configurationPatternRX = new Regex(CONFIGPATTERNREGEX, RegexOptions.Compiled);
                buildPatternRX = new Regex(BUILDPATTERNREGEX, RegexOptions.Compiled);
                ajaxTimeoutRX = new Regex(AJAXTIMEOUTREGEX, RegexOptions.Compiled);
                colourRX = new Regex(COLOURREGEX, RegexOptions.Compiled);
                applicationPathRX = new Regex(APPLICATIONPATHREGEX, RegexOptions.Compiled);
                configurationPatternRX = new Regex(CONFIGPATTERNREGEX, RegexOptions.Compiled);
                culturePatternRX = new Regex(CULTUREPATTERNREGEX, RegexOptions.Compiled);
                formPatternRX = new Regex(FORMPATTERNREGEX, RegexOptions.Compiled);
                inExpressionRX = new Regex(INEXPRESSIONREGEX, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Multiline);
                valueExpressionRX = new Regex(VALUEEXPRESSIONREGEX, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.Multiline);
                isAnonPatternRX = new Regex(ISANONPATTERNREGEX, RegexOptions.Compiled);
                queryStringPatternRX = new Regex(QUERYSTRINGPATTERNREGEX, RegexOptions.Compiled);
                resxPatternRX = new Regex(RESXPATTERNREGEX, RegexOptions.Compiled);
                urlEncodePatternRX = new Regex(URLENCODEPATTERNREGEX, RegexOptions.Compiled);
                removeExtensionPatternRX = new Regex(REMOVEEXTENSIONPATTERNREGEX, RegexOptions.Compiled);
                userDisplayPatternRX = new Regex(USERDISPLAYPATTERNREGEX, RegexOptions.Compiled);
                userIdPatternRX = new Regex(USERIDPATTERNREGEX, RegexOptions.Compiled);
                varPatternRX = new Regex(VARPATTERNREGEX, RegexOptions.Compiled);
                dynoModelPatternRX = new Regex(DYNOMODELPATTERNREGEX, RegexOptions.Compiled);
            }
        }

		#endregion constructors 

		#region public methods 

        /// <summary>
        /// Parses the specified value.
        /// </summary>
        /// <param name="value">The value.</param>
        public string Parse(string value)
        {
            return this.Parse(value, null);
        }

        /// <summary>
        /// Parses the specified value.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="variableLookup">The function to return variables.</param>
        public string Parse(string value, Func<string, string> variableLookup)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            // trim an whitespace around the value.
            value = value.Trim();

            // Variables - do this with simple delegates in a minute
            if (variableLookup != null)
            {
                // get conditions for $IN and replace the values in array format
                MatchCollection matchCollection = inExpressionRX.Matches(value);

                foreach (Match m in matchCollection)
                {
                    // inside in function so variable should be js array format
                    string newInExpression = this.SetLookupValues(m.Groups[0].Value, variableLookup, true);
                    value = value.Replace(m.Groups[0].Value, newInExpression);
                }

                value = this.SetLookupValues(value, variableLookup);

                // $value on delegates
                while (valueExpressionRX.IsMatch(value))
                {
                    Match varRegexMatch = valueExpressionRX.Match(value);
                    value = value.Replace(varRegexMatch.Value, variableLookup(varRegexMatch.Value));
                }

                while (dynoModelPatternRX.IsMatch(value))
                {
                    Match varRegexMatch = dynoModelPatternRX.Match(value);
                    value = value.Replace(varRegexMatch.Value, variableLookup(varRegexMatch.Value));
                }
            }

            // User ID
            string userID = "0";
            string userDisplayName = string.Empty;

            // use the director
            if (this.director.User != null)
            {
                userID = this.director.User.UserID.ToString();
                userDisplayName = this.director.User.UserDisplayName;
            }

            string applicationPath = this.director.ApplicationPath;
            string cultureCode = this.director.CultureCode;
            //bool isAnonymous = this.director.IsAnonymousUser;
            string buildVersion = this.director.BuildVersion;

            while (userIdPatternRX.IsMatch(value))
            {
                Match varRegexMatch = userIdPatternRX.Match(value);
                value = value.Replace(varRegexMatch.Value, userID);
            }

            while (userDisplayPatternRX.IsMatch(value))
            {
                Match varRegexMatch = userDisplayPatternRX.Match(value);
                value = value.Replace(varRegexMatch.Value, userDisplayName);
            }
            
            if (string.IsNullOrWhiteSpace(applicationPath) == false)
            {
                // application path
                value = this.Replace(value, applicationPathRX, applicationPath);
            }

            if (string.IsNullOrWhiteSpace(cultureCode) == false)
            {
                // env culture
                value = this.Replace(value, culturePatternRX, cultureCode);
            }

            ////// is anonymous
            ////value = this.Replace(value, isAnonPatternRX, isAnonymous.ToString().ToLower());

            // build version
            if (!string.IsNullOrWhiteSpace(buildVersion))
            {
                value = this.Replace(value, buildPatternRX, buildVersion);
            }

            // URL Encode
            if (value.Contains("&"))
            {
                string[] parts = value.Split('&');
                List<string> parsedParts = new List<string>();
                foreach (string part in parts)
                {
                    parsedParts.Add(this.EncodeUrl(part, variableLookup));
                }

                value = string.Join("&", parsedParts);
            }
            else
            {
                value = this.EncodeUrl(value, variableLookup);
            }

            // remove extension from url virtual path
            while (removeExtensionPatternRX.IsMatch(value))
            {
                Match varRegexMatch = removeExtensionPatternRX.Match(value);
                string key = varRegexMatch.Groups[2].Value.Trim();
                string replaceValue = variableLookup(key).Trim();
                value = value.Replace(varRegexMatch.Value, Path.ChangeExtension(replaceValue, null));
            }

            value = this.ParseFull(value);

            // For multi line new line characters
            value = value.Replace("{\\!n}", Environment.NewLine);

            return value;
        }

        /// <summary>
        /// Parses the full operation for when the IDirector is not null.
        /// </summary>
        /// <param name="value">The value.</param>
        private string ParseFull(string value)
        {
            if (this.director == null)
            {
                return value;
            }

            if (this.director.Configuration != null)
            {
                // ajax timeout
                value = this.Replace(value, ajaxTimeoutRX, this.director.Configuration.GetConfigItem<int>("Core.AjaxTimeout", 600000).ToString());

                // branding colour
                value = this.Replace(value, colourRX, this.director.Configuration.GetConfigItem<string>("Core.Branding.Accent"));
            
                // Resources
                if (this.director.User != null)
                {
                    ////value = this.ParseResx(value);
                }

                // C'onfiguration items
                while (configurationPatternRX.IsMatch(value))
                {
                    // match the pattern
                    Match varRegexMatch = configurationPatternRX.Match(value);
                    string name = varRegexMatch.Groups[2].Value.Trim();
                    string defaultValue = varRegexMatch.Groups[3].Value.Trim();

                    string configValue = this.director.Configuration.GetConfigItem<string>(name, defaultValue);
                   
                    if (configValue == "NULL")
                    {
                        configValue = string.Empty;
                    }

                    value = value.Replace(varRegexMatch.Value, configValue);
                }
            }

            if (this.director.Request != null)
            {
                if (this.director.Request.Querystring != null)
                {
                    // Querystring
                    while (queryStringPatternRX.IsMatch(value))
                    {
                        // match the pattern
                        Match varRegexMatch = queryStringPatternRX.Match(value);
                        string key = varRegexMatch.Groups[2].Value.Trim();
                        string defaultValue = varRegexMatch.Groups[3].Value.Trim();

                        value = value.Replace(varRegexMatch.Value, this.director.Request.Querystring.Get<string>(key, defaultValue));
                    }
                }

                if (this.director.Request.Form != null)
                {
                    // Form
                    while (formPatternRX.IsMatch(value))
                    {
                        // match the pattern
                        Match varRegexMatch = formPatternRX.Match(value);
                        string key = varRegexMatch.Groups[2].Value.Trim();
                        string defaultValue = varRegexMatch.Groups[3].Value.Trim();

                        value = value.Replace(varRegexMatch.Value, this.director.Request.Form.Get<string>(key, defaultValue));
                    }
                }
            }

            return value;
        }

        /////// <summary>
        /////// Parses the specified value.
        /////// </summary>
        /////// <param name="value">The value.</param>
        ////public string ParseResx(string value)
        ////{
        ////    if (string.IsNullOrWhiteSpace(value))
        ////    {
        ////        return string.Empty;
        ////    }

        ////    if (this.director.User == null)
        ////    {
        ////        return string.Empty;
        ////    }

        ////    if (this.director.Configuration != null)
        ////    {
        ////        // Resources
        ////        while (resxPatternRX.IsMatch(value))
        ////        {
        ////            // match the pattern
        ////            Match varRegexMatch = resxPatternRX.Match(value);
        ////            string type = varRegexMatch.Groups[2].Value.Trim();
        ////            string key = varRegexMatch.Groups[3].Value.Trim();
        ////            string defaultValue = varRegexMatch.Groups[4].Value.Trim();
        ////            string cultureName = string.Empty;

        ////            // if User is anonymous (RTI user) use director default culture otherwise use User language code
        ////            if (this.director.IsAnonymousUser)
        ////            {
        ////                cultureName = this.director.CultureCode;
        ////            }
        ////            else
        ////            {
        ////                cultureName = this.director.User.LanguageCode;
        ////            }

        ////            string resxValue = VariableParser.ResourcingService.GetString(type, cultureName, key);

        ////            // if we cant find the resource using the type, key and cultureName we have, lets spit the culture and fall back to a resource using the first part of the culture.
        ////            if (string.IsNullOrWhiteSpace(resxValue) && !string.IsNullOrWhiteSpace(cultureName))
        ////            {
        ////                string[] cultureParts = cultureName.Split('-');
        ////                if (cultureParts.Length == 2)
        ////                { 
        ////                    // We have two parts. Lets use the first part and check for resources.
        ////                    resxValue = VariableParser.ResourcingService.GetString(type, cultureParts[0], key);
        ////                }
        ////            }   

        ////            if (string.IsNullOrWhiteSpace(resxValue))
        ////            {
        ////                resxValue = defaultValue;
        ////            }

        ////            value = value.Replace(varRegexMatch.Value, resxValue);
        ////        }
        ////    }

        ////    return value;
        ////}

        /// <summary>
        /// Parses the specified value with a custom regex.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="regex">The regex.</param>
        /// <param name="variableLookup">The variable lookup.</param>
        public string ParseCustom(string value, Regex regex, Func<string, string> variableLookup)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return string.Empty;
            }

            if (variableLookup != null)
            {
                MatchCollection matchCollection = regex.Matches(value);

                foreach (Match m in matchCollection)
                {
                    string newValue = variableLookup(m.Groups[0].Value);
                    value = value.Replace(m.Groups[0].Value, newValue);
                }
            }

            return value;
        }

		#endregion public methods 

        private string EncodeUrl(string value, Func<string, string> variableLookup)
        {
            while (urlEncodePatternRX.IsMatch(value))
            {
                // check in the variable lookup first
                if (variableLookup != null)
                {
                    Match varRegexMatch = urlEncodePatternRX.Match(value);
                    string key = varRegexMatch.Groups[2].Value.Trim();

                    string replaceValue = variableLookup(key).Trim();
                    replaceValue = HttpUtility.UrlEncode(replaceValue);
                    value = value.Replace(varRegexMatch.Value, replaceValue);
                }
            }

            return value;
        }
        
        #region private methods 

        /// <summary>
        /// Replaces the specified regex match with the given value.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <param name="pattern">The pattern.</param>
        /// <param name="value">The value.</param>
        private string Replace(string target, Regex regex, string value)
        {
            // env culture
            while (regex.IsMatch(target))
            {
                Match varRegexMatch = regex.Match(target);
                target = target.Replace(varRegexMatch.Value, value);
            }

            return target;
        }

        /// <summary>
        /// Sets the lookup values.
        /// </summary>
        /// <param name="inputText">The input text.</param>
        /// <param name="variableLookup">The variable lookup.</param>
        /// <param name="arrayFormat">If set to <c>true</c>, use array format.</param>
        /// <returns>Parsed expression.</returns>
        private string SetLookupValues(string inputText, Func<string, string> variableLookup, bool arrayFormat = false)
        {
            while (varPatternRX.IsMatch(inputText))
            {
                // match the pattern
                Match varRegexMatch = varPatternRX.Match(inputText);

                // get the variable
                string variable = varRegexMatch.Groups[1].Value;

                // set its format
                string literalValue;
                string variableLookupValue = string.IsNullOrEmpty(variableLookup(variable)) ? variableLookup(variable) : variableLookup(variable).Trim();
                if (!arrayFormat)
                {
                    // set value
                    literalValue = variableLookupValue;
                }
                else
                {
                    // set array format and set array with empty string if value is empty or null or ''
                    if (string.IsNullOrEmpty(variableLookupValue) || variableLookupValue == "''")
                    {
                        literalValue = "['']";
                    }
                    else
                    {
                        // variable lookup might might have multiple values
                        // convert it to js array
                        if (variableLookupValue.Contains(","))
                        {
                            string[] items = variableLookupValue.Split(',');
                            List<string> newItems = new List<string>();
                            foreach (string item in items)
                            {
                                newItems.Add("'" + item.Trim() + "'");
                            }

                            literalValue = "[" + string.Join(",", newItems) + "]";
                        }
                        else
                        {
                            // or array with single element
                            literalValue = "['" + variableLookupValue + "']";
                        }
                    }
                }

                inputText = inputText.Replace(varRegexMatch.Value, literalValue);
            }

            return inputText;
        }

		#endregion private methods 
    }
}
