using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    [Table("orders")]
    public class Order
    {
        [Key] [Column("id")] public int Id { get; set; }

        // 👇 THÊM DÒNG NÀY
        [Column("order_code")] public string OrderCode { get; set; } 
        // ----------------

        [Column("user_id")] public int UserId { get; set; }
        [Column("recipient_name")] public string RecipientName { get; set; }
        [Column("recipient_phone")] public string RecipientPhone { get; set; }
        [Column("shipping_address")] public string ShippingAddress { get; set; }
        [Column("total_amount")] public decimal TotalAmount { get; set; }
        [Column("status")] public string Status { get; set; }
        [Column("payment_method")] public string PaymentMethod { get; set; }
        [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.Now;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}