import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import ProfileSidebar from "../components/ProfileSidebar"; // Đừng quên import sidebar

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                // 1. Kiểm tra xem trong LocalStorage có dữ liệu cũ không?
                const savedWishlist = localStorage.getItem("myWishlist");

                if (savedWishlist) {
                    // Nếu có (đã từng xóa hoặc sửa), thì dùng cái cũ
                    setWishlistItems(JSON.parse(savedWishlist));
                    setLoading(false);
                } else {
                    // 2. Nếu chưa có (lần đầu vào), mới gọi API lấy 4 cái mẫu
                    const res = await axios.get(
                        "http://localhost:5165/api/products",
                    );
                    const fakeWishlist = res.data.slice(0, 4);

                    setWishlistItems(fakeWishlist);
                    // Lưu luôn 4 cái mẫu này vào LocalStorage để lần sau dùng
                    localStorage.setItem(
                        "myWishlist",
                        JSON.stringify(fakeWishlist),
                    );
                    setLoading(false);
                }
            } catch (error) {
                console.error("Lỗi tải wishlist:", error);
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    // Hàm xóa (Cập nhật cả State và LocalStorage)
    const handleRemove = (id) => {
        const newItems = wishlistItems.filter((item) => item.id !== id);

        // 1. Cập nhật giao diện
        setWishlistItems(newItems);

        // 2. Cập nhật bộ nhớ trình duyệt (Để F5 không bị mất)
        localStorage.setItem("myWishlist", JSON.stringify(newItems));
    };

    // Hàm xóa tất cả
    const handleClearAll = () => {
        setWishlistItems([]);
        localStorage.removeItem("myWishlist"); // Xóa sạch trong bộ nhớ
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-bold animate-pulse">
                    Loading Wishlist...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f8f5] dark:bg-[#121212] min-h-screen font-display text-slate-900 dark:text-white">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    <ProfileSidebar />

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold">
                                Sản phẩm yêu thích ({wishlistItems.length})
                            </h1>
                            {wishlistItems.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-sm text-red-500 hover:underline font-bold"
                                >
                                    Xóa tất cả
                                </button>
                            )}
                        </div>

                        {wishlistItems.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-[#1a2230] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                                    favorite
                                </span>
                                <p className="text-gray-500 mb-6">
                                    Danh sách yêu thích đang trống.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlistItems.map((product) => (
                                    <div
                                        key={product.id}
                                        className="relative group"
                                    >
                                        <button
                                            onClick={() =>
                                                handleRemove(product.id)
                                            }
                                            className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                                            title="Xóa khỏi yêu thích"
                                        >
                                            <span className="material-symbols-outlined text-sm">
                                                close
                                            </span>
                                        </button>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Wishlist;
