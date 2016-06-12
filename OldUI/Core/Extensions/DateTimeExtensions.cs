namespace TradeRiser.Core.Extensions
{
    using System;
    using System.Text;
   // using NodaTime;

    /// <summary>
    /// The CPF display modes for a DateTime object.
    /// </summary>
    public enum DateTimeDisplay
    {
        /// <summary>
        /// Show the date and the time.
        /// </summary>
        DateTime,

        /// <summary>
        /// Show the date.
        /// </summary>
        Date,

        /// <summary>
        /// Show the time.
        /// </summary>
        Time,

        /// <summary>
        /// Shows the time with seconds.
        /// </summary>
        TimeWithSeconds,

        /// <summary>
        /// Shows the date and time with seconds
        /// </summary>
        DateTimeWithSeconds
    }

    /// <summary>
    /// Extensions for the DateTime class.
    /// </summary>
    public static class DateTimeExtensions
    {
        #region Public Methods

        /// <summary>
        /// Gets seconds since the epoch for the specified date time.
        /// </summary>
        /// <param name="unixTime">The unix time.</param>
        /// <returns>Time in seconds since 1970.</returns>
        public static DateTime Epoch(this long unixTime)
        {
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return epoch.AddSeconds(unixTime);
        }

        /// <summary>
        /// Gets DateTime represented by the seconds since the epoch.
        /// </summary>
        /// <param name="date">The date.</param>
        public static long Epoch(this DateTime date)
        {
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return Convert.ToInt64((date - epoch).TotalSeconds);
        }

        /// <summary>
        /// TimeSpan in words.
        /// </summary>
        /// <param name="timeSpan">The time span.</param>
        /// <returns>The TimeSpan in words.</returns>
        public static string InWords(this TimeSpan timeSpan)
        {
            string timeValue = "Not Available";

            if (timeSpan.TotalDays >= 7)
            {
                if (Math.Round(timeSpan.TotalDays % 7) > 0 && Math.Round(timeSpan.TotalDays % 7) < 7)
                {
                    StringBuilder date = new StringBuilder();

                    date.Append(string.Format("{0} week{1}, ", Math.Truncate(timeSpan.TotalDays / 7).ToString("N0"), Math.Truncate(timeSpan.TotalDays / 7) > 1 ? "s" : string.Empty));
                    date.Append(string.Format("{0} day{1}", (timeSpan.TotalDays % 7).ToString("N0"), (timeSpan.TotalDays % 7) > 1 ? "s" : string.Empty));

                    return date.ToString();
                }

                return string.Format("{0} week{1}", Math.Round(timeSpan.TotalDays / 7).ToString("N0"), Math.Round(timeSpan.TotalDays / 7) > 1 ? "s" : string.Empty);
            }

            if (timeSpan.TotalHours >= 24)
            {
                if (Math.Round(timeSpan.TotalHours % 24) > 0 && Math.Round(timeSpan.TotalHours % 24) < 24)
                {
                    StringBuilder date = new StringBuilder();

                    date.Append(string.Format("{0} day{1}, ", Math.Truncate(timeSpan.TotalHours / 24).ToString("N0"), Math.Truncate(timeSpan.TotalHours / 24) > 1 ? "s" : string.Empty));
                    date.Append(string.Format("{0} hour{1}", (timeSpan.TotalHours % 24).ToString("N0"), (timeSpan.TotalHours % 24) > 1 ? "s" : string.Empty));

                    return date.ToString();
                }

                return string.Format("{0} day{1}", Math.Round(timeSpan.TotalDays).ToString("N0"), Math.Round(timeSpan.TotalDays) > 1 ? "s" : string.Empty);
            }

            if (timeSpan.TotalMinutes > 60)
            {
                if (Math.Round(timeSpan.TotalMinutes % 60) > 0 && Math.Round(timeSpan.TotalMinutes % 60) < 60)
                {
                    StringBuilder date = new StringBuilder();

                    date.Append(string.Format("{0} hour{1}, ", Math.Truncate(timeSpan.TotalMinutes / 60).ToString("N0"), Math.Truncate(timeSpan.TotalMinutes / 60) > 1 ? "s" : string.Empty));
                    date.Append(string.Format("{0} minute{1}", (timeSpan.TotalMinutes % 60).ToString("N0"), (timeSpan.TotalMinutes % 60) > 1 ? "s" : string.Empty));

                    return date.ToString();
                }

                return string.Format("{0} hour{1}", Math.Round(timeSpan.TotalHours).ToString("N0"), Math.Round(timeSpan.TotalHours) > 1 ? "s" : string.Empty);
            }

            if (timeSpan.TotalSeconds > 60)
            {
                return string.Format("{0} minute{1}", Math.Round(timeSpan.TotalMinutes).ToString("N0"), Math.Round(timeSpan.TotalMinutes) > 1 ? "s" : string.Empty);
            }

            return timeValue;
        }

        /// <summary>
        /// Ins the words.
        /// </summary>
        /// <param name="dateTime">The date time.</param>
        /// <returns></returns>
        public static string TimeAgo(this DateTime dateTime)
        {
            return (DateTime.UtcNow - dateTime).InWords();
        }

        /// <summary>
        /// Formats the date and time to the users local preference.
        /// </summary>
        /// <param name="dateTime">The date time.</param>
        /// <returns>The date and time formatted to the users local preference.</returns>
        public static string ToCpfString(this DateTime dateTime)
        {
            return dateTime.ToCpfString(DateTimeDisplay.DateTime);
        }

        /// <summary>
        /// Formats the date and time to the users local preference.
        /// </summary>
        /// <param name="dateTime">The date time.</param>
        /// <param name="display">The format to display.</param>
        /// <returns>The date and time formatted to the users local preference.</returns>
        public static string ToCpfString(this DateTime dateTime, DateTimeDisplay display)
        {
            string formatted = string.Empty;

            switch (display)
            {
                case DateTimeDisplay.Date:
                    formatted = dateTime.ToShortDateString();
                    break;

                case DateTimeDisplay.Time:
                    formatted = dateTime.ToShortTimeString();
                    break;

                case DateTimeDisplay.TimeWithSeconds:
                    formatted = dateTime.ToLongTimeString();
                    break;

                case DateTimeDisplay.DateTimeWithSeconds:
                    formatted = dateTime.ToShortDateString() + " " + dateTime.ToLongTimeString();
                    break;

                case DateTimeDisplay.DateTime:
                default:
                    formatted = dateTime.ToShortDateString() + " " + dateTime.ToShortTimeString();
                    break;
            }

            return formatted;
        }

        ///// <summary>
        ///// Formats the date and time to the users local preference.
        ///// </summary>
        ///// <param name="dateTime">The date time.</param>
        ///// <param name="display">The format to display.</param>
        ///// <param name="timeZone">The time zone.</param>
        ///// <returns>
        ///// The date and time formatted to the users local preference.
        ///// </returns>
        //public static string ToCpfString(this DateTime dateTime, DateTimeDisplay display, string timeZone)
        //{
        //    DateTime convertedDate = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        //    return convertedDate.ToLocalDateTime(timeZone).ToCpfString(display);
        //}

        ///// <summary>
        ///// Formats the date and time to the users local preference.
        ///// </summary>
        ///// <param name="dateTime">The date time.</param>
        ///// <param name="timeZone">The time zone.</param>
        ///// <returns>The date and time formatted to the users local preference.</returns>
        //public static string ToCpfString(this DateTime dateTime, string timeZone)
        //{
        //    DateTime convertedDate = DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
        //    return convertedDate.ToLocalDateTime(timeZone).ToCpfString();
        //}

        ///// <summary>
        ///// Converts the date to the users local preference.
        ///// </summary>
        ///// <param name="dateTime">The date time.</param>
        ///// <param name="timeZone">The time zone.</param>
        ///// <returns>The date and time according to the users local preference.</returns>
        //public static DateTime ToLocalDateTime(this DateTime dateTime, string timeZone)
        //{
        //    if (!string.IsNullOrWhiteSpace(timeZone) && dateTime != DateTime.MinValue)
        //    {
        //        Instant i = Instant.FromUtc(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour, dateTime.Minute, dateTime.Second);
        //        DateTimeZone userTimeZone = DateTimeZoneProviders.Tzdb[timeZone];
        //        ZonedDateTime dateTimeInUserZone = i.InZone(userTimeZone);
        //        return dateTimeInUserZone.ToDateTimeUnspecified();

        //        //dateTime = TimeZoneInfo.ConvertTimeFromUtc(dateTime, TimeZoneInfo.FindSystemTimeZoneById(timeZone));
        //    }

        //    return dateTime;
        //}

        /////// <summary>
        /////// UTCs to local date time.
        /////// </summary>
        /////// <param name="dateTime">The date time.</param>
        /////// <param name="usersTimezoneId">The users timezone identifier.</param>
        /////// <returns></returns>
        ////public static DateTime UtcToLocalDateTime(this DateTime dateTime, string usersTimezoneId)
        ////{
        ////    IDateTimeZoneProvider timeZoneProvider = DateTimeZoneProviders.Tzdb;

        ////    DateTimeZone utcTimeZone = timeZoneProvider["UTC"];
        ////    DateTime dateTimeFromDb = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, dateTime.Hour, dateTime.Minute, dateTime.Second, dateTime.Millisecond);

        ////    ZonedDateTime zonedDbDateTime = utcTimeZone.AtLeniently(LocalDateTime.FromDateTime(dateTimeFromDb));

        ////    DateTimeZone usersTimezone = timeZoneProvider[usersTimezoneId];

        ////    ZonedDateTime usersZonedDateTime = zonedDbDateTime.WithZone(usersTimezone);

        ////    return usersZonedDateTime.ToDateTimeUnspecified();
        ////}

        ///// <summary>
        ///// Locals to UTC date time.
        ///// </summary>
        ///// <param name="dateTime">The date time.</param>
        ///// <param name="usersTimezoneId">The users timezone identifier.</param>
        ///// <returns></returns>
        //public static DateTime LocalToUtcDateTime(this DateTime dateTime, string usersTimezoneId)
        //{
        //    LocalDateTime localDateTime = LocalDateTime.FromDateTime(dateTime);

        //    IDateTimeZoneProvider timeZoneProvider = DateTimeZoneProviders.Tzdb;
        //    DateTimeZone usersTimezone = timeZoneProvider[usersTimezoneId];

        //    ZonedDateTime zonedDbDateTime = usersTimezone.AtLeniently(localDateTime);
        //    return zonedDbDateTime.ToDateTimeUtc();
        //}

        /// <summary>
        /// Converts a string to a timespan
        /// </summary>
        /// <param name="timeSpan">The timespan string.</param>
        /// <returns>A TimeSpan object or TimeSpan.Zero if the string cannot be parsed.</returns>
        public static TimeSpan ToTimeSpan(this string timeSpan)
        {
            TimeSpan ts;

            return TimeSpan.TryParse(timeSpan, out ts) ? ts : TimeSpan.Zero;
        }

        #endregion Public Methods

        #region Private Methods

        /// <summary>
        /// Gets the days as text.
        /// </summary>
        /// <param name="timeSpan">The time span.</param>
        /// <returns>Days in words.</returns>
        private static string GetDaysAsText(TimeSpan timeSpan)
        {
            if ((timeSpan.TotalDays % 7) >= 1)
            {
                return string.Format("{0} day{1}", Math.Truncate(timeSpan.TotalDays % 7).ToString("N0"), Math.Truncate(timeSpan.TotalDays % 7) > 1 ? "s" : string.Empty);
            }

            return string.Empty;
        }

        /// <summary>
        /// Gets the hours as text.
        /// </summary>
        /// <param name="timeSpan">The time span.</param>
        /// <returns>Hours in words.</returns>
        private static string GetHoursAsText(TimeSpan timeSpan)
        {
            if ((timeSpan.TotalHours % 24) >= 1)
            {
                return string.Format("{0} hour{1}", Math.Truncate(timeSpan.TotalHours % 24).ToString("N0"), Math.Truncate(timeSpan.TotalHours % 24) > 1 ? "s" : string.Empty);
            }

            return string.Empty;
        }

        /// <summary>
        /// Gets the minutes as text.
        /// </summary>
        /// <param name="timeSpan">The time span.</param>
        /// <returns>Minutes in words.</returns>
        private static string GetMinutesAsText(TimeSpan timeSpan)
        {
            if ((timeSpan.TotalMinutes % 60) >= 1)
            {
                return string.Format("{0} minute{1}", Math.Truncate(timeSpan.TotalMinutes % 60).ToString("N0"), Math.Truncate(timeSpan.TotalMinutes % 60) > 1 ? "s" : string.Empty);
            }

            return string.Empty;
        }

        /// <summary>
        /// Gets the week as text.
        /// </summary>
        /// <param name="timeSpan">The time span.</param>
        /// <returns>Weeks in words.</returns>
        private static string GetWeekAsText(TimeSpan timeSpan)
        {
            if ((timeSpan.TotalDays / 7) >= 1)
            {
                return string.Format("{0} week{1}", Math.Truncate(timeSpan.TotalDays / 7).ToString("N0"), Math.Truncate(timeSpan.TotalDays / 7) > 1 ? "s" : string.Empty);
            }

            return string.Empty;
        }

        #endregion Private Methods
    }
}