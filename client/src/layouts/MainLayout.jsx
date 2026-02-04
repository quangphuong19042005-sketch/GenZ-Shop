import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">
            {/* 1. Navbar nằm cố định ở đây */}
            <Navbar />

            {/* 2. Outlet là nơi nội dung thay đổi (HomePage, ShopPage sẽ hiện ở đây) */}
            <div className="flex-grow">
                <Outlet />
            </div>

            {/* 3. Footer nằm cố định ở đây */}
            <Footer />
        </div>
    );
};

export default MainLayout;
