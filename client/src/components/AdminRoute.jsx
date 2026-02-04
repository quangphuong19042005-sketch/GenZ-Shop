import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    // 1. Nếu chưa đăng nhập -> Đuổi về trang Login
    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    // 2. Nếu đã đăng nhập nhưng không phải Admin -> Đuổi về Home và cảnh báo
    if (user.role !== "admin") {
        alert("Bạn không có quyền truy cập vào trang Quản trị!");
        return <Navigate to="/" />;
    }

    // 3. Nếu là Admin -> Mời vào (Hiển thị nội dung bên trong)
    return children;
};

export default AdminRoute;
