namespace ServerAPI.Models.DTO
{
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; } // Thêm số điện thoại cho tiện đặt hàng sau này
    }
}