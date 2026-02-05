using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data; // Thay bằng namespace Data của bạn
using ServerAPI.Models; // Thay bằng namespace Models của bạn

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            // 1. Tổng doanh thu (Chỉ tính đơn đã hoàn thành hoặc Shipping nếu muốn)
            var totalRevenue = await _context.Orders
                .Where(o => o.Status != "Cancelled") 
                .SumAsync(o => o.TotalAmount);

            // 2. Tổng số đơn hàng
            var totalOrders = await _context.Orders.CountAsync();

            // 3. Khách hàng mới (Role là User/Member)
            var totalCustomers = await _context.Users
                .CountAsync(u => u.Role == "member" || u.Role == "user");

            // 4. Sản phẩm sắp hết hàng (Giả sử tổng stock < 10)
            // Lưu ý: Cần join với bảng Variants nếu bạn quản lý kho ở đó
            var lowStockCount = await _context.ProductVariants
                .Where(v => v.StockQuantity < 10)
                .CountAsync();

            // 5. Đơn hàng gần đây (Lấy 5 đơn mới nhất)
            var recentOrders = await _context.Orders
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .Select(o => new {
                    o.Id,
                    o.RecipientName,
                    o.TotalAmount,
                    o.Status,
                    o.CreatedAt
                })
                .ToListAsync();

            // 6. Dữ liệu biểu đồ (Doanh thu 7 ngày gần nhất)
            // Logic: Group by Date
            var today = DateTime.UtcNow.Date;
            var sevenDaysAgo = today.AddDays(-6);
            
            var rawChartData = await _context.Orders
                .Where(o => o.CreatedAt >= sevenDaysAgo && o.Status != "Cancelled")
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new {
                    Date = g.Key,
                    Revenue = g.Sum(o => o.TotalAmount),
                    Orders = g.Count()
                })
                .ToListAsync();

            // Format lại dữ liệu biểu đồ cho Frontend (Đảm bảo đủ 7 ngày kể cả ngày ko có đơn)
            var chartData = Enumerable.Range(0, 7)
                .Select(i => sevenDaysAgo.AddDays(i))
                .Select(date => new {
                    name = date.ToString("dd/MM"), // Tên trục X (VD: 27/01)
                    rev = rawChartData.FirstOrDefault(d => d.Date == date)?.Revenue ?? 0,
                    orders = rawChartData.FirstOrDefault(d => d.Date == date)?.Orders ?? 0
                })
                .ToList();

            return Ok(new
            {
                totalRevenue,
                totalOrders,
                totalCustomers,
                lowStockCount,
                recentOrders,
                chartData
            });
        }
    }
}