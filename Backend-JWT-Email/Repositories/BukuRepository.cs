using Microsoft.EntityFrameworkCore;
using Backend_JWT_Email.Data;
using Backend_JWT_Email.Models.Entities;

namespace Backend_JWT_Email.Repositories;

public class BukuRepository(DatabaseContext context) : IBukuRepository
{
    private readonly DatabaseContext dbContext= context;

    public async Task<IEnumerable<Buku>> GetAllAsync()
    {
        return await dbContext.Buku.ToListAsync();
    }

    public async Task<Buku?> GetByIdAsync(int id)
    {
        return await dbContext.Buku.FindAsync(id);
    }

    public async Task CreateAsync(Buku Buku)
    {
        await dbContext.Buku.AddAsync(Buku);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Buku Buku)
    {
        dbContext.Buku.Update(Buku);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var Buku = await dbContext.Buku.FindAsync(id);
        if (Buku != null)
        {
            dbContext.Buku.Remove(Buku);
            await dbContext.SaveChangesAsync();
        }
    }
	
	public async Task<Buku> GetViewAsync(int id)
    {
        var Buku = await dbContext.Buku
			.FromSqlRaw("SELECT * FROM ViewBuku WHERE id = {0}", id)
			.ToListAsync();
		
		var result = Buku.FirstOrDefault();
		if (result == null)
		{
			throw new KeyNotFoundException($"Buku dengan ID {id} tidak ditemukan.");
		}
		return result;
    }
	
	
}