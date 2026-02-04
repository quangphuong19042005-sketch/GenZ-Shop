import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileSidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    // Hàm kiểm tra link đang xem để tô màu
    const isActive = (path) => {
        return location.pathname === path
            ? "bg-[#2d2d2d] border-l-[3px] border-[#f2d00d] text-white"
            : "hover:bg-gray-200 dark:hover:bg-[#1e1e1e] transition-all text-gray-600 dark:text-gray-400";
    };

    return (
        <aside className="w-full lg:w-64 flex flex-col gap-8 shrink-0">
            <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 px-3">
                    Account Settings
                </h3>

                {/* Menu Items */}
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${isActive("/profile")}`}
                >
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-sm font-medium">Profile Info</span>
                </Link>

                <Link
                    to="/profile/orders"
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${isActive("/profile/orders")}`}
                >
                    <span className="material-symbols-outlined">package_2</span>
                    <span className="text-sm font-medium">Order History</span>
                </Link>

                <Link
                    to="/profile/wishlist"
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${isActive("/profile/wishlist")}`}
                >
                    <span className="material-symbols-outlined">favorite</span>
                    <span className="text-sm font-medium">Wishlist</span>
                </Link>

                <Link
                    to="/profile/addresses"
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg ${isActive("/profile/addresses")}`}
                >
                    <span className="material-symbols-outlined">
                        location_on
                    </span>
                    <span className="text-sm font-medium">Saved Addresses</span>
                </Link>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-200 dark:border-[#2d2d2d]">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
