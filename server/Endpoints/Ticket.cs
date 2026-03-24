using System.Security.Claims;

using Microsoft.AspNetCore.Mvc;

public static class TicketEndpoints {
    public static void MapTicketEndpoints(this WebApplication app) {

        app.MapGet("/tickets", async (string? status, string? search, TicketService service) => {
            var d = service.Filter(status, search);
            System.Console.WriteLine(d);
            return Results.Ok(service.Filter(status, search));
        }).RequireAuthorization();

        app.MapGet("/tickets/{id}", (Guid id, TicketService service) => {
            Ticket? ticket = service.GetById(id);
            return ticket is null ? Results.NotFound() : Results.Ok(ticket);
        }).RequireAuthorization();

        app.MapPost("/tickets", async ([FromForm] CreateTicketDto dto, TicketService service) => {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Description)) {
                return Results.BadRequest("Invalid data");
            }
            Ticket? ticket = await service.Create(dto);
            return Results.Created($"/tickets/{ticket.Id}", ticket);
        }).DisableAntiforgery();

        app.MapPut("/tickets/{id}", ([FromRoute] Guid id, [FromBody] UpdateTicketDto dto, TicketService service, ClaimsPrincipal user) => {
            if (!user.IsInRole("Admin"))
                return Results.Forbid();

            service.Update(id, dto);
            return Results.NoContent();
        })
        .RequireAuthorization();

        app.MapDelete("/tickets/{id}", (Guid id, TicketService service, ClaimsPrincipal user) => {
            if (!user.IsInRole("Admin"))
                return Results.Forbid();

            var deleted = service.Delete(id);

            return deleted ? Results.NoContent() : Results.NotFound();
        })
.RequireAuthorization();
    }
}