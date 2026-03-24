using System.ComponentModel.DataAnnotations;

public class JwtSettings {
    public void Deconstruct(out string key, out string issuer, out string audience) {
        key = Key;
        issuer = Issuer;
        audience = Audience;
    }

    [Required]
    public required string Key { get; set; }
    [Required]
    public required string Issuer { get; set; }
    [Required]
    public required string Audience { get; set; }
}