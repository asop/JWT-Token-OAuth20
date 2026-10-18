using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;

using Backend_JWT_Email.Data;
using Backend_JWT_Email.Repositories;
using Backend_JWT_Email.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

var conString 		= builder.Configuration.GetConnectionString("MySQL");
var AllowedOrigins 	= builder.Configuration.GetSection("CORS:AllowedOrigins").Get<string[]>();

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseMySql(conString, ServerVersion.AutoDetect(conString))
);

builder.Services.AddScoped<IBukuRepository, BukuRepository>();
builder.Services.AddScoped<IBukuService, BukuService>();
builder.Services.AddScoped<ILoginRepository, LoginRepository>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddControllers();
	
// *******************************************************************
// Konfigurasi JWT Authentication
//
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey   = Encoding.ASCII.GetBytes(jwtSettings["Secret"] ?? "IniAdalahKunciRahasiaSangatPanjangDanAmanMinimal32Karakter123!@#");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme   = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme      = JwtBearerDefaults.AuthenticationScheme;
    
    // Agar Google tahu ke mana harus menitipkan data session sementara
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; 
})
.AddCookie() // Cookie untuk menampung data dari Google
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer      = true,
        ValidateAudience    = true,
        ValidateLifetime    = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer         = jwtSettings["Issuer"] ?? "MyApp",
        ValidAudience       = jwtSettings["Audience"] ?? "MyAppUsers",
        IssuerSigningKey    = new SymmetricSecurityKey(secretKey)
    };
})
.AddGoogle(googleOptions =>
{
    // Mengambil data dari appsettings.json
    googleOptions.ClientId      = builder.Configuration["Authentication:Google:ClientId"]!;
    googleOptions.ClientSecret  = builder.Configuration["Authentication:Google:ClientSecret"]!;
});
builder.Services.AddAuthorization(); // Mengaktifkan sistem otorisasi
// *******************************************************************

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins(AllowedOrigins ?? Array.Empty<string>())
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var Application		= builder.Build();
Application.UseCors("AllowReactApp");
Application.UseHttpsRedirection();
Application.UseAuthentication();
Application.UseAuthorization();

// Middleware kustom header Global
Application.Use(async (context, next) =>
{
    context.Response.Headers["X-Powered-By"]        = "ASP.NET Core";
	context.Response.Headers["X-NET-SDK-Version"]   = "9.0.318";
	context.Response.Headers["X-MySQL-Version"]     = "8.0.30";
    context.Response.Headers["X-Project-Name"]      = "Backend-JWT-EMailLogin";
	context.Response.Headers["X-Project-Version"]   = "1.3.0.0";

    await next();
});

Application.MapControllers();
Application.Run();