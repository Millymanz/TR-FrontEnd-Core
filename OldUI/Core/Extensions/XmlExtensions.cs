namespace TradeRiser.Core.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Xml.Linq;

    public static class XmlExtensions
    {
        #region public static methods

        /// <summary>
        /// Changes the type of the config item.
        /// </summary>
        /// <typeparam name="T">The type to convert to.</typeparam>
        /// <param name="value">The value.</param>
        public static T ChangeType<T>(string value)
        {
            if (typeof(T).IsEnum)
            {
                try
                {
                    return (T)Enum.Parse(typeof(T), value);
                }
                catch (Exception)
                {
                    throw;
                }
            }
            else
            {
                try
                {
                    return (T)Convert.ChangeType(value, typeof(T), CultureInfo.CurrentCulture);
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Gets the attribute value.
        /// </summary>
        /// <typeparam name="T">The type to return.</typeparam>
        /// <param name="element">The element.</param>
        /// <param name="name">The name.</param>
        public static T GetAttribute<T>(this XElement element, string name)
        {
            return element.GetAttribute<T>(name, default(T));
        }

        /// <summary>
        /// Gets the attribute value.
        /// </summary>
        /// <typeparam name="T">The type to return.</typeparam>
        /// <param name="element">The element.</param>
        /// <param name="name">The name.</param>
        /// <param name="defaultValue">The default value.</param>
        public static T GetAttribute<T>(this XElement element, string name, T defaultValue)
        {
            if (element == null)
            {
                return defaultValue;
            }

            XAttribute attribute = element.Attribute(name);
            if (attribute == null)
            {
                return defaultValue;
            }

            string attributeValue = attribute.Value;

            return ChangeType<T>(attributeValue);
        }

        /// <summary>
        /// Gets the element as a type.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="element">The element.</param>
        /// <param name="name">The name.</param>
        /// <param name="defaultValue">The default value.</param>
        public static T GetElement<T>(this XElement element, XName name, T defaultValue)
        {
            if (element == null)
            {
                return defaultValue;
            }

            XElement child = element.Element(name);
            if (child == null)
            {
                return defaultValue;
            }

            return ChangeType<T>(child.Value);
        }

        /// <summary>
        /// Gets the value of an element as a type.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="element">The element.</param>
        /// <param name="defaultValue">The default value.</param>
        public static T GetValue<T>(this XElement element, T defaultValue)
        {
            if (element == null)
            {
                return defaultValue;
            }

            return ChangeType<T>(element.Value);
        }

        /// <summary>
        /// Gets the elements as a type.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="element">The element.</param>
        /// <param name="name">The name.</param>
        /// <param name="defaultValue">The default value.</param>
        public static List<T> GetElements<T>(this XElement element, XName name, T defaultValue)
        {
            List<T> list = new List<T>();

            if (element == null)
            {
                return list;
            }

            IEnumerable<XElement> children = element.Elements(name);

            if (children != null)
            {
                foreach (XElement child in children)
                {
                    T item = ChangeType<T>(child.Value);
                    list.Add(item);
                }
            }

            return list;
        }
        
        /// <summary>
        /// Determines whether the specified element has a given attribute.
        /// </summary>
        /// <param name="element">The element.</param>
        /// <param name="name">The name of the attribute.</param>
        /// <returns>
        /// 	<c>True</c> if the specified element has the attribute; otherwise, <c>false</c>.
        /// </returns>
        public static bool HasAttribute(this XElement element, string name)
        {
            if (element == null)
            {
                return false;
            }

            XAttribute attribute = element.Attribute(name);
            if (attribute == null)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Determines whether the specified element has a given child element.
        /// </summary>
        /// <param name="element">The element.</param>
        /// <param name="name">The name of the child element.</param>
        /// <returns>
        /// 	<c>True</c> if the specified element has the child element; otherwise, <c>false</c>.
        /// </returns>
        public static bool HasElement(this XElement element, XName name)
        {
            if (element == null)
            {
                return false;
            }

            if (element.Element(name) == null)
            {
                return false;
            }

            return true;
        }

        #endregion public static methods
    }
}
