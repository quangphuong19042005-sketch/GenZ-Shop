using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; 

namespace ServerAPI.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("product_name")]
        public string ProductName { get; set; } = string.Empty;

        // Các thuộc tính Size/Color
        [Column("size")]
        public string? Size { get; set; }

        [Column("color")]
        public string? Color { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("price_at_purchase")]
        public decimal PriceAtPurchase { get; set; }

        // --- LIÊN KẾT BẢNG (QUAN TRỌNG) ---

        [JsonIgnore] 
        public Order? Order { get; set; }

        // 👇 ĐÂY LÀ DÒNG BẠN ĐANG THIẾU 👇
        [ForeignKey("ProductId")]
        public Product? Product { get; set; } 
    }
}