using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.IdentityModel.Tokens;

/* 
    This class is declared as static because it only contains endpoint mapping
    extension methods and does not maintain any instance state.
    Using a static class ensures that it is not instantiated and is used
    purely as a container for organizing related endpoint definitions.
*/
public static class AuthEndpoints {
    public static void MapAuthEndpoints(this WebApplication app) {
        app.MapPost("/auth/login", (LoginDto dto, IConfiguration config, AuthService auth) => {
            var user = auth.Validate(dto.Username, dto.Password);
            if (user == null)
                return Results.Unauthorized();

            var claims = new[] {
                new Claim("name", dto.Username),
                new Claim("role", user.Role)
            };

            var key = config["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
                throw new Exception("JWT key missing");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return Results.Ok(new {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        });
    }
}