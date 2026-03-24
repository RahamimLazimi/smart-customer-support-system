using System.Text.Json.Serialization;

public class User {
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [JsonPropertyName("role")]
    public string Role { get; set; } = "User";
}