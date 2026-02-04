using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình kết nối MySQL (Thay password của bạn vào)
var connectionString = "server=localhost;user=root;password=123456;database=streetwear_db";// Lưu ý: password điền sau dấu bằng, nếu không có pass thì để trống

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// 2. Cấu hình CORS (Cho phép React gọi)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173") // Cổng của React
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddControllers();
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