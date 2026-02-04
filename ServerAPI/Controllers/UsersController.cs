using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        // Lấy danh sách khách hàng + Tổng tiền đã chi tiêu
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            // Kỹ thuật GroupJoin để nối bảng User và Order, sau đó tính tổng tiền
            var users = await _context.Users
                .GroupJoin(
                    _context.Orders,
                    user => user.Id,
                    order => order.UserId,
                    (user, orders) => new
                    {
                        Id = user.Id,
                        FullName = user.FullName ?? user.Username, // Nếu chưa có FullName thì lấy Username
                        Email = user.Email,
                        Phone = user.Phone,
                        Role = user.Role,
                        MembershipTier = user.MembershipTier,
                        LoyaltyPoints = user.LoyaltyPoints,
                        // Tính tổng tiền các đơn hàng của user này
                        TotalSpent = orders.Sum(o => (decimal?)o.TotalAmount) ?? 0
                    }
                )
                .OrderByDescending(u => u.TotalSpent) // Sắp xếp người mua nhiều nhất lên đầu
                .ToListAsync();

            return Ok(users);
        }

        // DELETE: api/users/5 (Xóa khách hàng)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa khách hàng thành công" });
        }
    }
}