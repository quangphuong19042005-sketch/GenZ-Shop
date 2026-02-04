import React from "react";

const ProductSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 animate-pulse">
            {/* Khung ảnh */}
            <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer"></div>
            </div>
            {/* Khung tên */}
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            {/* Khung giá */}
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
        </div>
    );
};

export default ProductSkeleton;
