using System.Text.Json;
using System.Text.Json.Serialization;

public class TicketStatusConverter : JsonConverter<TicketStatus> {
    public override TicketStatus Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
        var value = reader.GetString();

        return value switch {
            "New" => TicketStatus.New,
            "Open" => TicketStatus.Open,
            "In Progress" => TicketStatus.InProgress,
            "Closed" => TicketStatus.Closed,
            "Resolved" => TicketStatus.Resolved,
            _ => TicketStatus.New
        };
    }

    public override void Write(Utf8JsonWriter writer, TicketStatus value, JsonSerializerOptions options) {
        var stringValue = value switch {
            TicketStatus.New => "New",
            TicketStatus.Open => "Open",
            TicketStatus.InProgress => "In Progress",
            TicketStatus.Closed => "Closed",
            TicketStatus.Resolved => "Resolved",
            _ => "New"
        };

        writer.WriteStringValue(stringValue);
    }
}