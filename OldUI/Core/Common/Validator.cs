namespace TradeRiser.Core.Common
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Reflection;

    /// <summary>
    /// Provides validation functions.
    /// </summary>
    public static class Validator
    {
		#region public static methods 

        /// <summary>
        /// Determines whether the specified item is valid.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="item">The item.</param>
        /// <returns>
        ///   <c>true</c> if the specified item is valid; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsValid<T>(T item)
        {
            return !Validator.Validate(item).Any();
        }

        /// <summary>
        /// Validates the specified item.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="item">The item.</param>
        /// <returns>Collection of validation errors.</returns>
        public static IEnumerable<ValidationError> Validate<T>(T item)
        {
            List<ValidationError> validationErrors = new List<ValidationError>();

            // Get list of properties from validationModel
            var props = typeof(T).GetProperties();

            // Perform validation on each property
            foreach (var prop in props)
            {
                ValidateProperty(validationErrors, item, prop);
            }

            return validationErrors;
        }

		#endregion public static methods 

		#region private static methods 

        /// <summary>
        /// Validates the property.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="validationErrors">The validation errors.</param>
        /// <param name="item">The item.</param>
        /// <param name="property">The property.</param>
        private static void ValidateProperty<T>(List<ValidationError> validationErrors, T item, PropertyInfo property)
        {
            // Get list of validator attributes
            var validators = property.GetCustomAttributes(typeof(ValidationAttribute), true);
            foreach (ValidationAttribute validator in validators)
            {
                ValidateValidator(validationErrors, item, property, validator);
            }
        }

        /// <summary>
        /// Validates the validator.
        /// </summary>
        /// <typeparam name="T">The type.</typeparam>
        /// <param name="validationIssues">The validation issues.</param>
        /// <param name="item">The item.</param>
        /// <param name="property">The property.</param>
        /// <param name="validator">The validator.</param>
        private static void ValidateValidator<T>(List<ValidationError> validationIssues, T item, PropertyInfo property, ValidationAttribute validator)
        {
            var value = property.GetValue(item, null);
            if (!validator.IsValid(value))
            {
                validationIssues.Add(new ValidationError(property.Name, value, validator.ErrorMessage));
            }
        }

		#endregion private static methods 
    }
}
