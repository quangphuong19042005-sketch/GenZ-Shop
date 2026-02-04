import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios"; // 1. Import axios để gọi API

const CartPage = () => {
    const { cartItems, removeFromCart, totalPrice } = useCart();
    const navigate = useNavigate();

    // 2. State quản lý mã giảm giá
    const [couponInput, setCouponInput] = useState(""); // Mã người dùng nhập
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Mã đã áp dụng thành công
    const [discountPercent, setDiscountPercent] = useState(0); // % Giảm giá

    // 3. Tính toán tiền
    const subtotal = totalPrice;
    // Tiền giảm = Tổng tiền * (% giảm / 100)
    const discountAmount = subtotal * (discountPercent / 100);
    // Tiền sau khi giảm
    const subtotalAfterDiscount = subtotal - discountAmount;
    // Thuế (8%) tính trên số tiền đã giảm
    const tax = subtotalAfterDiscount * 0.08;
    // Tổng cộng cuối cùng
    const total = subtotalAfterDiscount + tax;

    // 4. Hàm xử lý áp dụng mã
    const handleApplyCoupon = async () => {
        if (!couponInput) return;

        try {
            // Lấy danh sách mã từ Server
            const res = await axios.get("http://localhost:5165/api/coupons");
            const coupons = res.data;

            // Tìm xem mã nhập vào có tồn tại và đang Active không (So sánh chữ hoa)
            const foundCoupon = coupons.find(
                (c) => c.code === couponInput.toUpperCase() && c.isActive,
            );

            if (foundCoupon) {
                setAppliedCoupon(foundCoupon.code);
                setDiscountPercent(foundCoupon.discountPercent);
                alert(
                    `Áp dụng mã ${foundCoupon.code} thành công! Giảm ${foundCoupon.discountPercent}%`,
                );
            } else {
                alert("Mã giảm giá không tồn tại hoặc đã hết hạn!");
                setAppliedCoupon(null);
                setDiscountPercent(0);
            }
        } catch (error) {
            console.error("Lỗi kiểm tra mã:", error);
            alert("Không thể kết nối đến server kiểm tra mã.");
        }
    };

    // 5. Xử lý khi bấm nút Thanh toán -> Gửi dữ liệu giảm giá sang trang Checkout
    const handleCheckout = () => {
        navigate("/checkout", {
            state: {
                discountPercent: discountPercent,
                couponCode: appliedCoupon,
                finalTotal: total,
            },
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="w-full max-w-[1440px] mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">
                        shopping_cart_off
                    </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                    Order Summary
                </h2>
                <p className="text-gray-500">
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                    to="/shop"
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                {/* --- LEFT COLUMN: Danh sách sản phẩm --- */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-2 pb-4 border-b border-gray-200 dark:border-[#282e39]">
                        <h1 className="text-3xl md:text-5xl font-black tracking-[-0.03em] uppercase text-slate-900 dark:text-white">
                            Your Bag
                        </h1>
                        <p className="text-gray-500 dark:text-[#9da6b9] text-base md:text-lg">
                            {cartItems.length} items in your cart ready for
                            checkout.
                        </p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {cartItems.map((item, index) => {
                            const imageUrl =
                                item.imageUrl ||
                                item.image_url ||
                                "/images/placeholder.png";

                            return (
                                <div
                                    key={index}
                                    className="flex gap-4 sm:gap-6 p-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#1a2230] hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="w-24 h-32 sm:w-32 sm:h-40 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                    $
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    Size:{" "}
                                                    <span className="text-slate-900 dark:text-white font-bold">
                                                        {item.size}
                                                    </span>
                                                </span>
                                                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    Color:{" "}
                                                    <span className="text-slate-900 dark:text-white font-bold">
                                                        {item.color}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-1.5 border border-gray-200 dark:border-gray-700">
                                                <span className="text-xs text-gray-500 uppercase font-bold">
                                                    Qty
                                                </span>
                                                <span className="text-slate-900 dark:text-white font-bold">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id,
                                                        item.size,
                                                        item.color,
                                                    )
                                                }
                                                className="text-red-500 font-bold text-sm hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    delete
                                                </span>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Order Summary --- */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-28 bg-white dark:bg-[#1a2230]/50 backdrop-blur-sm border border-gray-200 dark:border-[#282e39] rounded-2xl p-6 lg:p-8 flex flex-col gap-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Order Summary
                        </h2>

                        <div className="flex flex-col gap-4 pb-6 border-b border-gray-200 dark:border-[#282e39]">
                            <div className="flex justify-between items-center text-gray-500 dark:text-[#9da6b9]">
                                <span className="text-sm">Subtotal</span>
                                <span className="text-slate-900 dark:text-white font-medium">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            {/* HIỂN THỊ DÒNG GIẢM GIÁ NẾU CÓ */}
                            {discountPercent > 0 && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="text-sm font-bold">
                                        Discount ({appliedCoupon})
                                    </span>
                                    <span className="font-bold">
                                        -${discountAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-gray-500 dark:text-[#9da6b9]">
                                <span className="text-sm">
                                    Shipping estimate
                                </span>
                                <span className="text-green-600 font-bold">
                                    Free
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 dark:text-[#9da6b9]">
                                <span className="text-sm">Tax (8%)</span>
                                <span className="text-slate-900 dark:text-white font-medium">
                                    ${tax.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Ô NHẬP MÃ GIẢM GIÁ */}
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-transparent border border-gray-300 dark:border-[#282e39] rounded-full px-4 py-2.5 text-sm focus:border-primary focus:ring-0 text-slate-900 dark:text-white placeholder:text-gray-400 uppercase"
                                placeholder="Promo code"
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                            />
                            <button
                                onClick={handleApplyCoupon}
                                className="bg-slate-900 dark:bg-[#282e39] hover:bg-primary dark:hover:bg-white dark:hover:text-black text-white text-sm font-bold px-5 rounded-full transition-all"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                Total
                            </span>
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
                                    ${total.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-[#9da6b9]">
                                    Including VAT
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-full shadow-[0_0_20px_rgba(19,91,236,0.3)] hover:shadow-[0_0_30px_rgba(19,91,236,0.5)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                        >
                            <span>Proceed to Checkout</span>
                            <span className="material-symbols-outlined text-[20px]">
                                arrow_forward
                            </span>
                        </button>

                        <div className="flex justify-center gap-6 mt-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-300 text-slate-900 dark:text-white">
                            <div className="flex flex-col items-center gap-1">
                                <span className="material-symbols-outlined text-[24px]">
                                    lock
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider">
                                    Secure
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="material-symbols-outlined text-[24px]">
                                    local_shipping
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider">
                                    Express
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="material-symbols-outlined text-[24px]">
                                    verified
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-wider">
                                    Quality
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
