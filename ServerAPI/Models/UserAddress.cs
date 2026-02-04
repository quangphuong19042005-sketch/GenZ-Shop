using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    [Table("user_addresses")] // Map với bảng user_addresses trong MySQL
    public class UserAddress
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("user_id")]
        public int UserId { get; set; }

        [Column("recipient_name")]
        public string RecipientName { get; set; }

        [Column("phone")]
        public string Phone { get; set; }

        [Column("address_line")]
        public string AddressLine { get; set; }

        [Column("type")]
        public string Type { get; set; } // Nhà riêng / Văn phòng

        [Column("is_default")]
        public bool IsDefault { get; set; }
    }
}