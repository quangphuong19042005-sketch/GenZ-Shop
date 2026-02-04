import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// 1. Import BrowserRouter để chạy định tuyến
import { BrowserRouter } from "react-router-dom";
// 2. Import AuthProvider (Đăng nhập)
import { AuthProvider } from "./context/AuthContext";
// 3. Import CartProvider (Giỏ hàng) - QUAN TRỌNG
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                {/* 4. Bọc CartProvider vào trong cùng để App dùng được logic giỏ hàng */}
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
