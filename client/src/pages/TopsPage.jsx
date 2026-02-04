import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import Animation
import ProductCard from "../components/ProductCard";

// --- COMPONENT CON: SKELETON LOADING (Hiệu ứng khung xương) ---
const ProductSkeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse">
        <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
    </div>
);

const TopsPage = () => {
    // --- 1. STATE ---
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 2. FILTER & SORT ---
    const [selectedCategory, setSelectedCategory] = useState("All Tops");
    const [selectedSize, setSelectedSize] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // --- 3. FETCH API ---
    useEffect(() => {
        const fetchTops = async () => {
            try {
                // Giả lập delay 0.5s để thấy hiệu ứng Skeleton (Thực tế bạn có thể bỏ setTimeout)
                setTimeout(async () => {
                    const res = await axios.get(
                        "http://localhost:5165/api/products",
                    );
                    const topsOnly = res.data.filter(
                        (p) => p.category === "Tops",
                    );
                    setAllProducts(topsOnly);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Lỗi:", error);
                setLoading(false);
            }
        };
        fetchTops();
    }, []);

    // --- 4. CORE LOGIC ---
    const processedProducts = useMemo(() => {
        let result = [...allProducts];

        // Filter Category
        if (selectedCategory !== "All Tops") {
            const keyword = selectedCategory.toLowerCase();
            const searchTerms = keyword.split(" ").filter((w) => w.length > 2);
            result = result.filter((p) =>
                searchTerms.some((term) => p.name.toLowerCase().includes(term)),
            );
        }

        // Filter Size
        if (selectedSize) {
            // Logic giả lập size
        }

        // Sort
        if (sortOption === "price-asc")
            result.sort((a, b) => a.price - b.price);
        else if (sortOption === "price-desc")
            result.sort((a, b) => b.price - a.price);
        else if (sortOption === "newest") result.sort((a, b) => b.id - a.id);

        return result;
    }, [allProducts, selectedCategory, selectedSize, sortOption]);

    // --- 5. PAGINATION ---
    const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
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
            <nav className="flex items-center gap-2 mb-6">
                <Link
                    to="/"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                >
                    Home
                </Link>
                <span className="material-symbols-outlined text-slate-400 text-sm">
                    chevron_right
                </span>
                <Link
                    to="/shop"
                    className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
                >
                    Shop
                </Link>
                <span className="material-symbols-outlined text-slate-400 text-sm">
                    chevron_right
                </span>
                <span className="text-slate-900 dark:text-white text-sm font-bold">
                    Tops
                </span>
            </nav>

            {/* Header Section with Animation */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
            >
                <div>
                    <h1 className="text-6xl font-black tracking-tighter mb-2 italic text-slate-900 dark:text-white">
                        TOPS
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {loading
                            ? "Calculating..."
                            : `${processedProducts.length} items found`}
                    </p>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {[
                        "All Tops",
                        "Graphic Tees",
                        "Oversized Hoodies",
                        "Utility Jackets",
                        "Tank Tops",
                    ].map((chip, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05 }} // Hiệu ứng phóng to khi hover
                            whileTap={{ scale: 0.95 }} // Hiệu ứng thu nhỏ khi click
                            onClick={() => setSelectedCategory(chip)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm
                                ${
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                Filters
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedSize("");
                                    setSelectedCategory("All Tops");
                                    setSortOption("default");
                                }}
                                className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Filter Size */}
                        <div className="mb-10">
                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">
                                Size
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                                {["XS", "S", "M", "L", "XL", "XXL"].map(
                                    (size) => (
                                        <motion.button
                                            key={size}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() =>
                                                setSelectedSize(
                                                    size === selectedSize
                                                        ? ""
                                                        : size,
                                                )
                                            }
                                            className={`h-10 border rounded-lg text-xs font-bold transition-colors
                                            ${
                                                selectedSize === size
                                                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                                    : "border-slate-200 dark:border-slate-800 hover:border-primary text-slate-500"
                                            }`}
                                        >
                                            {size}
                                        </motion.button>
                                    ),
                                )}
                            </div>
                        </div>
                    </motion.div>
                </aside>

                {/* Product Grid Area */}
                <div className="flex-1">
                    {/* Sorting Bar */}
                    <div className="flex items-center justify-between mb-8 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Page{" "}
                            <span className="font-bold text-slate-900 dark:text-white">
                                {currentPage}
                            </span>{" "}
                            of {totalPages || 1}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">
                                Sort by:
                            </span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer text-slate-900 dark:text-white outline-none hover:text-primary transition-colors"
                            >
                                <option value="default">Default</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-asc">
                                    Price: Low to High
                                </option>
                                <option value="price-desc">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* GRID PRODUCTS VỚI HIỆU ỨNG */}
                    {loading ? (
                        // Hiển thị Skeleton khi đang tải
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <ProductSkeleton key={n} />
                            ))}
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        // Hiển thị Empty State
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 flex flex-col items-center"
                        >
                            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                                search_off
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                No items found
                            </h3>
                            <p className="text-gray-500">
                                Try adjusting your filters or category.
                            </p>
                        </motion.div>
                    ) : (
                        // Hiển thị Grid sản phẩm thật
                        <motion.div
                            layout // <--- QUAN TRỌNG: Giúp các item tự bay về vị trí mới khi sort/filter
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

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <motion.div
                            layout
                            className="mt-20 flex justify-center items-center gap-4"
                        >
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                                    <motion.button
                                        key={page}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all relative
                                            ${
                                                currentPage === page
                                                    ? "text-white shadow-lg shadow-primary/40"
                                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                            }`}
                                    >
                                        {/* Hiệu ứng nền chạy theo nút active */}
                                        {currentPage === page && (
                                            <motion.div
                                                layoutId="activePage"
                                                className="absolute inset-0 bg-primary rounded-full -z-10"
                                            />
                                        )}
                                        {page}
                                    </motion.button>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopsPage;
