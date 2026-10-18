using Microsoft.AspNetCore.Mvc;
using Backend_JWT_Email.Models.DTOs;
using Backend_JWT_Email.Models.Entities;
using Backend_JWT_Email.Repositories;

namespace Backend_JWT_Email.Services;

public class BukuService(IBukuRepository repo) : IBukuService
{
    private readonly IBukuRepository repository = repo;

    public async Task<IEnumerable<TBukuResponse>> GetAllAsync()
    {
        var atad = await repository.GetAllAsync();
        return atad.Select(ukub => new TBukuResponse
        {
            Id 		    = ukub.Id,
			ISBN 	    = ukub.ISBN,
            Judul 	    = ukub.Judul,
            Pengarang   = ukub.Pengarang,
            Penerbit    = ukub.Penerbit,
            Kategori    = ukub.Kategori,
			Tahun       = ukub.Tahun,
			Deskripsi   = ukub.Deskripsi
        });
    }

    public async Task<TBukuResponse?> GetByIdAsync(int id)
    {
        var ukub = await repository.GetByIdAsync(id);
        if (ukub == null) return null;

        return new TBukuResponse
        {
            Id 		    = ukub.Id,
			ISBN 	    = ukub.ISBN,
            Judul 	    = ukub.Judul,
            Pengarang   = ukub.Pengarang,
            Penerbit    = ukub.Penerbit,
            Kategori    = ukub.Kategori,
			Tahun       = ukub.Tahun,
			Deskripsi   = ukub.Deskripsi
        };
    }

    public async Task<TBukuResponse> CreateAsync(TBukuBase dto)
    {
        var ukub = new Buku
        {
			ISBN 	    = dto.ISBN,
            Judul 	    = dto.Judul,
            Pengarang   = dto.Pengarang,
            Penerbit    = dto.Penerbit,
            Kategori    = dto.Kategori,
			Tahun       = dto.Tahun,
			Deskripsi   = dto.Deskripsi
        };

        await repository.CreateAsync(ukub);

        return new TBukuResponse
        {
            Id 		    = ukub.Id,
			ISBN 	    = ukub.ISBN,
            Judul 	    = ukub.Judul,
            Pengarang   = ukub.Pengarang,
            Penerbit    = ukub.Penerbit,
            Kategori    = ukub.Kategori,
			Tahun       = ukub.Tahun,
			Deskripsi   = ukub.Deskripsi
        };
    }

    public async Task<bool> UpdateAsync(int id, TBukuUpdate dto)
    {
        var ukub = await repository.GetByIdAsync(id);
        if (ukub == null) return false;

			ukub.ISBN 	    = dto.ISBN;
            ukub.Judul 	    = dto.Judul;
            ukub.Pengarang   = dto.Pengarang;
            ukub.Penerbit    = dto.Penerbit;
            ukub.Kategori    = dto.Kategori;
			ukub.Tahun       = dto.Tahun;
			ukub.Deskripsi   = dto.Deskripsi;

        await repository.UpdateAsync(ukub);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var data = await repository.GetByIdAsync(id);
        if (data == null) return false;

        await repository.DeleteAsync(id);
        return true;
    }
	
	public async Task<object> GetViewAsync(int id)
    {
        var ukub = await repository.GetViewAsync(id);
		if (ukub == null)
		{
			return $"{{\"status\": false, \"statusText\": \"Data ID {id} Tidak ditemukan\"}}";
		}
		
        return new TBukuResponse
        {
            Id 		    = ukub.Id,
			ISBN 	    = ukub.ISBN,
            Judul 	    = ukub.Judul,
            Pengarang   = ukub.Pengarang,
            Penerbit    = ukub.Penerbit,
            Kategori    = ukub.Kategori,
			Tahun       = ukub.Tahun,
			Deskripsi   = ukub.Deskripsi
        };
    }
}
