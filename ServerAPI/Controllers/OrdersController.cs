using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;
using ServerAPI.Models.DTO;

namespace ServerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. CREATE ORDER (Tạo đơn hàng)
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (req.Items == null || req.Items.Count == 0)
                {
                    return BadRequest(new { message = "Giỏ hàng trống!" });
                }

                // --- BƯỚC 1: KIỂM TRA KHO CHI TIẾT THEO BIẾN THỂ (SIZE/COLOR) ---
                foreach (var item in req.Items)
                {
                    var variant = await _context.ProductVariants
                        .FirstOrDefaultAsync(v => v.ProductId == item.ProductVariantId 
                                               && v.Size == item.Size 
                                               && v.Color == item.Color);

                    if (variant == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{item.ProductName}' size {item.Size} màu {item.Color} không tồn tại!" });
                    }

                    if (variant.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{item.ProductName}' size {item.Size} chỉ còn lại {variant.StockQuantity} cái. Không đủ hàng!" });
                    }

                    variant.StockQuantity -= item.Quantity;
                }

                await _context.SaveChangesAsync(); 

                // --- BƯỚC 2: TẠO MÃ ĐƠN HÀNG ---
                string prefix = "M"; 
                try 
                {
                    var firstProduct = await _context.Products.FindAsync(req.Items[0].ProductVariantId);
                    if (firstProduct != null && !string.IsNullOrEmpty(firstProduct.Category))
                    {
                        string category = firstProduct.Category;
                        if (category == "Tops") prefix = "A";      
                        else if (category == "Bottoms") prefix = "Q"; 
                    }
                }
                catch { }

                var randomNum = new Random().Next(100000, 999999);
                string generatedCode = $"{prefix}{randomNum}"; 

                // --- BƯỚC 3: LƯU THÔNG TIN ĐƠN HÀNG CHÍNH ---
                var order = new Order
                {
                    UserId = req.UserId,
                    OrderCode = generatedCode, 
                    RecipientName = req.RecipientName,
                    RecipientPhone = req.RecipientPhone,
                    ShippingAddress = req.ShippingAddress,
                    TotalAmount = req.TotalAmount,
                    Status = "Pending", 
                    PaymentMethod = "COD", 
                    CreatedAt = DateTime.Now
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync(); 

                // --- BƯỚC 4: LƯU CHI TIẾT ĐƠN HÀNG (OrderItems) ---
                foreach (var item in req.Items)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductVariantId, 
                        ProductName = item.ProductName,
                        Quantity = item.Quantity,
                        PriceAtPurchase = item.Price,
                        Size = item.Size,
                        Color = item.Color
                    };
                    _context.OrderItems.Add(orderItem);
                }
                await _context.SaveChangesAsync(); 

                await transaction.CommitAsync();

                return Ok(new { 
                    success = true, 
                    orderId = order.Id, 
                    orderCode = generatedCode, 
                    message = "Đặt hàng thành công!" 
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                var errorMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { message = "Lỗi xử lý đơn hàng: " + errorMessage });
            }
        }

        // ==========================================
        // 2. GET ORDER DETAILS (Lấy chi tiết đơn hàng - MỚI THÊM)
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)     // Kèm danh sách món
                .ThenInclude(oi => oi.Product)  // Kèm thông tin sản phẩm (ảnh, tên gốc)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            return Ok(order);
        }

        // ==========================================
        // 3. GET ORDERS BY USER (Lịch sử mua hàng)
        // ==========================================
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUser(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // ==========================================
        // 4. GET ALL ORDERS (Dành cho Admin)
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            return await _context.Orders.OrderByDescending(o => o.CreatedAt).ToListAsync();
        }

        // ==========================================
        // 5. UPDATE STATUS (Cập nhật trạng thái)
        // ==========================================
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã cập nhật trạng thái", data = order });
        }

        // ==========================================
        // 6. DELETE ORDER (Xóa đơn hàng)
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            var items = _context.OrderItems.Where(i => i.OrderId == id);
            _context.OrderItems.RemoveRange(items);

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã xóa đơn hàng" });
        }
    }
}