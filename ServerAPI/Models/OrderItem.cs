namespace ServerAPI.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        
        // 👇 THÊM 2 DÒNG NÀY ĐỂ LƯU VÀO DATABASE
        public string Size { get; set; }
        public string Color { get; set; }

        public int Quantity { get; set; }
        public decimal PriceAtPurchase { get; set; }

        public Order? Order { get; set; }
    }
}