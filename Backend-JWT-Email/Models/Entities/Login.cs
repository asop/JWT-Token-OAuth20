/*
	Jika ada perubahan Lebar kolom
	--------------------------------------
	dotnet clean
	dotnet build
	dotnet ef migrations add UpdateLebarKolom
	dotnet ef database update
	
	@REM Atau jika tidak terbaca
	@REM %USERPROFILE%\.dotnet\tools\dotnet-ef migrations add InitialCreate
	@REM %USERPROFILE%\.dotnet\tools\dotnet-ef migrations add ViewBuku
	@REM %USERPROFILE%\.dotnet\tools\dotnet-ef database update

	Membuat View & Stored Procedure
	--------------------------------------
	dotnet ef migrations add ViewBuku
	dotnet ef migrations add ProcBuku
	dotnet ef database update

*/
using System.ComponentModel.DataAnnotations;

namespace Backend_JWT_Email.Models.Entities;

public class Login
{
	public int Id { get; set; }
	
	[StringLength(32)]
	public string Username { get; set; } = string.Empty;
	
	[StringLength(32)]
	public string Passkey { get; set; } = string.Empty;
}