import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom"; // Thêm useLocation
import axios from "axios";

const CheckoutPage = () => {
    const { cartItems, totalPrice: contextTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // 👇 1. NHẬN DỮ LIỆU TỪ TRANG CART (MÃ GIẢM GIÁ)
    const location = useLocation();
    const {
        discountPercent = 0,
        couponCode = null,
        finalTotal = contextTotalPrice,
    } = location.state || {};

    const [savedAddresses, setSavedAddresses] = useState([]);
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        phone: "",
        address: "",
        note: "",
    });

    // Tính toán lại để hiển thị cho khớp (nếu cần)
    const discountAmount = contextTotalPrice * (discountPercent / 100);
    const subtotalAfterDiscount = contextTotalPrice - discountAmount;
    const tax = subtotalAfterDiscount * 0.08;
    // Lưu ý: finalTotal lấy từ location state đã bao gồm thuế.
    // Nếu không có state (vào thẳng link checkout), thì tính lại từ đầu:
    const displayTotal = location.state ? finalTotal : contextTotalPrice * 1.08;

    // 1. Load sổ địa chỉ
    useEffect(() => {
        if (user) {
            const fetchAddresses = async () => {
                try {
                    const res = await axios.get(
                        `http://localhost:5165/api/addresses/user/${user.id}`,
                    );
                    setSavedAddresses(res.data);
                } catch (error) {
                    console.error("Lỗi lấy sổ địa chỉ:", error);
                }
            };
            fetchAddresses();
        }
    }, [user]);

    // 2. Xử lý chọn địa chỉ
    const handleSelectSavedAddress = (e) => {
        const selectedId = parseInt(e.target.value);
        if (selectedId === 0) {
            setFormData({
                ...formData,
                fullName: user?.name || "",
                phone: "",
                address: "",
            });
            return;
        }
        const selectedAddr = savedAddresses.find(
            (addr) => addr.id === selectedId,
        );
        if (selectedAddr) {
            setFormData({
                ...formData,
                fullName: selectedAddr.recipientName,
                phone: selectedAddr.phone,
                address: selectedAddr.addressLine,
            });
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- HÀM XỬ LÝ ĐẶT HÀNG ---
    const handlePlaceOrder = async () => {
        if (!formData.fullName || !formData.address || !formData.phone) {
            alert("Vui lòng điền đầy đủ: Họ tên, Số điện thoại và Địa chỉ!");
            return;
        }

        try {
            const orderData = {
                userId: parseInt(user.id),
                recipientName: formData.fullName,
                recipientPhone: formData.phone,
                shippingAddress: formData.address,

                // 👇 GỬI TỔNG TIỀN ĐÃ GIẢM GIÁ VỀ SERVER
                totalAmount: parseFloat(displayTotal),

                // (Optional) Nếu Backend sau này hỗ trợ lưu Voucher, bạn có thể gửi thêm:
                // couponCode: couponCode,
                // discountAmount: discountAmount,

                items: cartItems.map((item) => ({
                    productVariantId: parseInt(item.id),
                    productName: item.name,
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    // 👇 THÊM 2 DÒNG NÀY (QUAN TRỌNG ĐỂ CHECK KHO)
                    size: item.size,
                    color: item.color
                })),
            };

            console.log("Đang gửi đơn hàng:", orderData);

            const res = await axios.post(
                "http://localhost:5165/api/orders",
                orderData,
            );

            if (res.data.success) {
                const orderCode = res.data.orderCode || `#${res.data.orderId}`;
                alert(
                    `🎉 Đặt hàng thành công!\nMã đơn hàng: ${orderCode}\nTổng thanh toán: $${displayTotal.toFixed(2)}`,
                );
                clearCart();
                navigate("/profile/orders");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            // ... (Giữ nguyên phần xử lý lỗi Foreign Key cũ của bạn)
            if (
                error.response &&
                (error.response.status === 400 || error.response.status === 500)
            ) {
                const msg = error.response.data.message || "";
                if (
                    msg.includes("foreign key") ||
                    msg.includes("constraint") ||
                    msg.includes("child row")
                ) {
                    alert(
                        "⚠️ Giỏ hàng chứa sản phẩm không còn tồn tại. Giỏ hàng sẽ được làm mới.",
                    );
                    clearCart();
                    window.location.reload();
                    return;
                }
            }
            if (error.response) {
                alert(
                    `Lỗi: ${error.response.data.message || "Không thể tạo đơn hàng"}`,
                );
            } else {
                alert("Không thể kết nối tới Server.");
            }
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20 text-slate-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống!</h2>
                <Link
                    to="/shop"
                    className="text-primary font-bold hover:underline"
                >
                    Quay lại mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Cột Trái: Form */}
            <div>
                <h2 className="text-2xl font-bold mb-6 uppercase text-slate-900 dark:text-white">
                    Thông tin giao hàng
                </h2>
                {savedAddresses.length > 0 && (
                    <div className="mb-6 bg-blue-50 dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-700">
                        <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-blue-300">
                            Chọn từ sổ địa chỉ:
                        </label>
                        <select
                            onChange={handleSelectSavedAddress}
                            className="w-full p-3 rounded-lg border border-gray-300 cursor-pointer text-slate-900"
                        >
                            <option value={0}>-- Nhập địa chỉ mới --</option>
                            {savedAddresses.map((addr) => (
                                <option key={addr.id} value={addr.id}>
                                    {addr.type}: {addr.addressLine}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-slate-900 dark:text-gray-300">
                            Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded-lg text-slate-900"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-slate-900 dark:text-gray-300">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded-lg text-slate-900"
                            placeholder="0912..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-slate-900 dark:text-gray-300">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full border p-3 rounded-lg text-slate-900"
                            placeholder="Số nhà, đường..."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Cột Phải: Tổng tiền & Nút đặt hàng */}
            <div className="bg-gray-50 dark:bg-[#1a2230] p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-fit shadow-xl">
                <h2 className="text-xl font-bold mb-4 uppercase text-slate-900 dark:text-white">
                    Đơn hàng của bạn
                </h2>
                <div className="flex flex-col gap-3 mb-4 max-h-60 overflow-y-auto pr-2">
                    {cartItems.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between text-sm text-slate-700 dark:text-gray-300"
                        >
                            <span>
                                {item.name} (x{item.quantity}){" "}
                                {item.size ? `- ${item.size}` : ""}
                            </span>
                            <span className="font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 flex flex-col gap-2 text-slate-900 dark:text-white">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Tạm tính</span>
                        <span>${contextTotalPrice.toFixed(2)}</span>
                    </div>

                    {/* 👇 HIỂN THỊ GIẢM GIÁ NẾU CÓ */}
                    {discountPercent > 0 && (
                        <div className="flex justify-between text-sm text-green-600 font-bold">
                            <span>Voucher ({couponCode})</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Thuế (8%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-xl font-black mt-2 pt-2 border-t border-dashed">
                        <span>TỔNG CỘNG</span>
                        <span className="text-primary">
                            ${displayTotal.toFixed(2)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary text-white py-4 rounded-full font-bold mt-6 hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30"
                >
                    XÁC NHẬN ĐẶT HÀNG
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
