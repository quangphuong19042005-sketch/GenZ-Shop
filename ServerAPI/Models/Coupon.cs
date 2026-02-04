using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    [Table("coupons")]
    public class Coupon
    {
        [Key] [Column("id")] public int Id { get; set; }
        [Column("code")] public string Code { get; set; } = string.Empty;
        [Column("discount_percent")] public int DiscountPercent { get; set; }
        [Column("is_active")] public bool IsActive { get; set; } = true;
        
        // 👇 THÊM CÁC DÒNG NÀY
        [Column("usage_limit")] public int UsageLimit { get; set; } = 100; // Mặc định 100 lượt
        [Column("used_count")] public int UsedCount { get; set; } = 0;     // Đã dùng 0
        [Column("valid_until")] public DateTime? ValidUntil { get; set; }  // Có dấu ? nghĩa là được phép Null (Vĩnh viễn)
    }
}