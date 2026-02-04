using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    // Class này đại diện cho bảng 'product_variants'
    public class ProductVariant
    {
        public int Id { get; set; }
        
        [Column("product_id")] // Ánh xạ với cột product_id trong SQL
        public int ProductId { get; set; }
        
        public string Size { get; set; }  // Ví dụ: "M", "L"
        public string Color { get; set; } // Ví dụ: "Black", "Red"
        
        [Column("stock_quantity")]
        public int StockQuantity { get; set; } // Kho riêng của từng size

        // Mối quan hệ ngược lại: 1 Variant thuộc về 1 Product
        [JsonIgnore] // Tránh lỗi vòng lặp khi API trả về dữ liệu
        public Product? Product { get; set; }
    }
}