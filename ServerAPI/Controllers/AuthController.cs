using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;
using ServerAPI.Models.DTO;
// 👇 1. Đảm bảo đã import thư viện này
using BCrypt.Net; 

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. REGISTER
        // ==========================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            // Check if Username exists
            if (await _context.Users.AnyAsync(u => u.Username == req.Username))
            {
                return BadRequest(new { message = "Username already exists!" });
            }

            // Check if Email exists
            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
            {
                return BadRequest(new { message = "Email is already in use!" });
            }

            // 👇 2. MÃ HÓA MẬT KHẨU TẠI ĐÂY
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            // Create new User
            var user = new User
            {
                Username = req.Username,
                Email = req.Email,
                FullName = req.FullName,
                Phone = req.Phone,
                
                // 👇 3. LƯU MẬT KHẨU ĐÃ MÃ HÓA (KHÔNG LƯU req.Password)
                PasswordHash = passwordHash, 
                
                Role = "member",
                MembershipTier = "Silver",
                LoyaltyPoints = 0,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Registration successful!" });
        }

        // ==========================================
        // 2. LOGIN
        // ==========================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            // Find user by username
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == req.Username);

            // Verify password
            // 👇 4. KIỂM TRA MẬT KHẨU BẰNG HÀM VERIFY (Không dùng so sánh ==)
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Incorrect username or password" });
            }

            // Return user info
            return Ok(new
            {
                success = true,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    role = user.Role,
                    fullName = user.FullName,
                    membershipTier = user.MembershipTier,
                    loyaltyPoints = user.LoyaltyPoints
                }
            });
        }

        // ==========================================
        // 3. UPGRADE VIP
        // ==========================================
        [HttpPost("upgrade-vip/{userId}")]
        public async Task<IActionResult> UpgradeToVip(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound(new { message = "User not found" });

            if (user.MembershipTier == "Silver" || user.MembershipTier == "Member")
            {
                user.MembershipTier = "Gold";
                user.LoyaltyPoints += 500;
                
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                
                return Ok(new { success = true, message = "Welcome to VIP Gold!", newTier = "Gold" });
            }

            return BadRequest(new { message = "You are already a VIP!" });
        }
    }
}