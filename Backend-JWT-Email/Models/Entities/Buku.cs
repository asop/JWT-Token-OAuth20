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

public class Buku
{
	public int Id { get; set; }
	
	[StringLength(25)]
	public string ISBN { get; set; } = string.Empty;
	
	[StringLength(32)]
	public string Judul { get; set; } = string.Empty;
	
	[StringLength(32)]
	public string Pengarang { get; set; }= string.Empty;
	
	[StringLength(32)]
	public string Penerbit { get; set; }= string.Empty;
	public string Kategori { get; set; }= string.Empty;
	
	public int Tahun { get; set; }= 2026;
	
	[StringLength(50)]
	public string Deskripsi { get; set; }= string.Empty;
}