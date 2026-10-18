using Backend_JWT_Email.Models.DTOs;
using Backend_JWT_Email.Models.Entities;

namespace Backend_JWT_Email.Repositories;
public interface ILoginRepository
{
    Task<Login?> GetUserLoginAsync(string usr, string pwd);
    Task CreateUserFromGoogleAsync(Login data);
}