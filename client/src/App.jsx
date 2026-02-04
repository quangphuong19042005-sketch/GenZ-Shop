import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import RegisterPage from "./pages/RegisterPage"; // Import

// --- ADMIN ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import MarketingManagement from "./pages/admin/MarketingManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";

import ProtectedRoute from "./components/ProtectedRoute";

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user || user.role !== "admin") {
        return <Navigate to="/" />;
    }
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

                {/* ❌ ĐÃ XÓA DÒNG /register Ở ĐÂY */}

                {/* PROFILE */}
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

            {/* 2. AUTH (Login & Register - AuthLayout) */}
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                {/* ✅ THÊM VÀO ĐÂY (Bỏ dấu / ở đầu) */}
                <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* 3. ADMIN */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="customers" element={<CustomerManagement />} />
                <Route path="marketing" element={<MarketingManagement />} />
                <Route path="settings" element={<SettingsManagement />} />
            </Route>
        </Routes>
    );
}

export default App;
