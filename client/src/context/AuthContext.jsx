import React, { createContext, useContext, useState, useEffect } from "react";
// 👇 1. Sửa import: Dùng axiosClient thay vì axios thường
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Loading nên để true mặc định để chờ check localStorage xong mới render app
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                // Nếu JSON lỗi thì xóa luôn cho sạch
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    // --- HÀM LOGIN API ---
    const login = async (username, password) => {
        try {
            // 👇 2. Dùng axiosClient (đã cấu hình sẵn base URL)
            // Không cần gõ http://localhost:5165 nữa
            const response = await axiosClient.post("/api/auth/login", {
                username,
                password,
            });

            if (response.data.success) {
                const userData = response.data.user;

                // Lưu vào State và LocalStorage
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));

                // 👇 3. QUAN TRỌNG: Phải trả về userData để LoginPage kiểm tra role
                return { success: true, user: userData };
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            const message =
                error.response?.data?.message ||
                "Sai tên đăng nhập hoặc mật khẩu!";
            // Trả về false kèm thông báo lỗi
            return { success: false, message: message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        // Có thể reload trang để xóa sạch state cũ nếu cần
        // window.location.href = "/auth/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {/* Chỉ render App khi đã check xong LocalStorage để tránh flash giật login */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
