import React, { useEffect, useState } from "react"; // 1. Thêm useEffect, useState
import { Link } from "react-router-dom";
import axios from "axios"; // 2. Import axios
import ProductCard from "../components/ProductCard";

const ShopPage = () => {
    // 3. Khởi tạo State để chứa dữ liệu thật
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 4. Gọi API từ Server .NET (Port 5165)
    useEffect(() => {
        axios
            .get("http://localhost:5165/api/products")
            .then((res) => {
                setProducts(res.data); // Lưu dữ liệu vào biến products
                setLoading(false); // Tắt loading
            })
            .catch((err) => {
                console.error("Lỗi lấy sản phẩm:", err);
                setLoading(false);
            });
    }, []);

    // 5. Hiển thị màn hình chờ khi đang tải
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-bold text-slate-900 dark:text-white animate-pulse">
                    Loading Collection...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
            {/* Breadcrumbs & Heading (Giữ nguyên giao diện của bạn) */}
            <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Link
                        to="/"
                        className="text-gray-500 dark:text-[#9da6b9] text-sm font-medium hover:text-primary transition-colors"
                    >
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-slate-900 dark:text-white text-sm font-bold">
                        Shop
                    </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200 dark:border-[#282e39]">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 uppercase">
                            Shop Collection
                        </h1>
                        <p className="text-gray-500 dark:text-[#9da6b9] text-lg">
                            Essential streetwear for the modern generation.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-[#282e39] text-slate-900 dark:text-white font-bold text-sm">
                            {products.length} Items
                        </span>
                    </div>
                </div>
            </div>

            {/* Layout chính */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Filters (Giữ nguyên code cũ của bạn) */}
                <aside className="w-full lg:w-1/4 flex-shrink-0">
                    <div className="lg:sticky lg:top-28 space-y-6">
                        {/* Price Filter */}
                        <div className="rounded-2xl bg-white dark:bg-[#181f2d] p-5 shadow-sm border border-gray-100 dark:border-[#282e39]">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                Price Range
                            </h4>
                            <div className="px-2 pt-2 pb-6">
                                <div className="relative h-1 bg-gray-200 dark:bg-[#3b4354] rounded-full">
                                    <div className="absolute left-[20%] right-[30%] h-full bg-primary rounded-full"></div>
                                </div>
                                <div className="flex justify-between mt-4 text-sm font-bold dark:text-white">
                                    <span>$45</span>
                                    <span>$120</span>
                                </div>
                            </div>
                        </div>
                        {/* Category Filter */}
                        <details
                            className="group rounded-2xl bg-white dark:bg-[#181f2d] px-5 py-3 shadow-sm border border-gray-100 dark:border-[#282e39]"
                            open
                        >
                            <summary className="flex cursor-pointer items-center justify-between py-2 font-bold text-slate-900 dark:text-white">
                                Category{" "}
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                                    expand_more
                                </span>
                            </summary>
                            <div className="pt-2 pb-2 flex flex-col gap-2">
                                {[
                                    "All Items",
                                    "Tops",
                                    "Bottoms",
                                    "Accessories",
                                ].map((item, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors dark:text-gray-300"
                                    >
                                        <div
                                            className={`size-5 rounded border flex items-center justify-center ${idx === 0 ? "bg-primary border-primary text-white" : "border-gray-300"}`}
                                        >
                                            {idx === 0 && (
                                                <span className="material-symbols-outlined text-[16px]">
                                                    check
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </details>
                    </div>
                </aside>

                {/* PRODUCT GRID */}
                <div className="flex-1">
                    {/* Kiểm tra nếu không có sản phẩm nào */}
                    {products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            Chưa có sản phẩm nào trong Database.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {products.map((product) => (
                                // Quan trọng: Đảm bảo ProductCard nhận đúng props từ API .NET
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
