using System.ComponentModel.DataAnnotations;

namespace ServerAPI.Models
{
    public class AppRole
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoleName { get; set; } // Ví dụ: "shipper", "staff_kho"

        public string Description { get; set; } // Ví dụ: "Chỉ được xem đơn hàng"

        // Lưu danh sách trang được phép truy cập. Ví dụ: "orders,products"
        public string Permissions { get; set; } 
    }
}