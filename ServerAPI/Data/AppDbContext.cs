using Microsoft.EntityFrameworkCore;
using ServerAPI.Models;

namespace ServerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Review> Reviews { get; set; }
        
        public DbSet<AppRole> Roles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ⚠️ QUAN TRỌNG: Dòng này đảm bảo code C# tìm đúng bảng trong SQL
            // Nếu bảng trong SQL của bạn tên là "AppRoles", hãy đổi "Roles" thành "AppRoles"
            // Dựa theo ảnh bạn gửi thì bảng của bạn tên là "Roles" (hoặc AppRoles tùy lúc tạo), hãy kiểm tra kỹ.
            modelBuilder.Entity<AppRole>().ToTable("roles"); 
        }
    }
}