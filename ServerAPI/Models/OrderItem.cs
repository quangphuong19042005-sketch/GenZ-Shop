using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ServerAPI.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }

        // 👇 SỬA LẠI: Liên kết trực tiếp với bảng Products
        [Column("product_id")] 
        public int ProductId { get; set; } 

        [Column("product_name")]
        public string ProductName { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("price_at_purchase")]
        public decimal PriceAtPurchase { get; set; }

        // Navigation properties
        [JsonIgnore]
        public Order Order { get; set; }
        
        // 👇 Trỏ về Product thay vì ProductVariant
        public Product Product { get; set; } 
    }
}