public class ErrorHandlingMiddleware {
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next) {
        _next = next;
    }

    public async Task Invoke(HttpContext context) {
        try {
            await _next(context);
        }
        catch (Exception ex) {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var response = new {
                error = new {
                    status = 500,
                    message = ex.Message
                }
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}