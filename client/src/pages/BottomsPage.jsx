import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/ProductCard";

// Skeleton Loading
const ProductSkeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse">
        <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
    </div>
);

// --- 👇 COMPONENT BANNER MỚI (Tương tự TopsPage nhưng đổi nội dung) ---
const Banner = () => (
    <div className="relative w-full h-[250px] md:h-[350px] rounded-3xl overflow-hidden mb-8 group shadow-2xl">
        <img
            // Ảnh banner cho Bottoms (Quần) - Bạn có thể thay link ảnh khác nếu muốn
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2070&auto=format&fit=crop"
            alt="Bottoms Banner"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
            <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-yellow-400 font-bold tracking-widest text-xs md:text-sm mb-2 uppercase"
            >
                Essential Collection
            </motion.span>
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black text-white mb-3 italic tracking-tighter"
            >
                BOTTOMS <br /> REVOLUTION
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-sm md:text-base font-medium max-w-md line-clamp-2"
            >
                Từ Jeans bụi bặm đến Joggers thoải mái. Tìm kiếm phong cách phù
                hợp nhất cho đôi chân của bạn.
            </motion.p>
        </div>
    </div>
);
// --- 👆 KẾT THÚC BANNER ---

const CATEGORY_CHIPS = [
    "All Bottoms",
    "Jeans",
    "Joggers",
    "Shorts",
    "Cargos",
    "Trousers",
];

const SIZES = ["28", "29", "30", "31", "32", "34"];

const BottomsPage = () => {
    // --- STATE ---
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER & SORT ---
    const [selectedCategory, setSelectedCategory] = useState("All Bottoms");
    const [selectedSize, setSelectedSize] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // --- FETCH API ---
    useEffect(() => {
        const fetchBottoms = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5165/api/products",
                );
                const bottomsOnly = res.data.filter(
                    (p) =>
                        p.category === "Bottoms" &&
                        (p.isActive === true ||
                            p.IsActive === true ||
                            p.isActive === 1 ||
                            p.IsActive === 1),
                );
                setAllProducts(bottomsOnly);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBottoms();
    }, []);

    // --- CORE LOGIC ---
    const processedProducts = useMemo(() => {
        let result = [...allProducts];

        if (selectedCategory !== "All Bottoms") {
            const keyword = selectedCategory.toLowerCase();
            const searchTerms = keyword.split(" ").filter((w) => w.length > 2);
            result = result.filter((p) => {
                const productName = p.name.toLowerCase();
                return searchTerms.some((term) => productName.includes(term));
            });
        }

        if (selectedSize) {
            result = result.filter((p) =>
                p.variants?.some(
                    (v) => v.size === selectedSize && v.stockQuantity > 0,
                ),
            );
        }

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
                    Bottoms
                </span>
            </nav>

            {/* 👇 CHÈN BANNER VÀO ĐÂY */}
            <Banner />

            {/* Filter Chips - Đưa xuống dưới Banner */}
            <div className="flex justify-between items-end mb-8">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 w-full md:w-auto">
                    {CATEGORY_CHIPS.map((chip) => (
                        <motion.button
                            key={chip}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(chip)}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm border ${
                                selectedCategory === chip
                                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                            }`}
                        >
                            {chip}
                        </motion.button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-64 shrink-0 hidden lg:block sticky top-28 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Filters
                        </h3>
                        <button
                            onClick={() => {
                                setSelectedSize("");
                                setSelectedCategory("All Bottoms");
                                setSortOption("default");
                            }}
                            className="text-primary text-xs font-bold uppercase hover:underline"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="mb-8">
                        <h4 className="text-xs font-extrabold uppercase text-slate-400 mb-3">
                            Size
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                            {SIZES.map((size) => (
                                <button
                                    key={size}
                                    onClick={() =>
                                        setSelectedSize(
                                            selectedSize === size ? "" : size,
                                        )
                                    }
                                    className={`h-9 border rounded-md text-xs font-bold transition-all ${
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
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-bold text-slate-900 dark:text-white">
                                {processedProducts.length}
                            </span>{" "}
                            results
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500 hidden sm:inline">
                                Sort by:
                            </span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-transparent text-sm font-bold cursor-pointer text-slate-900 dark:text-white outline-none focus:ring-0 text-right"
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
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {[...Array(8)].map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    ) : paginatedProducts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                                search_off
                            </span>
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                                No items found
                            </h3>
                            <p className="text-slate-500">
                                Try adjusting your filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                            <AnimatePresence mode="popLayout">
                                {paginatedProducts.map((product) => (
                                    <motion.div
                                        layout
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-16 flex justify-center items-center gap-2">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={currentPage === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    chevron_left
                                </span>
                            </button>
                            <span className="text-sm font-bold px-4">
                                Page {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(p + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-sm">
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

export default BottomsPage;
