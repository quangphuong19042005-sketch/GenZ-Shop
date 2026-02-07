using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;
using ServerAPI.Models.DTO;
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
            if (await _context.Users.AnyAsync(u => u.Username == req.Username))
            {
                return BadRequest(new { message = "Username already exists!" });
            }

            if (await _context.Users.AnyAsync(u => u.Email == req.Email))
            {
                return BadRequest(new { message = "Email is already in use!" });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

            var user = new User
            {
                Username = req.Username,
                Email = req.Email,
                FullName = req.FullName,
                Phone = req.Phone,
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
        // 2. LOGIN (ĐÃ SỬA: LẤY THÊM PERMISSIONS)
        // ==========================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            // 1. Tìm user
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == req.Username);

            // 2. Check mật khẩu
            if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            {
                return Unauthorized(new { success = false, message = "Incorrect username or password" });
            }

            // 👇👇👇 3. PHẦN QUAN TRỌNG MỚI THÊM: LẤY QUYỀN TỪ BẢNG ROLES 👇👇👇
            string permissions = ""; // Mặc định rỗng

            // Tìm thông tin Role trong bảng Roles (dựa vào user.Role)
            var roleInfo = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == user.Role);
            
            if (roleInfo != null)
            {
                permissions = roleInfo.Permissions; // VD: "orders,products"
            }

            // Nếu là Admin gốc, cấp quyền "all" (full quyền)
            if (user.Role == "admin") 
            {
                permissions = "all";
            }
            // 👆👆👆 KẾT THÚC PHẦN MỚI 👆👆👆

            // 4. Trả về kết quả (Kèm permissions)
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
                    loyaltyPoints = user.LoyaltyPoints,
                    
                    // 👇 Gửi thêm dòng này về Frontend
                    permissions = permissions 
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