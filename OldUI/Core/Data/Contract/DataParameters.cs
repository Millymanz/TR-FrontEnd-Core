using System;
using System.Collections.Generic;
using System.Text;
using TradeRiser.Core.Data;
namespace TradeRiser.Core.Data
{
      /// <summary>
    /// A class to contain a list of parameters.
    /// </summary>
    public class DataParameters : Dictionary<string, DataParameter>
    {
        #region properties

        public new DataParameter this[string name]
        {
            get
            {
                if (this.ContainsKey(name))
                {
                    return base[name];
                }
                else
                {
                    return null;
                }
            }
        }

        /// <summary>
        /// Gets the signature of this parameter collection.
        /// </summary>
        public string Signature
        {
            get
            {
                if (this.Count == 0)
                {
                    return "NONE";
                }

                StringBuilder builder = new StringBuilder();
                string template = ";{0}={1}";

                foreach (DataParameter parameter in this.Values)
                {
                    builder.AppendFormat(template, parameter.ParameterName, parameter.Value);
                }

                template = builder.ToString();

                return string.IsNullOrEmpty(template) ? template : template.Remove(0, 1);
            }
        }

        #endregion properties

        #region public methods

        public string GetValueAsString(string name)
        {
            return this.GetValue(name) as string;
        }

        public object GetValue(string name)
        {
            return this.ContainsKey(name) ? this[name].Value : null;
        }

        /// <summary>
        /// Adds a new parameter.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="value">The value.</param>
        public void Add(string name, object value)
        {
            base.Add(name, new DataParameter { ParameterName = name, Value = value });
        }

        /// <summary>
        /// Adds the specified name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="value">The value.</param>
        /// <param name="dbType">Type of the db.</param>
        public void Add(string name, object value, System.Data.DbType dbType)
        {
            base.Add(name, new DataParameter { ParameterName = name, Value = value, DbType = dbType });
        }

      
        public DataParameter GetParameter(string name)
        {
            return this.ContainsKey(name) ? this[name] : null;
        }


        public void Add(DataParameter parameter)
        {
            base.Add(parameter.ParameterName, parameter);
        }

        public void AddRange(IEnumerable<DataParameter> parameters)
        {
            foreach (DataParameter dataParameter in parameters)
            {
                base.Add(dataParameter.ParameterName, dataParameter);
            }
        }

        #endregion public methods
    }
}
