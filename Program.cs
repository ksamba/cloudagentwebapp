var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/demo", () => new
{
    message = "Hello from ASP.NET Core! Your cloud agent demo is running.",
    framework = ".NET 10",
    timestamp = DateTimeOffset.UtcNow
});

app.MapHealthChecks("/health");

app.Run();
