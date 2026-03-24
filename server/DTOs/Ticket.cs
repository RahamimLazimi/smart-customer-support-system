using System.ComponentModel.DataAnnotations;

public class CreateTicketDto {
    [Required]
    public required string Name { get; set; }

    [Required, EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string Description { get; set; }
    public IFormFile? Image { get; set; }

}

public class UpdateTicketDto {
    [Required]
    public required TicketStatus Status { get; set; }
    public string? Resolution { get; set; }
}

