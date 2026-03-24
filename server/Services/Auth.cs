using System.Text.Json;

public class AuthService {
    private readonly string _path;

    public AuthService(IWebHostEnvironment env) {
        _path = Path.Combine(env.ContentRootPath, "Data", "users.json");
    }
    private List<User>? _cache;
    private readonly object _lock = new();
    public List<User> GetUsers() {
        if (_cache != null)
            return _cache;

        lock (_lock) {
            if (_cache == null) {
                var json = File.ReadAllText(_path);
                _cache = JsonSerializer.Deserialize<List<User>>(json) ?? new();
            }
        }

        return _cache;
    }

    public User? Validate(string username, string password) {
        var users = GetUsers();

        return users?.FirstOrDefault(u =>
            u.Username == username && u.Password == password);
    }
}