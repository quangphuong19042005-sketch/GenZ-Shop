import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Danh sách menu Admin
    const menuItems = [
        { icon: "dashboard", label: "Tổng quan", path: "/admin" },
        { icon: "inventory_2", label: "Sản phẩm", path: "/admin/products" },
        { icon: "shopping_bag", label: "Đơn hàng", path: "/admin/orders" },
        { icon: "group", label: "Khách hàng", path: "/admin/customers" },
        { icon: "campaign", label: "Marketing", path: "/admin/marketing" },
        { icon: "settings", label: "Cấu hình", path: "/admin/settings" },
    ];

    const isActive = (path) => {
        // Logic active chính xác cho cả trang con
        if (path === "/admin") return location.pathname === "/admin";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-[#0b0e14] flex font-display text-slate-900 dark:text-white">
            {/* 1. SIDEBAR (Thanh bên trái) */}
            <aside className="w-64 bg-white dark:bg-[#1a2230] border-r border-gray-200 dark:border-[#282e39] flex flex-col fixed h-full z-20">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-[#282e39]">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">
                                bolt
                            </span>
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            ADMIN
                        </span>
                    </div>
                </div>

                {/* Menu Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                isActive(item.path)
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
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
                        <div
                            className="size-10 rounded-full bg-gray-200 dark:bg-[#282e39] bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4nTGmz0dmqX2eFcP4yI0AnxQO3JATpGp4GsJxVI1LW8BcShPflxvZCExgC8dMsSuxZPuCWK2AkH25Ka-_j7ol6axYjx_wAv1BHpGdsKdd7LHrKN-I-fgO3Hh7N6Iz5XUtyh3aCJgM8Tfv9ZleXfAKh5I5W0Kw4TR6H5XWPRMMYFCK6PzwGOfj9W9sSAtj7viGYJ0L9unImQhFS9ZWeQxilBp3nhqGQyV8g0MEExGxnHypXaMIw1g7NYHHHPxVJCFmAnslYPcZz-FN')",
                            }}
                        ></div>
                        <div>
                            <p className="text-sm font-bold">
                                {user?.name || "Admin"}
                            </p>
                            <p className="text-xs text-gray-500">Super Admin</p>
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

            {/* 2. MAIN CONTENT (Nội dung bên phải) */}
            <main className="flex-1 ml-64 p-8 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
