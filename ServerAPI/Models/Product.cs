using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    [Table("products")]
    public class Product
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public required string Name { get; set; } // Cách 1: Thêm 'required' (Bắt buộc phải có khi tạo)

        [Column("description")]
        public string? Description { get; set; } // Cách 2: Thêm '?' (Cho phép null)

        [Column("price")]
        public decimal Price { get; set; }

        [Column("category")]
        public required string Category { get; set; } // Thêm 'required'

        [Column("image_url")]
        public string? ImageUrl { get; set; } // Thêm '?'
        [Column("stock_quantity")]
        public int StockQuantity { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }
    }
}