using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CouponsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/coupons (Lấy danh sách mã)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Coupon>>> GetCoupons()
        {
            return await _context.Coupons.OrderByDescending(c => c.Id).ToListAsync();
        }

        // POST: api/coupons (Tạo mã mới - Đã cập nhật logic)
        [HttpPost]
        public async Task<ActionResult<Coupon>> CreateCoupon(Coupon coupon)
        {
            // 1. Kiểm tra trùng mã
            if (await _context.Coupons.AnyAsync(c => c.Code == coupon.Code))
            {
                return BadRequest(new { message = "Mã giảm giá này đã tồn tại!" });
            }

            // 2. Thiết lập mặc định & Chuẩn hóa
            coupon.Code = coupon.Code.ToUpper(); // Viết hoa hết
            coupon.IsActive = true;
            coupon.UsedCount = 0;

            // LƯU Ý: Ở đây chúng ta KHÔNG gán cứng UsageLimit = 100 nữa.
            // Giá trị UsageLimit và ValidUntil sẽ được lấy từ dữ liệu Frontend gửi lên.
            // Nếu Frontend không gửi ValidUntil, nó sẽ là null (Vĩnh viễn).

            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCoupons", new { id = coupon.Id }, coupon);
        }

        // DELETE: api/coupons/5 (Xóa mã)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null) return NotFound();

            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã xóa mã giảm giá" });
        }
    }
}