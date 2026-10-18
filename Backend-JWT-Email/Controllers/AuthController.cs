/*
    Controller ini bertugas mengecek kredensial user dan men-generate token JWT jika valid.
    
    Bruno Request:
    -----------------------------------------------------
    POST http://localhost:5232/api/auth/login
    Body
    {
        "username": "admin",
        "password": "admin"
    }

    GET http://localhost:5232/api/karyawan
    Header
    {
        "Authorization": "Bearer <token dari login>"
    }   


    1. Endpoint untuk memicu login Google
    [HttpGet("login-google")]
    
    2. Endpoint Callback yang akan ditembak otomatis oleh server Google (signin-google)
    [HttpGet("google-callback")]
    
*/

using Backend_JWT_Email.Models.DTOs;
using Backend_JWT_Email.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Options;

namespace Backend_JWT_Email.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IConfiguration cfg, ILoginService srv) : ControllerBase
{
    private readonly IConfiguration config = cfg;
    private readonly ILoginService loginService  = srv;
    private string corsURL = "http://localhost:6060"; //sama dengan appseting.json(AllowedOrigins)

    [HttpGet("login-google")]
    [AllowAnonymous]
    public IActionResult LoginGoogle()
    {       
        // Menentukan ke alamat mana Google harus mengirim data setelah user sukses login
        // di arahkan ke endpoint kedua (GoogleCallback) di bawah ini
        var properties = new AuthenticationProperties 
        { 
            RedirectUri = Url.Action("GoogleCallback") 
        };
        
        // Memerintahkan .NET untuk menantang (Challenge) user dengan login Google
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleCallback()
    {
        // Mengambil hasil autentikasi dari cookies sementara yang dibuat oleh .NET
        var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);        
        if (!result.Succeeded || result.Principal == null)
        {
            return Unauthorized(new { 
                status      = 401,
                statusText  = "Gagal melakukan autentikasi dengan Google."
            });            
        }

        // Membaca data profil user dari akun Google-nya
        var claims      = result.Principal.Identities.FirstOrDefault()?.Claims;
        var Useremail   = claims?.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
        var Username    = claims?.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Name)?.Value;

        if( Username == null || Useremail == null)
        {   
            return NotFound(new { 
                status      = 404,
                statusText  = "Unknown Google OAuth ID or return from google is null!"
            });
        }
        
        // Cek dulu user dan email didatabase
        var data = await loginService.GetUserLoginAsync(Username, ToMD5(Useremail));
        if (data == null)
        {
            // Data belum ada, Masukan dule ke database
            data = await loginService.CreateUserFromGoogleAsync(
                    new TLoginDTO
                    {
                        Username    = Username,
                        Passkey     = ToMD5(Useremail)
                    });
            if (data == null)return Unauthorized(new { 
                statusText  = $"Insert data baru dari google, ada gangguan! {Username} ({Useremail}",
                status      = 401
            });
        }

        var tokenJwt = GenerateJwtToken(Username);
        return Redirect($"{corsURL}/forms/sukses?uid={Username}&token={tokenJwt}");

        /*return Ok(new { 
            status      = 200,
            statusText  = $"Sukses Login via Google OAuth client! {Username} ({Useremail})", 
            Token       = GenerateJwtToken(Username)
        });*/
    }    

    private static string ToMD5(string data)
    {
        if (string.IsNullOrEmpty(data)) return string.Empty;
        byte[] inputBytes = System.Text.Encoding.UTF8.GetBytes(data);
        byte[] hashBytes = System.Security.Cryptography.MD5.HashData(inputBytes);
        return Convert.ToHexString(hashBytes).ToLower();
    }

    private string GenerateJwtToken(string username)
    {
        var jwtSettings = config.GetSection("JwtSettings");
        var secretKey   = jwtSettings["Secret"] ?? "IniAdalahKunciRahasiaSangatPanjangDanAmanMinimal32Karakter123!@#";
        var Expire      = Convert.ToDouble(jwtSettings["ExpireMinutes"] ?? "60");
        var key         = Encoding.ASCII.GetBytes(secretKey);

        var tokenHandler    = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.NameIdentifier, username)
            }),
            Expires     = DateTime.UtcNow.AddMinutes(Expire),
            Issuer      = jwtSettings["Issuer"] ?? "MyApp",
            Audience    = jwtSettings["Audience"] ?? "MyAppUsers",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    [HttpPost("logintest")]
    [AllowAnonymous]
    public IActionResult LoginTest([FromBody] TLoginDTO dtoModel)
    {
        if (dtoModel.Username == "admin" && dtoModel.Passkey == "admin")
        {
            var tokenString = GenerateJwtToken(dtoModel.Username);
            return Ok(new { 
                statusText  = "Test Login Menggunakan JWT Token Berhasil",
                status      = 200, 
                Message     = "Login Berhasil", 
                Token       = tokenString 
            });
        }

        //return Unauthorized(new { Message = "Username atau password salah!" });
        return Unauthorized(new { 
            statusText  = $"Username atau password tidak sesuai! {dtoModel.Username} dan {dtoModel.Passkey}", 
            status      = 401 
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] TLoginDTO dtoModel)
    {
        var data = await loginService.GetUserLoginAsync(dtoModel.Username, dtoModel.Passkey);
        if (data == null)
        {
            return NotFound(new { 
            statusText  = $"Username or password invalid. {dtoModel.Username}={dtoModel.Passkey}",
            status      = 401, 
            Message     = "Login invalid." 
            });
        }

        var tokenString = GenerateJwtToken(data.Username);
        return Ok(new { 
            statusText  = "Login ke database berhasil.",
            status      = 200, 
            Message     = "Login Sukes.", 
            Token       = tokenString 
        });

    }

    [HttpGet("verify")]
    [Authorize]
    public IActionResult Verify()
    {
        return Ok(new { 
            statusText  = "Token JWT Masih Berlaku", 
            status      = 200 
        });
    }

    
}