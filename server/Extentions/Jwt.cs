using System.Text;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

public static class JwtExtensions {
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config) {
        var jwtSettings = GetJwtSettings(config);
        var (key, issuer, audience) = jwtSettings;

        var keyBytes = Encoding.UTF8.GetBytes(key);

        services.AddAuthentication(ConfigureAuthentication)
                .AddJwtBearer("Bearer", options => ConfigureJwtBearer(options, keyBytes, issuer, audience));

        return services;
    }

    // 🔹 1. Load + validate config
    private static JwtSettings GetJwtSettings(IConfiguration config) {
        var settings = config.GetSection("Jwt").Get<JwtSettings>()
            ?? throw new Exception("Jwt settings are missing");

        var (key, issuer, audience) = settings;

        if (new[] { key, issuer, audience }.Any(string.IsNullOrWhiteSpace))
            throw new Exception("Invalid Jwt configuration");

        return settings;
    }

    // 🔹 2. Authentication scheme config
    private static void ConfigureAuthentication(AuthenticationOptions options) {
        options.DefaultAuthenticateScheme = "Bearer";
        options.DefaultChallengeScheme = "Bearer";
    }

    // 🔹 3. Jwt bearer config
    private static void ConfigureJwtBearer(
        JwtBearerOptions options,
        byte[] keyBytes,
        string issuer,
        string audience) {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
        };

        options.Events = new JwtBearerEvents {
            OnAuthenticationFailed = HandleAuthenticationFailed,
            OnChallenge = HandleChallenge
        };
    }

    // 🔹 4. Events handlers
    private static Task HandleAuthenticationFailed(AuthenticationFailedContext context) {
        context.Response.StatusCode = 401;
        context.Response.ContentType = "application/json";

        return context.Response.WriteAsJsonAsync(new {
            error = "Authentication failed",
            details = context.Exception.Message
        });
    }

    private static Task HandleChallenge(JwtBearerChallengeContext context) {
        context.HandleResponse();

        context.Response.StatusCode = 401;
        context.Response.ContentType = "application/json";

        return context.Response.WriteAsJsonAsync(new {
            error = "Unauthorized",
            message = "You must provide a valid JWT token"
        });
    }
}