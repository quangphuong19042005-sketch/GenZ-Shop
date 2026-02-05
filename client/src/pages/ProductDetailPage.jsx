import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
// --- 1. Import Component Đánh giá ---
import ProductReviews from "../components/ProductReviews";

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // State cho việc chọn biến thể
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Danh sách Size và Color unique từ variants
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5165/api/products/${id}`,
                );
                const fetchedProduct = res.data;
                setProduct(fetchedProduct);

                // --- LOGIC XỬ LÝ BIẾN THỂ ---
                if (
                    fetchedProduct.variants &&
                    fetchedProduct.variants.length > 0
                ) {
                    // 1. Lấy list sizes unique
                    const sizes = [
                        ...new Set(fetchedProduct.variants.map((v) => v.size)),
                    ];
                    setAvailableSizes(sizes);
                    // Mặc định chọn size đầu tiên nếu có
                    if (sizes.length > 0) setSelectedSize(sizes[0]);

                    // 2. Lấy list colors unique
                    const colors = [
                        ...new Set(fetchedProduct.variants.map((v) => v.color)),
                    ];
                    setAvailableColors(colors);
                    // Mặc định chọn color đầu tiên nếu có
                    if (colors.length > 0) setSelectedColor(colors[0]);
                }
                // -----------------------------

                setLoading(false);
            } catch (error) {
                console.error("Lỗi:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Tìm variant cụ thể dựa trên Seleted Size & Color
    const currentVariant = product?.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor,
    );

    // Tính tồn kho hiện tại
    const currentStock = currentVariant ? currentVariant.stockQuantity : 0;

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Vui lòng chọn Size và Màu trước khi thêm vào giỏ!");
            return;
        }

        if (!currentVariant) {
            alert("Sản phẩm với tùy chọn này hiện không khả dụng!");
            return;
        }

        if (currentStock < quantity) {
            alert(`Chỉ còn ${currentStock} sản phẩm trong kho!`);
            return;
        }

        // Truyền thêm variantId nếu cần, nhưng context hiện tại dùng size/color để phân biệt
        addToCart(product, quantity, selectedSize, selectedColor);
        alert("Đã thêm vào giỏ hàng!");
    };

    if (loading)
        return (
            <div className="text-center py-20 font-bold">
                Đang tải sản phẩm...
            </div>
        );

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
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {" "}
            {/* Thêm wrapper bao ngoài để set nền */}
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
                        {product.description ||
                            "Chưa có mô tả cho sản phẩm này."}
                    </p>

                    {/* Chọn Size */}
                    <div>
                        <h3 className="font-bold text-sm mb-3 uppercase text-gray-500">
                            Select Size
                        </h3>
                        <div className="flex gap-3">
                            {availableSizes.length > 0 ? (
                                availableSizes.map((size) => (
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
                                ))
                            ) : (
                                <span className="text-gray-400 italic">
                                    One Size
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Chọn Color (Nếu có) */}
                    {availableColors.length > 0 && (
                        <div>
                            <h3 className="font-bold text-sm mb-3 uppercase text-gray-500">
                                Select Color
                            </h3>
                            <div className="flex gap-3">
                                {availableColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 rounded-lg border font-bold transition-all flex items-center justify-center
                                            ${
                                                selectedColor === color
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                    : "bg-white text-slate-900 border-gray-300 hover:border-slate-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chọn Số lượng */}
                    <div>
                        <h3 className="font-bold text-sm mb-3 uppercase text-gray-500">
                            Quantity
                            {currentVariant && (
                                <span className="ml-2 text-xs font-normal text-gray-400">
                                    ({currentStock} available)
                                </span>
                            )}
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
                                disabled={currentStock <= quantity}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Nút Mua & Yêu thích */}
                    <div className="mt-6 flex gap-4">
                        {/* Kiểm tra tồn kho cụ thể của biến thể */}
                        {currentStock > 0 ? (
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
                                {currentVariant
                                    ? "OUT OF STOCK"
                                    : "UNAVAILABLE"}
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
            {/* --- 2. PHẦN ĐÁNH GIÁ SẢN PHẨM --- */}
            {product && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <hr className="my-10 border-gray-200 dark:border-gray-800" />
                    <ProductReviews productId={product.id} />
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
