import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";

// Skeleton Loading Component
const ProductSkeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse">
        <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
    </div>
);

const CATEGORY_CHIPS = [
    "All Tops",
    "Graphic Tees",
    "Oversized Hoodies",
    "Utility Jackets",
    "Tank Tops",
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const TopsPage = () => {
    // --- STATE ---
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER & SORT ---
    const [selectedCategory, setSelectedCategory] = useState("All Tops");
    const [selectedSize, setSelectedSize] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // --- FETCH API ---
    useEffect(() => {
        const fetchTops = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5165/api/products",
                );

                // Lọc sản phẩm thuộc Tops và đang Active
                const topsOnly = res.data.filter(
                    (p) => p.category === "Tops" && p.isActive === true,
                );

                setAllProducts(topsOnly);
            } catch (error) {
                console.error("Lỗi fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTops();
    }, []);

    // --- CORE LOGIC (FILTER & SORT) ---
    const processedProducts = useMemo(() => {
        let result = [...allProducts];

        // 1. Filter Category (Tìm kiếm theo tên sản phẩm dựa trên Category Chip)
        if (selectedCategory !== "All Tops") {
            const keyword = selectedCategory.toLowerCase();
            const searchTerms = keyword.split(" ").filter((w) => w.length > 2);
            result = result.filter((p) => {
                const productName = p.name.toLowerCase();
                return searchTerms.some((term) => productName.includes(term));
            });
        }

        // 2. Filter Size (ĐÃ SỬA: Lọc dựa trên bảng variants)
        if (selectedSize) {
            result = result.filter((p) =>
                // Giữ lại sản phẩm nếu có ít nhất 1 biến thể đúng Size và còn hàng
                p.variants?.some(
                    (v) => v.size === selectedSize && v.stockQuantity > 0,
                ),
            );
        }

        // 3. Sort
        switch (sortOption) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                result.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }

        return result;
    }, [allProducts, selectedCategory, selectedSize, sortOption]);

    // --- PAGINATION ---
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage) || 1;
    const paginatedProducts = processedProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSize, sortOption]);

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 py-8 min-h-screen">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-sm">
                <Link
                    to="/"
                    className="text-slate-500 hover:text-primary transition-colors"
                >
                    Home
                </Link>
                <span className="material-symbols-outlined text-slate-400 text-sm">
                    chevron_right
                </span>
                <Link
                    to="/shop"
                    className="text-slate-500 hover:text-primary transition-colors"
                >
                    Shop
                </Link>
                <span className="material-symbols-outlined text-slate-400 text-sm">
                    chevron_right
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                    Tops
                </span>
            </nav>

            {/* Header & Filter Chips */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
            >
                <div>
                    <h1 className="text-6xl font-black tracking-tighter mb-2 italic text-slate-900 dark:text-white">
                        TOPS
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {loading
                            ? "Loading..."
                            : `${processedProducts.length} items found`}
                    </p>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORY_CHIPS.map((chip) => (
                        <motion.button
                            key={chip}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(chip)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm ${
                                selectedCategory === chip
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {chip}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <div className="flex gap-10">
                {/* Sidebar Filter */}
                <aside className="w-64 shrink-0 hidden lg:block sticky top-28 h-fit">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Filters
                        </h3>
                        <button
                            onClick={() => {
                                setSelectedSize("");
                                setSelectedCategory("All Tops");
                                setSortOption("default");
                            }}
                            className="text-primary text-xs font-bold uppercase hover:underline"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="mb-10">
                        <h4 className="text-xs font-extrabold uppercase text-slate-400 mb-4">
                            Size
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                            {SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={() =>
                                        setSelectedSize(
                                            size === selectedSize ? "" : size,
                                        )
                                    }
                                    className={`h-10 border rounded-lg text-xs font-bold transition-all ${
                                        selectedSize === size
                                            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                            : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary"
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Sort Bar */}
                    <div className="flex items-center justify-between mb-8 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Page{" "}
                            <span className="font-bold text-slate-900 dark:text-white">
                                {currentPage}
                            </span>{" "}
                            of {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">
                                Sort by:
                            </span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold cursor-pointer text-slate-900 dark:text-white outline-none hover:text-primary focus:ring-0"
                            >
                                <option value="default">Default</option>
                                <option value="newest">Newest</option>
                                <option value="price-asc">
                                    Price: Low to High
                                </option>
                                <option value="price-desc">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                                search_off
                            </span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                                No items found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your filters.
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {paginatedProducts.map((product) => (
                                    <motion.div
                                        layout
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center gap-4">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined">
                                    chevron_left
                                </span>
                            </button>
                            <div className="flex gap-2">
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === page ? "bg-primary text-white shadow-lg shadow-primary/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(p + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopsPage;
