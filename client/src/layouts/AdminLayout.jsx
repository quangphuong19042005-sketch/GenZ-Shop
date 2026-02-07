import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // 1. DANH SÁCH MENU GỐC (MASTER MENU)
    // Lưu ý: Phải thêm 'id' khớp với chuỗi permission trong Database (ví dụ: "products,orders")
    const allMenuItems = [
        {
            id: "dashboard",
            icon: "dashboard",
            label: "Tổng quan",
            path: "/admin",
        },
        {
            id: "products",
            icon: "inventory_2",
            label: "Sản phẩm",
            path: "/admin/products",
        },
        {
            id: "orders",
            icon: "shopping_bag",
            label: "Đơn hàng",
            path: "/admin/orders",
        },
        {
            id: "customers",
            icon: "group",
            label: "Khách hàng",
            path: "/admin/customers",
        },

        // 👇 Menu mới cho trang Phân quyền
        {
            id: "roles",
            icon: "shield_person",
            label: "Phân quyền",
            path: "/admin/roles",
        },

        {
            id: "marketing",
            icon: "campaign",
            label: "Marketing",
            path: "/admin/marketing",
        },
        {
            id: "settings",
            icon: "settings",
            label: "Cấu hình",
            path: "/admin/settings",
        },
    ];

    // 2. XỬ LÝ PHÂN QUYỀN (LOGIC CỐT LÕI)
    // Chuyển chuỗi permission thành mảng. VD: "orders,products" -> ['orders', 'products']
    const userPermissions = user?.permissions
        ? user.permissions.split(",")
        : [];

    const visibleMenuItems = allMenuItems.filter((item) => {
        // Trường hợp 1: Admin gốc hoặc có quyền "all" -> Thấy hết
        if (user?.role === "admin" || user?.permissions === "all") {
            return true;
        }

        // Trường hợp 2: Luôn cho phép thấy Dashboard (nếu bạn muốn Staff nào cũng vào được Dashboard)
        // Nếu muốn chặn cả Dashboard thì xóa dòng này đi và bắt buộc tick chọn Dashboard lúc tạo Role
        if (item.id === "dashboard") return true;

        // Trường hợp 3: Kiểm tra id của menu có nằm trong danh sách quyền không
        return userPermissions.includes(item.id);
    });

    // Logic active menu
    const isActive = (path) => {
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0b0e14] flex font-display text-slate-900 dark:text-white">
            {/* 1. SIDEBAR */}
            <aside className="w-64 bg-white dark:bg-[#1a2230] border-r border-gray-200 dark:border-[#282e39] flex flex-col fixed h-full z-20">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-[#282e39]">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-primary"
                    >
                        <div className="size-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-black">
                            <span className="material-symbols-outlined text-xl">
                                bolt
                            </span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            ADMIN
                        </span>
                    </Link>
                </div>

                {/* Menu Links (Đã lọc theo quyền) */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {visibleMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                isActive(item.path)
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 dark:bg-white dark:text-slate-900"
                                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-[#282e39] dark:text-gray-400"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-200 dark:border-[#282e39]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-[#282e39] flex items-center justify-center font-bold text-slate-900 dark:text-white uppercase">
                            {user?.username?.charAt(0) || "A"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate w-32">
                                {user?.fullName || user?.username || "Admin"}
                            </p>
                            {/* Hiển thị Role thực tế */}
                            <p className="text-xs text-gray-500 uppercase flex items-center gap-1">
                                <span
                                    className={`size-2 rounded-full ${user?.role === "admin" ? "bg-purple-500" : "bg-green-500"}`}
                                ></span>
                                {user?.role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">
                            logout
                        </span>{" "}
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* 2. MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
