import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        return <Navigate to="/auth/login" />;
    }

    // Nếu đã đăng nhập, cho phép xem nội dung
    return children;
};

export default ProtectedRoute;
