namespace TradeRiser.Core.Common
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Reflection;

    public static class Validator
    {
        #region public static methods
        public static bool IsValid<T>(T item)
        {
            return !Validator.Validate(item).Any();
        }

        public static IEnumerable<ValidationError> Validate<T>(T item)
        {
            List<ValidationError> validationErrors = new List<ValidationError>();

            var props = typeof(T).GetProperties();

            foreach (var prop in props)
            {
                ValidateProperty(validationErrors, item, prop);
            }

            return validationErrors;
        }

        #endregion public static methods

        #region private static methods

        private static void ValidateProperty<T>(List<ValidationError> validationErrors, T item, PropertyInfo property)
        {
            var validators = property.GetCustomAttributes(typeof(ValidationAttribute), true);
            foreach (ValidationAttribute validator in validators)
            {
                ValidateValidator(validationErrors, item, property, validator);
            }
        }

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
