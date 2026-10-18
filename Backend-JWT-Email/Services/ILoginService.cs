using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_JWT_Email.Models.DTOs;

namespace Backend_JWT_Email.Services;
public interface ILoginService
{
    Task<TLoginRespon?> GetUserLoginAsync(string usr, string pwd);
    Task<TLoginRespon> CreateUserFromGoogleAsync(TLoginDTO dto);
}
