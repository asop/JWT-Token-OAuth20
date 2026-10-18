using Backend_JWT_Email.Models.DTOs;

namespace Backend_JWT_Email.Services;

public interface IBukuService
{
    Task<IEnumerable<TBukuResponse>> GetAllAsync();
    Task<TBukuResponse?> GetByIdAsync(int id);
    Task<TBukuResponse> CreateAsync(TBukuBase dto);
    Task<bool> UpdateAsync(int id, TBukuUpdate dto);
    Task<bool> DeleteAsync(int id);
	
	Task<object> GetViewAsync(int id);
}
