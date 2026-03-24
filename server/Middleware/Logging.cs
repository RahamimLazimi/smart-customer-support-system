// Logs each request and response
public class LoggingMiddleware {
    private readonly RequestDelegate _next;

    public LoggingMiddleware(RequestDelegate next) {
        _next = next;
    }

    public async Task Invoke(HttpContext context) {
        Console.WriteLine($"Incoming: {context.Request.Method} {context.Request.Path}");

        Console.WriteLine("Headers:");
        foreach (var header in context.Request.Headers) {
            Console.WriteLine($"{header.Key}: {header.Value}");
        }

        context.Request.EnableBuffering();

        using (var reader = new StreamReader(context.Request.Body, leaveOpen: true)) {
            var body = await reader.ReadToEndAsync();
            Console.WriteLine($"Body: {body}");
            context.Request.Body.Position = 0;
        }

        await _next(context);

        Console.WriteLine($"Outgoing: {context.Response.StatusCode}");
    }
}