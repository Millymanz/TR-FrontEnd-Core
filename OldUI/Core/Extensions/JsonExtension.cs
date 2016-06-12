namespace TradeRiser.Core.Extensions
{
    using Newtonsoft.Json.Linq;

    public static class JsonExtension
    {
        public static T GetValue<T>(this JObject value, string token, T defaultValue)
        {
            if (value[token] != null)
            {
                return value.Value<T>(token);
            }

            return defaultValue;
        }
    }
}
