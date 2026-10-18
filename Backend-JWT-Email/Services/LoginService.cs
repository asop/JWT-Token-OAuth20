using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_JWT_Email.Models.DTOs;
using Backend_JWT_Email.Models.Entities;
using Backend_JWT_Email.Repositories;

namespace Backend_JWT_Email.Services;
public class LoginService(ILoginRepository repo): ILoginService
{
    private readonly ILoginRepository repository = repo;
    public async Task<TLoginRespon?> GetUserLoginAsync(string usr, string pwd)
    {
        var data = await repository.GetUserLoginAsync(usr, pwd);
        if (data == null) return null;

        return new TLoginRespon
        {
            Id 		    = data.Id,
            Username    = data.Username,
            Passkey	    = data.Passkey
        };
    }

    public async Task<TLoginRespon> CreateUserFromGoogleAsync(TLoginDTO dto)
    {
        var ukub = new Login
        {
			Username    = dto.Username,
            Passkey	    = dto.Passkey
        };

        await repository.CreateUserFromGoogleAsync(ukub);
        
        return new TLoginRespon
        {
			Username    = ukub.Username,
            Passkey	    = ukub.Passkey
        };
    }    
}
