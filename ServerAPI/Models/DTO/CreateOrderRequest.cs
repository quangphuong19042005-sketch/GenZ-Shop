namespace ServerAPI.Models.DTO
{
    public class CreateOrderRequest
    {
        public int UserId { get; set; }
        public string RecipientName { get; set; }
        public string RecipientPhone { get; set; }
        public string ShippingAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductVariantId { get; set; } 
        public string ProductName { get; set; }
        
        // 👇 THÊM 2 DÒNG NÀY ĐỂ FIX LỖI CS1061
        public string Size { get; set; }  
        public string Color { get; set; } 
        
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}