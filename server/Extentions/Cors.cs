using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class CorsExtensions {
    public static IServiceCollection AddCustomCors(this IServiceCollection services, IConfiguration config) {
        var origins = GetCorsSettings(config);

        services.AddCors(options => {
            options.AddPolicy("FrontendPolicy", policy => {
                policy
                    .WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    // 🔹 1. Load + validate config
    private static string[] GetCorsSettings(IConfiguration config) {
        var origins = config.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? throw new Exception("Cors settings are missing");

        if (origins.Length == 0 || origins.Any(string.IsNullOrWhiteSpace))
            throw new Exception("Invalid Cors configuration");

        return origins;
    }

    public static IApplicationBuilder UseCustomCors(this IApplicationBuilder app) {
        app.UseCors("FrontendPolicy");
        return app;
    }
}