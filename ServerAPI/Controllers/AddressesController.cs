using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: Lấy danh sách địa chỉ của User
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<UserAddress>>> GetAddresses(int userId)
        {
            return await _context.UserAddresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault) // Mặc định lên đầu
                .ToListAsync();
        }

        // 2. POST: Thêm địa chỉ mới
        [HttpPost]
        public async Task<ActionResult<UserAddress>> AddAddress(UserAddress address)
        {
            // Nếu user chưa có địa chỉ nào, cái đầu tiên auto là mặc định
            var count = await _context.UserAddresses.CountAsync(a => a.UserId == address.UserId);
            if (count == 0) address.IsDefault = true;

            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = address });
        }

        // 3. DELETE: Xóa địa chỉ
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var address = await _context.UserAddresses.FindAsync(id);
            if (address == null) return NotFound();

            _context.UserAddresses.Remove(address);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        // 4. PUT: Đặt làm mặc định
        [HttpPut("set-default/{id}/user/{userId}")]
        public async Task<IActionResult> SetDefault(int id, int userId)
        {
            // Tìm tất cả địa chỉ của user -> set false hết
            var allAddresses = await _context.UserAddresses.Where(a => a.UserId == userId).ToListAsync();
            foreach (var addr in allAddresses)
            {
                addr.IsDefault = (addr.Id == id); // Chỉ cái được chọn là true
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
    }
}