import React from "react";

const CartItem = ({ item }) => {
    return (
        <div className="group flex flex-col sm:flex-row gap-6 p-4 rounded-xl hover:bg-white dark:hover:bg-[#1a2230] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#282e39]">
            {/* Ảnh sản phẩm */}
            <div className="w-full sm:w-[140px] aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1a2230] relative shrink-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${item.image}')` }}
                ></div>
            </div>

            {/* Thông tin & Nút bấm */}
            <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold leading-tight mb-1 text-slate-900 dark:text-white">
                            {item.name}
                        </h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <span className="material-symbols-outlined text-[20px]">
                                delete
                            </span>
                        </button>
                    </div>
                    <p className="text-gray-500 dark:text-[#9da6b9] text-sm font-medium mb-1">
                        {item.color} / {item.size}
                    </p>
                    <p
                        className={`${item.stockStatus === "Low Stock" ? "text-orange-400" : "text-green-500"} text-xs font-bold uppercase tracking-wide`}
                    >
                        {item.stockStatus}
                    </p>
                </div>

                {/* Bộ điều khiển số lượng & Giá */}
                <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center border border-gray-200 dark:border-[#282e39] bg-white dark:bg-[#1a2230] rounded-full p-1 h-10 w-fit">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#282e39] text-slate-900 dark:text-white transition-colors">
                            <span className="material-symbols-outlined text-[16px]">
                                remove
                            </span>
                        </button>
                        <input
                            className="w-8 bg-transparent border-none text-center text-sm font-bold focus:ring-0 p-0 text-slate-900 dark:text-white"
                            type="number"
                            defaultValue={item.quantity}
                        />
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#282e39] text-slate-900 dark:text-white hover:bg-primary hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[16px]">
                                add
                            </span>
                        </button>
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                        ${item.price.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
