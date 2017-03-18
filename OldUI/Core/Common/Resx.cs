namespace TradeRiser.Core.Common
{
    public class Resx
    {
        public static string Format(string resource, params object[] values)
        {
            if (string.IsNullOrWhiteSpace(resource))
            {
                return string.Empty;
            }

            return string.Format(resource, values);
        }
    }
}
