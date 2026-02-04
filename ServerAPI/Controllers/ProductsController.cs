using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;
using System.ComponentModel.DataAnnotations; // Dùng để validate

namespace ServerAPI.Controllers
{
    // 1. DTO: Thêm Validate dữ liệu
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
        public string Name { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public decimal Price { get; set; }

        public string Category { get; set; }
        public string? Description { get; set; }
        
        [Range(0, int.MaxValue, ErrorMessage = "Số lượng tồn kho không được âm")]
        public int StockQuantity { get; set; }
        
        public IFormFile? ImageFile { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment; // ✅ Dùng cái này để lấy đường dẫn chuẩn

        public ProductsController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // ==========================================
        // 1. GET ALL
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.OrderByDescending(p => p.Id).ToListAsync();
        }

        // ==========================================
        // 2. GET BY ID
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });
            return product;
        }

        // ==========================================
        // 3. CREATE (Đã thêm IsActive = 1)
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] ProductCreateDto productDto)
        {
            try
            {
                var product = new Product
                {
                    Name = productDto.Name,
                    Price = productDto.Price,
                    Category = productDto.Category,
                    Description = productDto.Description,
                    StockQuantity = productDto.StockQuantity,

                    // 👇 QUAN TRỌNG: Mặc định sản phẩm mới luôn Active (1) để khách mua được ngay
                    // Nếu Model Product.cs của bạn khai báo IsActive là bool thì sửa số 1 thành true
                    IsActive = true
                };

                // Gọi hàm helper để lưu ảnh
                product.ImageUrl = await SaveImage(productDto.ImageFile, productDto.Category);

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }

        // ==========================================
        // 4. UPDATE
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

            try
            {
                existingProduct.Name = productDto.Name;
                existingProduct.Price = productDto.Price;
                existingProduct.Category = productDto.Category;
                existingProduct.Description = productDto.Description;
                existingProduct.StockQuantity = productDto.StockQuantity;

                // Nếu có ảnh mới -> Xóa ảnh cũ & Lưu ảnh mới
                if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
                {
                    DeleteImage(existingProduct.ImageUrl); // ✅ Xóa ảnh cũ đi cho sạch
                    existingProduct.ImageUrl = await SaveImage(productDto.ImageFile, productDto.Category); // ✅ Lưu ảnh mới
                }

                await _context.SaveChangesAsync();
                return Ok(existingProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi cập nhật: " + ex.Message });
            }
        }

        // ==========================================
        // 5. DELETE
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

            try
            {
                DeleteImage(product.ImageUrl); // ✅ Gọi hàm xóa ảnh

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Đã xóa sản phẩm thành công" });
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { success = false, message = "Không thể xóa: Sản phẩm đã có đơn hàng!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi Server: " + ex.Message });
            }
        }

        // ==========================================
        // 👇 CÁC HÀM PHỤ TRỢ (HELPER METHODS) 👇
        // ==========================================

        // Hàm 1: Lưu ảnh và trả về đường dẫn URL
        private async Task<string> SaveImage(IFormFile? imageFile, string category)
        {
            if (imageFile == null || imageFile.Length == 0)
                return "/images/placeholder.png"; // Ảnh mặc định

            // ✅ Validate đuôi file (Bảo mật)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(imageFile.FileName).ToLower();
            if (!allowedExtensions.Contains(extension))
                throw new Exception("Chỉ chấp nhận file ảnh (.jpg, .png, .webp...)");

            // Tạo tên folder chuẩn
            string folderName = "others";
            if (!string.IsNullOrEmpty(category))
                folderName = category.ToLower().Trim().Replace(" ", "-");

            // ✅ Dùng _environment.WebRootPath để lấy đường dẫn chính xác tới wwwroot
            var uploadPath = Path.Combine(_environment.WebRootPath, "images", folderName);
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

            // Tạo tên file ngẫu nhiên
            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            return $"/images/{folderName}/{fileName}";
        }

        // Hàm 2: Xóa ảnh khỏi ổ cứng
        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl) || imageUrl.Contains("placeholder.png")) return;

            try
            {
                // Chuyển URL web (/images/...) thành đường dẫn ổ cứng (C:\Projects\wwwroot\images\...)
                var relativePath = imageUrl.TrimStart('/');
                var filePath = Path.Combine(_environment.WebRootPath, relativePath);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            catch
            {
                // Lỗi xóa file không nên làm crash app, chỉ cần log lại nếu cần
            }
        }
    }
}