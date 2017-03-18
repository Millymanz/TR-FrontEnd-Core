using System;
using Newtonsoft.Json;

namespace TradeRiser.Core.Data
{
    public class Feedback : IDataBound
    {
        [JsonProperty("id")]
        public Int64 ID { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }

        [JsonProperty("actioned")]
        public bool Actioned { get; set; }

        [JsonProperty("insertDateTime")]
        public DateTime InsertDateTime { get; set; }

        public void Load(IReader reader)
        {
            this.ID = reader.Get<Int64>("ID");
            this.Name = reader.Get<string>("Name");
            this.FirstName = reader.Get<string>("FirstName");
            this.LastName = reader.Get<string>("LastName");
            this.Email = reader.Get<string>("Email");
            this.Message = reader.Get<string>("Message");
            this.Actioned = reader.Get<bool>("Actioned");
            this.InsertDateTime = reader.Get<DateTime>("InsertDateTime");
        }
    }
}