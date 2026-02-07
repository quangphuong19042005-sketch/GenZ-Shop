using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH ROLE
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles.ToListAsync();
            return Ok(new { success = true, roles });
        }

        // 2. TẠO ROLE MỚI
        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] AppRole role)
        {
            // Kiểm tra trùng tên
            if (await _context.Roles.AnyAsync(r => r.RoleName == role.RoleName))
            {
                return BadRequest(new { message = "Tên quyền này đã tồn tại!" });
            }

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Tạo quyền thành công!" });
        }

        // 3. XÓA ROLE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null) return NotFound();

            // Không cho xóa admin gốc
            if (role.RoleName.ToLower() == "admin") 
                return BadRequest(new { message = "Không thể xóa quyền Admin gốc!" });

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Đã xóa quyền!" });
        }
    }
}