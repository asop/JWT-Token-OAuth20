using Microsoft.EntityFrameworkCore;
using Backend_JWT_Email.Models.Entities;

namespace Backend_JWT_Email.Data;

public class DatabaseContext : DbContext
{
	/*protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);
		modelBuilder.Entity<Karyawan>(entity =>{      
			entity.ToView("_View"); 
		});
	}

    public DatabaseContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
		optionsBuilder.UseMySql("Server=Server=localhost;Port=3306;Database=backendsql;User=root;Password=;");
        //optionsBuilder.UseSqlServer("Server=LAPTOP\\SQLEXPRESS;Database=BackendProjectDB;Trusted_Connection=True;TrustServerCertificate=True;");

        return new DatabaseContext(optionsBuilder.Options);
    }*/

	public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options){}
    public DbSet<Buku> Buku { get; set; }
	public DbSet<Login> Login { get; set; }

}