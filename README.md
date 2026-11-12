### 🚀 Implementasi JSON Web Token & Google Auth(OAuth 2.0) & EF Core(ORM)

<p align="center">
  <img src="Preview/cap1.jpg" alt="Capture 1" width="500">
</p>

<p align="center">
  <img src="Preview/cap2.jpg" alt="Capture 2" width="500">
</p>

<p align="center">
  <img src="Preview/cap3.jpg" alt="Capture 3" width="500">
</p>


### 🔵 JSON Web Token (Frontend)

JWT digunakan untuk autentikasi. Alurnya sederhana: Login -> Dapat Token -> Akses Fitur.

Setelah login berhasil, backend mengirim token. Token tersebut disimpan di frontend, lalu dikirim kembali di setiap request API.
```
const handleLogin = async (e) => {
try {
  const response = await api.post('/auth/login', { username, passkey: password });      
  const token = response.data.token || response.data.Token;
  if (token) {
  Simpan Token(Tiket)
  ..
  navigate('/dashboard');
  ..
  
```	  

### 🔵 JSON Web Token (Backend)

Endpoint login ada di `ApiController` pada sisi backend. Endpoint ini memvalidasi user dan menerbitkan token JWT.
```	 
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] TLoginDTO dtoModel)
	..
```	 

### 🔵 Google Authentication & OAuth 2.0 (Backend)

Google Auth menggunakan protokol OAuth 2.0. User bisa login menggunakan akun Google tanpa perlu membagikan password ke aplikasi ini.

Tersedia 2 endpoint:
- `GET /api/login-google` : Mengarahkan user ke halaman login Google
- `GET /api/google-callback` : Menerima hasil autentikasi dari Google

Endpoint disisi Backend(Server) pada ApiController
```
	// ----------------------------------------------------------
	// Endpoint kesatu
	// Memerintahkan .NET untuk menantang user dengan login Google
	// ----------------------------------------------------------
    [HttpGet("login-google")]
    [AllowAnonymous]
    public IActionResult LoginGoogle()
	..
	
	// ----------------------------------------------------------
	// Endpoint kedua (GoogleCallback)
	// untuk menerima data setelah user sukses login
	// dan mengambil hasil autentikasi dari cookies sementara
	// ----------------------------------------------------------
    [HttpGet("google-callback")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleCallback()
	..
```

### 🔵 CORS (Cross-Origin Resource Sharing)

CORS mengatur apakah frontend boleh mengambil data dari backend yang beda origin/port.

Di proyek ini, frontend berjalan di port 6060, dan backend mengizinkan origin tersebut melalui konfigurasi di `appsettings.json` dan `Program.cs`.


⚙️ **Konfigurasi CORS Backend**
Konfigurasi tambahan untuk alamat CORS pada file *appsettings.json*
```
    "CORS": {
        "AllowedOrigins": [
            "http://localhost:6060"	----> url & port cors frontend
        ]
  },
  ..
```

⚙️ **Konfigurasi CORS Frontend**
Agar alamat port berjalan pada port yang sesuai dengan pemeriksaan **SATPAM** backend, disisi sisi Frontend edit file *package.json* dan tambahkan *--port 6060*
dengan cara seperti ini, saat menjalankan **CLI** aplikasi service frontend *npm start* atau *npm run dev* service akan otomatis berjalan pada port 6060.

```
  ..	
  "scripts": {
    "dev": "vite",
    "start": "vite --port 6060"
  },
  ..
```

⚙️ **Penerapan pada Program.cs**
```  
// Buat izin CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("IzinkanFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Isi dengan alamat detail website browser Anda
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
Application.UseCors("IzinkanFrontend");
..
```

### 🔵 Integrasi EF Core (Backend)

EF Core digunakan sebagai ORM untuk menghubungkan aplikasi C# (.NET Core) ke database MySQL. Dengan EF Core, operasi database dilakukan menggunakan objek C# dan LINQ, tanpa perlu menulis query SQL manual untuk operasi dasar.


### 🔵 Daftar Endpoint API (Backend)

- `GET /api/Verify` : [Authorize] Endpoint untuk verifikasi token yang masih berlaku.


### 🔵 Status Proyek

| RESTful API CRUD | Dalam Pengembangan | 🛠️ In Progress |
