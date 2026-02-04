import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Lấy dữ liệu từ LocalStorage khi mới vào web để không bị mất giỏ hàng khi F5
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem("cartItems");
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Lỗi parse JSON giỏ hàng:", error);
            return [];
        }
    });

    // 2. Tự động lưu vào LocalStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // --- HÀM THÊM VÀO GIỎ (Đã sửa lỗi NaN và Ảnh) ---
    const addToCart = (product, quantity, size, color) => {
        // A. XỬ LÝ GIÁ (Fix lỗi $NaN)
        // Chuyển giá về dạng số thực (float), nếu lỗi thì mặc định là 0
        const price = parseFloat(product.price) || 0;
        const qty = parseInt(quantity) || 1;

        // B. XỬ LÝ ẢNH (Fix lỗi ảnh trắng hoặc thiếu đường dẫn)
        let imageUrl =
            product.imageUrl || product.image_url || "/images/placeholder.png";

        // Nếu ảnh là đường dẫn tương đối (bắt đầu bằng /), thêm localhost vào
        if (
            imageUrl &&
            imageUrl.startsWith("/") &&
            !imageUrl.startsWith("http")
        ) {
            imageUrl = `http://localhost:5165${imageUrl}`;
        }

        setCartItems((prevItems) => {
            // Kiểm tra xem sản phẩm này (cùng ID, Size, Color) đã có trong giỏ chưa
            const existingItemIndex = prevItems.findIndex(
                (item) =>
                    item.id === product.id &&
                    item.size === size &&
                    item.color === color,
            );

            if (existingItemIndex > -1) {
                // Nếu có rồi -> Tăng số lượng
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += qty;
                return newItems;
            } else {
                // Nếu chưa -> Thêm mới vào mảng
                return [
                    ...prevItems,
                    {
                        ...product,
                        id: product.id,
                        name: product.name,
                        price: price, // Sử dụng giá đã xử lý
                        imageUrl: imageUrl, // Sử dụng ảnh đã xử lý
                        quantity: qty,
                        size: size,
                        color: color,
                    },
                ];
            }
        });
    };

    // --- HÀM XÓA KHỎI GIỎ ---
    const removeFromCart = (id, size, color) => {
        setCartItems((prevItems) =>
            prevItems.filter(
                (item) =>
                    !(
                        item.id === id &&
                        item.size === size &&
                        item.color === color
                    ),
            ),
        );
    };

    // --- HÀM XÓA HẾT GIỎ HÀNG (Dùng khi thanh toán xong) ---
    const clearCart = () => {
        setCartItems([]); // Xóa state để giao diện cập nhật ngay
        localStorage.removeItem("cartItems"); // Xóa trong bộ nhớ trình duyệt
        localStorage.removeItem("cart"); // Xóa thêm key cũ (nếu có) cho sạch
    };

    // --- TÍNH TỔNG TIỀN ---
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart, // Đã export hàm này để CheckoutPage dùng
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
