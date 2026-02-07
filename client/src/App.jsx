import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Bỏ BrowserRouter vì thường nó nằm ở main.jsx/index.jsx
import { useAuth } from "./context/AuthContext";

// --- LAYOUTS ---
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";

// --- PAGES ---
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import TopsPage from "./pages/TopsPage";
import BottomsPage from "./pages/BottomsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import VIPPage from "./pages/VIPPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfile from "./pages/UserProfile";
import OrderHistory from "./pages/OrderHistory";
import Wishlist from "./pages/Wishlist";
import SavedAddresses from "./pages/SavedAddresses";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// --- ADMIN PAGES ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import MarketingManagement from "./pages/admin/MarketingManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";
import RoleManagement from "./pages/admin/RoleManagement";
// 👇 IMPORT TRANG LOGIN ADMIN MỚI
import AdminLoginPage from "./pages/admin/AdminLoginPage";

import ProtectedRoute from "./components/ProtectedRoute";

// 👇 SỬA LẠI LOGIC ADMIN ROUTE: Cho phép Staff, Shipper... truy cập
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Chờ tải user xong mới check

    // 1. Nếu CHƯA đăng nhập -> Đá sang trang Login Admin
    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    // 2. Nếu là MEMBER (Khách hàng) -> Đá về Home (Không cho vào Admin)
    // Các role khác (admin, staff, shipper, editor...) ĐƯỢC PHÉP vào
    if (user.role === "member") {
        return <Navigate to="/" />;
    }

    // 3. Được phép vào
    return children;
};

function App() {
    return (
        <Routes>
            {/* 1. KHÁCH HÀNG (MainLayout) */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="tops" element={<TopsPage />} />
                <Route path="bottoms" element={<BottomsPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />

                <Route
                    path="checkout"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="profile" element={<UserProfile />} />
                <Route path="profile/orders" element={<OrderHistory />} />
                <Route path="profile/wishlist" element={<Wishlist />} />
                <Route path="profile/addresses" element={<SavedAddresses />} />

                <Route
                    path="vip"
                    element={
                        <ProtectedRoute>
                            <VIPPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* 2. AUTH KHÁCH HÀNG (Login & Register) */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* 👇 3. ROUTE RIÊNG CHO LOGIN ADMIN (Nằm ngoài layout chính) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* 4. ADMIN DASHBOARD (Được bảo vệ bằng AdminRoute mới) */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                {/* 👇 Tự động chuyển hướng /admin -> /admin/dashboard */}
                <Route index element={<Navigate to="dashboard" replace />} />

                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="roles" element={<RoleManagement />} />
                <Route path="marketing" element={<MarketingManagement />} />
                <Route path="settings" element={<SettingsManagement />} />
            </Route>
        </Routes>
    );
}

export default App;
