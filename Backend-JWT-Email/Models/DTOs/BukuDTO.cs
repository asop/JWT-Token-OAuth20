namespace Backend_JWT_Email.Models.DTOs
{
    public class TBukuBase
    {
		public string ISBN { get; set; } = string.Empty;
        public string Judul { get; set; } = string.Empty;
		public string Pengarang { get; set; }= string.Empty;
        public string Penerbit { get; set; }= string.Empty;
        public string Kategori { get; set; }= string.Empty;
		public int Tahun { get; set; } = 2026;
		public string Deskripsi { get; set; }= string.Empty;
    }

    public class TBukuUpdate: TBukuBase {}

    public class TBukuResponse: TBukuBase
    {
        public int Id { get; set; }
    }
}
