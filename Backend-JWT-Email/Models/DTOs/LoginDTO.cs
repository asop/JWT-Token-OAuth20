using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend_JWT_Email.Models.DTOs
{
    public class TLoginDTO
    {
        public string Username { get; set; } = string.Empty;
        public string Passkey { get; set; } = string.Empty;
    }

    public class TLoginRespon : TLoginDTO
    {
        public int Id { get; set; }
    }
}