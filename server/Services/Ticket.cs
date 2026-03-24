using System.Text.Json;
using System.Text.Json.Serialization;

public class TicketService {
    private readonly string _path;
    private readonly IWebHostEnvironment _env;
    private readonly RealEmailService _emailService;
    private readonly object _lock = new();
    private List<Ticket>? _cache;

    private async Task<string> GenerateSummary(string text) {
        return $"Summary: {text.Substring(0, Math.Min(50, text.Length))}";
    }

    private void Save(List<Ticket> tickets) {
        lock (_lock) {
            File.WriteAllText(
                _path,
                JsonSerializer.Serialize(
                    tickets,
                    new JsonSerializerOptions {
                        WriteIndented = true,
                        Converters = { new JsonStringEnumConverter() }
                    }
                )
            );

            _cache = tickets;
        }
    }

    public TicketService(IWebHostEnvironment env, RealEmailService emailService) {
        _env = env;
        _emailService = emailService;

        _path = Path.Combine(_env.ContentRootPath, "Data", "dataset.json");
    }

    private List<Ticket> GetAll() {
        if (_cache != null)
            return _cache;

        lock (_lock) {
            if (_cache == null) {
                var json = File.ReadAllText(_path);

                _cache = JsonSerializer.Deserialize<List<Ticket>>(
                    json,
                    new JsonSerializerOptions {
                        PropertyNameCaseInsensitive = true,
                        Converters =
                        {
                            new TicketStatusConverter()
                        }
                    }
                ) ?? new();
            }
        }

        return _cache;
    }

    public Ticket? GetById(Guid id) {
        return GetAll().FirstOrDefault(t => t.Id == id);
    }

    public List<Ticket> Filter(string? status, string? search) {
        var tickets = GetAll().AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "All") {
            if (Enum.TryParse<TicketStatus>(status, out var parsedStatus)) {
                tickets = tickets.Where(t => t.Status == parsedStatus);
            }
        }

        if (!string.IsNullOrEmpty(search)) {
            tickets = tickets.Where(t =>
                t.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                t.Description.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        return tickets.ToList();
    }

    public async Task<Ticket> Create(CreateTicketDto dto) {
        var tickets = GetAll();

        string? imageUrl = null;

        if (dto.Image != null && dto.Image.Length > 0) {
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}_{dto.Image.FileName}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create)) {
                await dto.Image.CopyToAsync(stream);
            }

            imageUrl = $"/uploads/{fileName}";
        }

        var ticket = new Ticket {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Description = dto.Description,
            Status = TicketStatus.New,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ImageUrl = imageUrl
        };

        ticket.Summary = await GenerateSummary(dto.Description);

        tickets.Add(ticket);
        Save(tickets);
        // Bonus:
        if (_env.IsProduction())
            _emailService.Send(ticket.Email, "Ticket Created", "Your ticket was created");
        return ticket;
    }

    public void Update(Guid id, UpdateTicketDto dto) {
        var tickets = GetAll();
        var ticket = tickets.FirstOrDefault(t => t.Id == id);

        if (ticket == null) return;

        ticket.Status = dto.Status;

        if (!string.IsNullOrWhiteSpace(dto.Resolution))
            ticket.Resolution = dto.Resolution;

        ticket.UpdatedAt = DateTime.UtcNow;
        // BONUS:
        if (_env.IsProduction())
            _emailService.Send(ticket.Email, "Ticket Updated", "Your ticket was updated");
        Save(tickets);
    }

    public bool Delete(Guid id) {
        var tickets = GetAll();
        var ticket = tickets.FirstOrDefault(t => t.Id == id);

        if (ticket == null)
            return false;

        tickets.Remove(ticket);
        Save(tickets);

        return true;
    }
}