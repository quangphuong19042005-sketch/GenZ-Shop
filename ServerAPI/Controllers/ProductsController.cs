using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerAPI.Data;
using ServerAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace ServerAPI.Controllers
{
    // 1. Cập nhật DTO: Thêm IsActive để nhận dữ liệu từ Frontend
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
        
        // 👇 QUAN TRỌNG: Thêm dòng này để nhận trạng thái từ Frontend
        public bool IsActive { get; set; } = true; 

        public IFormFile? ImageFile { get; set; }
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

        // GET ALL (Lấy tất cả cho Admin quản lý)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.OrderByDescending(p => p.Id).ToListAsync();
        }

        // GET ONE (Lấy chi tiết 1 sản phẩm theo ID) - Đã thêm ở bước trước
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });
            return product;
        }

        // CREATE
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
                    
                    // 👇 Gán giá trị IsActive từ DTO vào Model
                    IsActive = productDto.IsActive 
                };

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

        // UPDATE (Đây là hàm quan trọng nhất để sửa lỗi của bạn)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto productDto)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

            try
            {
                // Cập nhật các trường thông tin cơ bản
                existingProduct.Name = productDto.Name;
                existingProduct.Price = productDto.Price;
                existingProduct.Category = productDto.Category;
                existingProduct.Description = productDto.Description;
                existingProduct.StockQuantity = productDto.StockQuantity;

                // 👇 QUAN TRỌNG: Cập nhật trạng thái IsActive vào Database
                // Nếu thiếu dòng này, trạng thái sẽ không bao giờ được lưu!
                existingProduct.IsActive = productDto.IsActive;

                // Xử lý cập nhật ảnh nếu có ảnh mới
                if (productDto.ImageFile != null && productDto.ImageFile.Length > 0)
                {
                    DeleteImage(existingProduct.ImageUrl); // Xóa ảnh cũ
                    existingProduct.ImageUrl = await SaveImage(productDto.ImageFile, productDto.Category); // Lưu ảnh mới
                }

                await _context.SaveChangesAsync();
                return Ok(existingProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi cập nhật: " + ex.Message });
            }
        }

        // DELETE (Soft Delete hoặc Hard Delete tùy bạn chọn)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });
            
            try 
            {
                // Cách 1: Xóa cứng (Xóa bay khỏi DB)
                _context.Products.Remove(product); 
                
                // Cách 2: Xóa mềm (Chỉ ẩn đi) - Nếu bạn muốn dùng cách này thì bỏ comment dòng dưới và comment dòng trên
                // product.IsActive = false;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Đã xóa sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                // Bắt lỗi ràng buộc khóa ngoại (ví dụ: sản phẩm đã có trong đơn hàng)
                return StatusCode(500, new { message = "Không thể xóa sản phẩm này vì đã có dữ liệu liên quan." });
            }
        }
        
        // ==========================================
        // 👇 CÁC HÀM PHỤ TRỢ (HELPER METHODS) 👇
        // ==========================================

        private async Task<string> SaveImage(IFormFile? imageFile, string category)
        {
            if (imageFile == null || imageFile.Length == 0) return "/images/placeholder.png";
            
            var extension = Path.GetExtension(imageFile.FileName).ToLower();
            string folderName = "others";
            
            if (!string.IsNullOrEmpty(category)) 
                folderName = category.ToLower().Trim().Replace(" ", "-");
            
            var uploadPath = Path.Combine(_environment.WebRootPath, "images", folderName);
            
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);
            
            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadPath, fileName);
            
            using (var stream = new FileStream(filePath, FileMode.Create)) 
            { 
                await imageFile.CopyToAsync(stream); 
            }
            
            return $"/images/{folderName}/{fileName}";
        }

        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl) || imageUrl.Contains("placeholder.png")) return;
            
            try {
                var relativePath = imageUrl.TrimStart('/');
                var filePath = Path.Combine(_environment.WebRootPath, relativePath);
                
                if (System.IO.File.Exists(filePath)) 
                    System.IO.File.Delete(filePath);
            } catch { }
        }
    }
}