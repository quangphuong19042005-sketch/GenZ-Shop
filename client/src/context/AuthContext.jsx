import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // --- HÀM LOGIN API (.NET CORE) ---
    const login = async (username, password) => {
        try {
            // 👇 QUAN TRỌNG: Đã đổi từ 'users' sang 'auth' để khớp với Backend mới
            const response = await axios.post(
                "http://localhost:5165/api/auth/login",
                {
                    username,
                    password,
                },
            );

            // .NET trả về OK 200 là thành công
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                return { success: true };
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            const message =
                error.response?.data?.message ||
                "Sai tên đăng nhập hoặc mật khẩu!";
            return { success: false, message: message };
        }
    };
    // --------------------------------

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
