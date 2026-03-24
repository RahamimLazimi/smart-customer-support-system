using System.Text.Json.Serialization;

public enum TicketStatus {
    New,
    Open,
    InProgress,
    Closed,
    Resolved
}

public class Ticket {
    [JsonPropertyName("id")]

    public Guid Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    [JsonPropertyName("status")]
    public TicketStatus Status { get; set; } = TicketStatus.New;
    [JsonPropertyName("resolution")]
    public string? Resolution { get; set; }
    [JsonPropertyName("summary")]
    public string? Summary { get; set; }
    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
    [JsonPropertyName("updatedAt")]
    public DateTime UpdatedAt { get; set; }
}