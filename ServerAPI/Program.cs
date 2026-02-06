using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using System.Text.Json.Serialization; // 👈 1. ĐÃ THÊM DÒNG NÀY (Bắt buộc)

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình kết nối MySQL
var connectionString = "server=localhost;user=root;password=123456;database=streetwear_db"; // Kiểm tra lại pass nếu cần

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. Cấu hình CORS (Cho phép React gọi)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Link frontend của bạn
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// 👇 3. QUAN TRỌNG: Cấu hình JSON để chặn lỗi vòng lặp (Fix lỗi 500)
builder.Services.AddControllers().AddJsonOptions(x =>
{
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
// 👆 Thay thế cho dòng builder.Services.AddControllers(); cũ

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp"); // Kích hoạt CORS

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();