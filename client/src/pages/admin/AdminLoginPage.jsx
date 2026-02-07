// File: client/src/pages/admin/AdminLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Sửa đường dẫn nếu cần

const AdminLoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Gọi hàm login chung
        const result = await login(username, password);

        if (result.success) {
            // 2. KIỂM TRA QUYỀN ADMIN NGAY LẬP TỨC
            if (result.user.role === "admin") {
                navigate("/admin/dashboard"); // Vào trang quản trị
            } else {
                // Nếu là khách hàng thường mà cố vào đây -> Đăng xuất và báo lỗi
                logout();
                setError(
                    "Tài khoản này không có quyền truy cập trang Quản trị!",
                );
            }
        } else {
            setError(result.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-wider text-blue-500">
                    Admin Portal
                </h2>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm border border-red-500/50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Username
                        </label>
                        <input
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Password
                        </label>
                        <input
                            className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition-all mt-2">
                        LOGIN TO DASHBOARD
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
