using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY TẤT CẢ USER (Chỉ Admin mới xem được)
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            // 👇 Lưu ý: Trong thực tế nên dùng [Authorize(Roles = "admin")]
            // Nhưng nếu bạn chưa cài JWT thì tạm thời xử lý ở frontend
            var users = await _context.Users
                .Select(u => new 
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Role, // Quan trọng: lấy role để xem ai là admin
                    u.Phone
                })
                .ToListAsync();

            return Ok(new { success = true, users });
        }

        // 2. CẤP QUYỀN (Thăng chức / Hạ chức)
        // PUT: api/user/update-role/5
        [HttpPut("update-role/{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleRequest req)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy user" });

            // Cập nhật role mới (admin hoặc member)
            user.Role = req.Role;
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = $"Đã cập nhật quyền thành: {req.Role}" });
        }
    }

    // Class nhận dữ liệu từ React gửi lên
    public class UpdateRoleRequest
    {
        public string Role { get; set; }
    }
}