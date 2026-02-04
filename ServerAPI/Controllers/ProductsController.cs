using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json; // 👇 Cần cái này để xử lý JSON

namespace ServerAPI.Controllers
{
    // 1. DTO: Đã thêm VariantsJson để nhận dữ liệu từ React
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Tên sản phẩm là bắt buộc")]
        public string Name { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Giá phải lớn hơn 0")]
        public decimal Price { get; set; }

        public string Category { get; set; }
        public string? Description { get; set; }
        
        // 👇 KHÔNG CẦN StockQuantity NỮA (VÌ ĐÃ DÙNG BIẾN THỂ)
        // public int StockQuantity { get; set; } 
        
        public bool IsActive { get; set; } = true; 

        public IFormFile? ImageFile { get; set; }

        // 👇 TRƯỜNG QUAN TRỌNG: Nhận chuỗi JSON danh sách biến thể
        public string? VariantsJson { get; set; } 
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProductsController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // ==========================================
        // 1. GET ALL (Lấy tất cả kèm theo Biến thể)
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products
                                 .Include(p => p.Variants) // Lấy luôn Size/Color
                                 .OrderByDescending(p => p.Id)
                                 .ToListAsync();
        }

        // ==========================================
        // 2. GET ONE (Lấy chi tiết)
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products
                                        .Include(p => p.Variants)
                                        .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) 
                return NotFound(new { message = "Không tìm thấy sản phẩm" });
                
            return product;
        }

        // ==========================================
        // 3. CREATE (Tạo mới + Lưu biến thể)
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
                    IsActive = productDto.IsActive
                };

                // 1. Lưu ảnh
                product.ImageUrl = await SaveImage(productDto.ImageFile, productDto.Category);

                // 2. Xử lý Biến thể (Variants) từ chuỗi JSON
                if (!string.IsNullOrEmpty(productDto.VariantsJson))
                {
                    try 
                    {
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                        var variants = JsonSerializer.Deserialize<List<ProductVariant>>(productDto.VariantsJson, options);
                        
                        if (variants != null && variants.Count > 0)
                        {
                            product.Variants = variants; // EF Core tự động liên kết và lưu vào bảng variants
                        }
                    }
                    catch (Exception ex) 
                    {
                        // Ghi log lỗi nếu parse JSON thất bại (tùy chọn)
                        Console.WriteLine("Lỗi parse VariantsJson: " + ex.Message);
                    }
                }

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
        // 4. UPDATE (Cập nhật + Thay thế biến thể cũ)
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            // Include Variants để tí nữa xóa cái cũ đi
            var existingProduct = await _context.Products
                                                .Include(p => p.Variants)
                                                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingProduct == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

            try
            {
                // Cập nhật thông tin cơ bản
                existingProduct.Name = productDto.Name;
                existingProduct.Price = productDto.Price;
                existingProduct.Category = productDto.Category;
                existingProduct.Description = productDto.Description;
                existingProduct.IsActive = productDto.IsActive;

                // Xử lý ảnh mới (nếu có)
                if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
                {
                    DeleteImage(existingProduct.ImageUrl);
                    existingProduct.ImageUrl = await SaveImage(productDto.ImageFile, productDto.Category);
                }

                // 👇 LOGIC CẬP NHẬT BIẾN THỂ (QUAN TRỌNG)
                if (!string.IsNullOrEmpty(productDto.VariantsJson))
                {
                    // Bước 1: Xóa hết các biến thể cũ trong Database
                    if (existingProduct.Variants != null && existingProduct.Variants.Any())
                    {
                        _context.ProductVariants.RemoveRange(existingProduct.Variants);
                    }
                    
                    // Bước 2: Thêm các biến thể mới từ JSON gửi lên
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var newVariants = JsonSerializer.Deserialize<List<ProductVariant>>(productDto.VariantsJson, options);
                    
                    if (newVariants != null)
                    {
                        foreach (var v in newVariants)
                        {
                            // Đảm bảo ID = 0 để EF Core hiểu là thêm mới (INSERT)
                            v.Id = 0; 
                            v.ProductId = existingProduct.Id; 
                            _context.ProductVariants.Add(v);
                        }
                    }
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
        // 5. DELETE (Xóa)
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });
            
            try 
            {
                // Xóa sản phẩm sẽ tự động xóa các biến thể liên quan (nếu cấu hình Cascade Delete trong SQL)
                // Hoặc xóa ảnh trước
                DeleteImage(product.ImageUrl);

                _context.Products.Remove(product); 
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Đã xóa sản phẩm thành công" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Không thể xóa sản phẩm vì đã có đơn hàng liên quan." });
            }
        }
        
        // ==========================================
        // 👇 CÁC HÀM PHỤ TRỢ (HELPER METHODS)
        // ==========================================

        private async Task<string> SaveImage(IFormFile? imageFile, string category)
        {
            if (imageFile == null || imageFile.Length == 0) return "/images/placeholder.png";
            var extension = Path.GetExtension(imageFile.FileName).ToLower();
            string folderName = "others";
            if (!string.IsNullOrEmpty(category)) folderName = category.ToLower().Trim().Replace(" ", "-");
            var uploadPath = Path.Combine(_environment.WebRootPath, "images", folderName);
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await imageFile.CopyToAsync(stream); }
            return $"/images/{folderName}/{fileName}";
        }

        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl) || imageUrl.Contains("placeholder.png")) return;
            try {
                var relativePath = imageUrl.TrimStart('/');
                var filePath = Path.Combine(_environment.WebRootPath, relativePath);
                if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
            } catch { }
        }
    }
}