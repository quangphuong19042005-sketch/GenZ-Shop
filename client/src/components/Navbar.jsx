import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// Import hook giỏ hàng
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // --- 👇 SỬA ĐOẠN NÀY 👇 ---
    // 1. Lấy danh sách sản phẩm (cartItems) từ Context
    const { cartItems } = useCart();

    // 2. Tính tổng số lượng (Cộng dồn quantity của từng món)
    // Nếu cartItems chưa tải xong thì mặc định là [] để không lỗi
    const totalItems = (cartItems || []).reduce(
        (total, item) => total + item.quantity,
        0,
    );
    // ---------------------------

    const isActive = (path) => {
        return location.pathname === path
            ? "text-slate-900 dark:text-white font-bold border-b-2 border-primary"
            : "text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white font-semibold transition-colors";
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-[#282e39] bg-white/95 dark:bg-[#101622]/95 backdrop-blur-md">
            <div className="px-6 lg:px-12 py-4 flex items-center justify-between gap-8">
                {/* Logo */}
                <div className="flex items-center gap-3 text-primary cursor-pointer">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">
                                bolt
                            </span>
                        </div>
                        <span className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">
                            STREETWEAR
                        </span>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm">
                    <Link to="/tops" className={isActive("/tops")}>
                        Tops
                    </Link>
                    <Link to="/bottoms" className={isActive("/bottoms")}>
                        Bottoms
                    </Link>
                    <Link
                        to="/vip"
                        className="text-yellow-600 font-black flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            diamond
                        </span>{" "}
                        VIP ACCESS
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Search (Ẩn trên mobile) */}
                    <div className="hidden lg:flex items-center bg-gray-100 dark:bg-[#282e39] rounded-full px-4 h-10 w-64">
                        <span className="material-symbols-outlined text-gray-400">
                            search
                        </span>
                        <input
                            className="bg-transparent border-none text-sm w-full focus:ring-0 ml-2 text-slate-900 dark:text-white"
                            placeholder="Search..."
                        />
                    </div>

                    {/* --- ICON GIỎ HÀNG --- */}
                    <Link
                        to="/cart"
                        className="relative size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#282e39] transition-colors"
                    >
                        <span className="material-symbols-outlined text-slate-900 dark:text-white">
                            shopping_bag
                        </span>

                        {/* Chỉ hiện số nếu > 0 */}
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 size-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#101622] animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {/* User Profile */}
                    <Link
                        to={user ? "/profile" : "/auth/login"}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#282e39] text-slate-900 dark:text-white"
                    >
                        <span className="material-symbols-outlined">
                            person
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
