import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-[#282e39] bg-white dark:bg-[#0f1520] py-8">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* 1. Bên Trái: Logo */}
                <div className="flex items-center gap-2">
                    {/* Icon tia sét màu xanh */}
                    <span className="material-symbols-outlined text-primary text-2xl">
                        bolt
                    </span>
                    {/* Tên thương hiệu màu trắng (trong dark mode) */}
                    <span className="text-slate-900 dark:text-white text-lg font-extrabold tracking-tight uppercase">
                        Streetwear
                    </span>
                </div>

                {/* 2. Ở Giữa: Các đường link (Privacy, Terms, Returns) */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                    <Link
                        to="#"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="#"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        to="#"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                    >
                        Returns
                    </Link>
                </div>

                {/* 3. Bên Phải: Copyright */}
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    © 2024 Streetwear Inc.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
