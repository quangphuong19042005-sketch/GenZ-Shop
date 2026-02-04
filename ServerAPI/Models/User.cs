using System.ComponentModel.DataAnnotations.Schema;

namespace ServerAPI.Models
{
    [Table("users")] // Khớp với bảng 'users' trong SQL
    public class User
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("username")]
        public required string Username { get; set; }

        [Column("email")]
        public required string Email { get; set; }

        [Column("password_hash")]
        public required string PasswordHash { get; set; }

        [Column("full_name")]
        public string? FullName { get; set; }

        // --- CÁC CỘT MỚI BẠN VỪA THÊM TRONG SQL ---
        [Column("phone")]
        public string? Phone { get; set; }

        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }

        [Column("role")]
        public string Role { get; set; } = "member";

        [Column("membership_tier")]
        public string MembershipTier { get; set; } = "Silver";

        [Column("loyalty_points")]
        public int LoyaltyPoints { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } 

        
    }
}