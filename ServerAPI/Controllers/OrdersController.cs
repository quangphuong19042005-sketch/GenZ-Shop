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
        // CREATE ORDER (Fixed for Simple Products Table)
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
        {
            // 1. Use Transaction to ensure data integrity
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (req.Items == null || req.Items.Count == 0)
                {
                    return BadRequest(new { message = "Giỏ hàng trống!" });
                }

                // --- STEP 1: CHECK STOCK & DEDUCT QUANTITY ---
                foreach (var item in req.Items)
                {
                    // Find product directly in 'Products' table
                    // Note: item.ProductVariantId is actually the ProductId sent from Frontend
                    var product = await _context.Products.FindAsync(item.ProductVariantId);

                    // A. Check if product exists
                    if (product == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{item.ProductName}' không còn tồn tại (ID cũ). Vui lòng xóa khỏi giỏ và chọn lại." });
                    }

                    // B. Check stock quantity
                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{item.ProductName}' chỉ còn lại {product.StockQuantity} cái. Không đủ hàng!" });
                    }

                    // C. Deduct stock
                    product.StockQuantity -= item.Quantity;
                }

                // Save stock changes to DB first
                await _context.SaveChangesAsync(); 

                // --- STEP 2: GENERATE ORDER CODE (A/Q/M) ---
                string prefix = "M"; 
                try 
                {
                    // Get Category of the first product to determine prefix
                    var firstProduct = await _context.Products.FindAsync(req.Items[0].ProductVariantId);
                    if (firstProduct != null && !string.IsNullOrEmpty(firstProduct.Category))
                    {
                        string category = firstProduct.Category;
                        if (category == "Tops") prefix = "A";      
                        else if (category == "Bottoms") prefix = "Q"; 
                    }
                }
                catch { } // Ignore code generation errors, default to M

                var randomNum = new Random().Next(100000, 999999);
                string generatedCode = $"{prefix}{randomNum}"; 

                // --- STEP 3: SAVE ORDER HEADER ---
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
                await _context.SaveChangesAsync(); // Save Order to generate ID

                // --- STEP 4: SAVE ORDER ITEMS (Key Fix Here) ---
                foreach (var item in req.Items)
                {
                    var orderItem = new OrderItem
                    {
                        OrderId = order.Id,
                        
                        // 👇 IMPORTANT FIX: Map to ProductId, NOT ProductVariantId
                        ProductId = item.ProductVariantId, 
                        
                        ProductName = item.ProductName,
                        Quantity = item.Quantity,
                        PriceAtPurchase = item.Price
                    };
                    _context.OrderItems.Add(orderItem);
                }
                await _context.SaveChangesAsync(); 

                // 5. Commit Transaction
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

        // GET: api/orders/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUser(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        // GET: api/orders (Admin)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            return await _context.Orders.OrderByDescending(o => o.CreatedAt).ToListAsync();
        }

        // PUT: api/orders/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã cập nhật trạng thái", data = order });
        }

        // DELETE: api/orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            // Delete child items first
            var items = _context.OrderItems.Where(i => i.OrderId == id);
            _context.OrderItems.RemoveRange(items);

            // Delete parent order
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đã xóa đơn hàng" });
        }
    }
}