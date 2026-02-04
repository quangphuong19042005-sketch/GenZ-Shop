import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);

    // --- 1. LOGIC XỬ LÝ ẢNH THÔNG MINH (QUAN TRỌNG) ---
    // Backend trả về: "/images/ao1.jpg" -> React cần: "http://localhost:5165/images/ao1.jpg"
    // Nếu là link online (https://...) thì giữ nguyên.
    let imageUrl =
        product.imageUrl || product.image_url || "/images/placeholder.png";

    if (imageUrl.startsWith("/")) {
        imageUrl = `http://localhost:5165${imageUrl}`;
    }
    // ---------------------------------------------------

    // Logic Wishlist (Tim yêu thích)
    useEffect(() => {
        const storedWishlist = JSON.parse(
            localStorage.getItem("myWishlist") || "[]",
        );
        setIsWishlisted(storedWishlist.some((item) => item.id === product.id));
    }, [product.id]);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const storedWishlist = JSON.parse(
            localStorage.getItem("myWishlist") || "[]",
        );

        if (isWishlisted) {
            const newList = storedWishlist.filter(
                (item) => item.id !== product.id,
            );
            localStorage.setItem("myWishlist", JSON.stringify(newList));
            setIsWishlisted(false);
        } else {
            storedWishlist.push(product);
            localStorage.setItem("myWishlist", JSON.stringify(storedWishlist));
            setIsWishlisted(true);
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        alert("Đã thêm vào giỏ hàng!");
    };

    return (
        <div className="group relative flex flex-col gap-3">
            <Link
                to={`/product/${product.id}`}
                className="block overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 relative shadow-sm aspect-[3/4]"
            >
                {/* HIỂN THỊ ẢNH VỚI URL ĐÃ XỬ LÝ */}
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/400x600?text=No+Image"; // Ảnh thay thế nếu lỗi
                    }}
                />

                {/* Nút Tim */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:scale-110 transition-all"
                >
                    <span
                        className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${isWishlisted ? "text-red-500 font-variation-fill" : "text-slate-400 hover:text-red-500"}`}
                        style={
                            isWishlisted
                                ? { fontVariationSettings: "'FILL' 1" }
                                : {}
                        }
                    >
                        favorite
                    </span>
                </button>

                {/* Nút Quick Add */}
                <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-slate-900 py-3 text-sm font-bold shadow-lg hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            shopping_cart
                        </span>
                        Quick Add
                    </button>
                </div>
            </Link>

            <div className="flex flex-col">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {product.category || "Fashion"}
                </p>
                <div className="flex justify-between items-start mt-1">
                    <Link
                        to={`/product/${product.id}`}
                        className="text-base font-bold text-slate-900 dark:text-white line-clamp-1"
                    >
                        {product.name}
                    </Link>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                        ${product.price}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
