using Backend_JWT_Email.Models.Entities;

namespace Backend_JWT_Email.Repositories;

public interface IBukuRepository
{
    Task<IEnumerable<Buku>> GetAllAsync();
    Task<Buku?> GetByIdAsync(int id);
    Task CreateAsync(Buku buku);
    Task UpdateAsync(Buku buku);
    Task DeleteAsync(int id);
	
	Task<Buku> GetViewAsync(int id);
}