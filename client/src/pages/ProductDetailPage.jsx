import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5165/api/products/${id}`,
                );
                setProduct(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Vui lòng chọn Size trước khi thêm vào giỏ!");
            return;
        }
        addToCart(product, quantity, selectedSize, "Black");
        alert("Đã thêm vào giỏ hàng!");
    };

    if (loading)
        return (
            <div className="text-center py-20 font-bold">
                Đang tải sản phẩm...
            </div>
        );

    // 👇 1. KIỂM TRA TRẠNG THÁI ACTIVE
    // Nếu không có sản phẩm HOẶC sản phẩm bị tắt (false/0) -> Báo lỗi ngay
    const isInactive =
        product?.isActive === false || product?.IsActive === false;

    if (!product || isInactive)
        return (
            <div className="text-center py-40 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                    sentiment_dissatisfied
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Sản phẩm không tồn tại
                </h2>
                <p className="text-gray-500 mt-2">
                    Sản phẩm này có thể đã bị xóa hoặc ngừng kinh doanh.
                </p>
                <Link
                    to="/shop"
                    className="mt-6 text-primary font-bold hover:underline"
                >
                    Quay lại cửa hàng
                </Link>
            </div>
        );

    // --- XỬ LÝ ẢNH ---
    let imageUrl =
        product.imageUrl || product.image_url || "/images/placeholder.png";

    if (imageUrl && imageUrl.startsWith("/")) {
        imageUrl = `http://localhost:5165${imageUrl}`;
    }
    // ----------------

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Cột Trái: Ảnh */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm aspect-[3/4] md:aspect-auto group">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/600x800?text=No+Image";
                    }}
                />
            </div>

            {/* Cột Phải: Thông tin */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/shop" className="hover:text-primary">
                        Shop
                    </Link>
                    <span>/</span>
                    <span className="text-primary font-bold">
                        {product.category}
                    </span>
                </div>

                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase leading-tight">
                    {product.name}
                </h1>

                <p className="text-3xl font-bold text-primary">
                    ${product.price}
                </p>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description || "Chưa có mô tả cho sản phẩm này."}
                </p>

                {/* Chọn Size */}
                <div>
                    <h3 className="font-bold text-sm mb-3 uppercase text-gray-500">
                        Select Size
                    </h3>
                    <div className="flex gap-3">
                        {["S", "M", "L", "XL"].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-lg border font-bold transition-all flex items-center justify-center
                                    ${
                                        selectedSize === size
                                            ? "bg-slate-900 text-white border-slate-900 shadow-md scale-110"
                                            : "bg-white text-slate-900 border-gray-300 hover:border-slate-900 hover:bg-gray-50"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chọn Số lượng */}
                <div>
                    <h3 className="font-bold text-sm mb-3 uppercase text-gray-500">
                        Quantity
                    </h3>
                    <div className="flex items-center gap-4 bg-gray-100 w-fit p-1 rounded-full border border-gray-200">
                        <button
                            className="w-10 h-10 bg-white rounded-full font-bold shadow-sm hover:bg-gray-50 transition flex items-center justify-center"
                            onClick={() =>
                                setQuantity((q) => Math.max(1, q - 1))
                            }
                        >
                            -
                        </button>
                        <span className="text-xl font-bold w-8 text-center text-slate-900">
                            {quantity}
                        </span>
                        <button
                            className="w-10 h-10 bg-white rounded-full font-bold shadow-sm hover:bg-gray-50 transition flex items-center justify-center"
                            onClick={() => setQuantity((q) => q + 1)}
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Nút Mua & Yêu thích */}
                <div className="mt-6 flex gap-4">
                    {/* Kiểm tra tồn kho trước khi hiện nút mua */}
                    {product.stockQuantity > 0 ? (
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-slate-900 text-white py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">
                                shopping_cart
                            </span>
                            ADD TO CART - $
                            {(product.price * quantity).toFixed(2)}
                        </button>
                    ) : (
                        <button
                            disabled
                            className="flex-1 bg-gray-300 text-gray-500 py-4 rounded-full font-bold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">
                                block
                            </span>
                            OUT OF STOCK
                        </button>
                    )}

                    <button className="size-16 flex items-center justify-center rounded-full border border-gray-300 hover:border-red-500 hover:text-red-500 transition hover:bg-red-50">
                        <span className="material-symbols-outlined">
                            favorite
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
