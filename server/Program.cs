using System.Text;
using System.Text.Json.Serialization;

using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Using AddScoped because the service handles request-specific operations
// and should not share state across requests (avoids concurrency issues)
builder.Services.AddScoped<TicketService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<RealEmailService>();
builder.Services.AddCustomCors(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.ConfigureHttpJsonOptions(options =>
    options.SerializerOptions.Converters.Add(new TicketStatusConverter()));

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseStaticFiles();
app.UseCustomCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<LoggingMiddleware>();
app.MapAuthEndpoints();
app.MapTicketEndpoints();
app.Run();