using Microsoft.EntityFrameworkCore;
using Backend_JWT_Email.Data;
using Backend_JWT_Email.Models.Entities;

namespace Backend_JWT_Email.Repositories;

public class LoginRepository(DatabaseContext context) : ILoginRepository
{
    private readonly DatabaseContext dbContext= context;
    private static string ToMD5(string data)
    {
        if (string.IsNullOrEmpty(data)) return string.Empty;
        byte[] inputBytes = System.Text.Encoding.UTF8.GetBytes(data);
        byte[] hashBytes = System.Security.Cryptography.MD5.HashData(inputBytes);
        return Convert.ToHexString(hashBytes).ToLower();
    }

    public async Task<Login?> GetUserLoginAsync(string usr, string pwd)
    {
        //
        // FindAsync() ---> Khusus untuk mencari berdasarkan PrimaryKey saja. 
        // Makanya saya pakai FirstOrDefaultAsync()
        //
        string passkey = ToMD5(pwd);
        return await dbContext.Login
            .FromSql($"SELECT * FROM LOGIN WHERE username = {usr} AND passkey = {passkey}")
            .FirstOrDefaultAsync();
        
        // return await dbContext.Login
        //    .FromSql($"SELECT * FROM LOGIN WHERE Username = {usr} AND Passkey = MD5({pwd})")
        //    .FirstOrDefaultAsync();

        // ---------------------------------------------------------------
        // SELECT * FROM LOGIN WHERE Username = {usr} AND Passkey = {pwd}
        // ---------------------------------------------------------------
        // return await dbContext.Login.FirstOrDefaultAsync(
        //    x => x.Username == usr && x.Passkey == pwd);
        // ---------------------------------------------------------------
        
    }	

    public async Task CreateUserFromGoogleAsync(Login data)
    {
        await dbContext.Login.AddAsync(data);
        await dbContext.SaveChangesAsync();
    }    
}