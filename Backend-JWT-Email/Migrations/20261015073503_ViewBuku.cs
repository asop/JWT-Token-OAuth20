/*
	Membuat View & Stored Procedure (File Migrasi)
	--------------------------------------
	dotnet ef migrations add ViewBuku
	dotnet ef migrations add ProcBuku
	dotnet ef database update

	--------------------------------------
	dotnet clean
	dotnet build
	dotnet ef migrations add UpdateLebarKolom
	dotnet ef database update
	
	@REM Atau jika tidak terbaca
	@REM %USERPROFILE%\.dotnet\tools\dotnet-ef migrations add InitialCreate
	@REM %USERPROFILE%\.dotnet\tools\dotnet-ef migrations add ViewBuku
	@REM %USERPROFILE%\.dotnet\tools\dotnet-ef database update    
*/
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend_JWT_Email.Migrations
{
    /// <inheritdoc />
    public partial class ViewBuku : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"CREATE VIEW ViewBuku AS (SELECT * FROM Buku);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW ViewBuku;");
        }
    }
}
