import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    // Helper format tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    // Helper format ngày
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN");
    };

    // Helper lấy ảnh (nếu có)
    const getImageUrl = (url) => {
        if (!url) return "https://placehold.co/100?text=No+Image";
        return url.startsWith("http") ? url : `http://localhost:5165${url}`;
    };

    return (
        <AnimatePresence>
            {/* Backdrop mờ */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()} // Chặn click xuyên qua modal
                    className="bg-white dark:bg-[#1a2230] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-[#232b3a]">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Hóa đơn #{order.id}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">
                                close
                            </span>
                        </button>
                    </div>

                    {/* Body (Scrollable) */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {/* Thông tin khách hàng */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">
                                    Người nhận
                                </h3>
                                <p className="font-bold text-slate-900 dark:text-white">
                                    {order.recipientName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {order.recipientPhone}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">
                                    Địa chỉ giao hàng
                                </h3>
                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                                    {order.shippingAddress}
                                </p>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="border rounded-xl border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-[#232b3a] text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            Sản phẩm
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            SL
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Đơn giá
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Tổng
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {order.orderItems?.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="text-slate-900 dark:text-gray-200"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
                                                        <img
                                                            src={getImageUrl(
                                                                item.product
                                                                    ?.imageUrl,
                                                            )}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold truncate max-w-[150px]">
                                                            {item.product
                                                                ?.name ||
                                                                "Sản phẩm cũ"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {/* Nếu bạn có lưu size/color trong OrderItem thì hiển thị ở đây */}
                                                            Size:{" "}
                                                            {item.product
                                                                ?.variants?.[0]
                                                                ?.size || "?"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center font-medium">
                                                x{item.quantity}
                                            </td>
                                            <td className="px-4 py-4 text-right text-gray-500">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="px-4 py-4 text-right font-bold">
                                                {formatCurrency(
                                                    item.price * item.quantity,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tổng kết */}
                        <div className="flex justify-end">
                            <div className="w-1/2 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tạm tính:</span>
                                    <span>
                                        {formatCurrency(order.totalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Phí vận chuyển:</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-primary border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                                    <span>TỔNG CỘNG:</span>
                                    <span>
                                        {formatCurrency(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 dark:bg-[#232b3a] border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                order.status === "Completed"
                                    ? "bg-green-100 text-green-600"
                                    : order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-red-100 text-red-600"
                            }`}
                        >
                            {order.status}
                        </span>
                        <button className="text-sm font-bold text-gray-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-lg">
                                print
                            </span>{" "}
                            In hóa đơn
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderDetailsModal;
