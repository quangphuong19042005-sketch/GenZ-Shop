import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
// --- 1. Import Component Modal Chi Tiết Hóa Đơn ---
import OrderDetailsModal from "../components/OrderDetailsModal";

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State cho Modal ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            // Gọi API lấy lịch sử đơn hàng theo User ID
            const res = await axios.get(
                `http://localhost:5165/api/orders/user/${user.id}`,
            );
            setOrders(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải lịch sử đơn hàng:", error);
            setLoading(false);
        }
    };

    // Helper: Format ngày tháng
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Helper: Màu sắc trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "text-yellow-700 bg-yellow-100 border border-yellow-200";
            case "Confirmed":
                return "text-blue-700 bg-blue-100 border border-blue-200";
            case "Shipping":
            case "Shipped":
                return "text-purple-700 bg-purple-100 border border-purple-200";
            case "Delivered":
            case "Completed":
                return "text-green-700 bg-green-100 border border-green-200";
            case "Cancelled":
                return "text-red-700 bg-red-100 border border-red-200";
            default:
                return "text-gray-700 bg-gray-100 border border-gray-200";
        }
    };

    // --- 2. Hàm xử lý khi bấm nút "Chi tiết" (Mũi tên) ---
    const handleViewDetails = async (orderId) => {
        try {
            // Gọi API lấy chi tiết đầy đủ của đơn hàng (bao gồm OrderItems)
            const res = await axios.get(
                `http://localhost:5165/api/orders/${orderId}`,
            );
            setSelectedOrder(res.data); // Lưu thông tin đơn hàng vào state
            setIsModalOpen(true); // Mở Modal
        } catch (error) {
            console.error("Lỗi lấy chi tiết đơn:", error);
            alert("Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
            </div>
        );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-primary transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link
                    to="/profile"
                    className="hover:text-primary transition-colors"
                >
                    Profile
                </Link>
                <span>/</span>
                <span className="font-bold text-slate-900 dark:text-white">
                    Order History
                </span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
                <Link
                    to="/profile"
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
                >
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </Link>
                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Lịch sử mua hàng
                </h1>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                        receipt_long
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Chưa có đơn hàng nào
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Bạn chưa đặt mua sản phẩm nào từ cửa hàng.
                    </p>
                    <Link
                        to="/shop"
                        className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1a2230] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/80">
                                <tr className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                                    <th className="py-5 px-6">Mã đơn</th>
                                    <th className="py-5 px-6">Ngày đặt</th>
                                    <th className="py-5 px-6">Địa chỉ</th>
                                    <th className="py-5 px-6">Tổng tiền</th>
                                    <th className="py-5 px-6">Trạng thái</th>
                                    <th className="py-5 px-6 text-right">
                                        Chi tiết
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="py-5 px-6 font-bold text-primary">
                                            {order.orderCode
                                                ? `#${order.orderCode}`
                                                : `#${order.id}`}
                                        </td>

                                        <td className="py-5 px-6 text-slate-700 dark:text-gray-300">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {
                                                        formatDate(
                                                            order.createdAt,
                                                        ).split(" ")[1]
                                                    }
                                                </span>{" "}
                                                <span className="text-xs text-gray-400">
                                                    {
                                                        formatDate(
                                                            order.createdAt,
                                                        ).split(" ")[0]
                                                    }
                                                </span>{" "}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-slate-700 dark:text-gray-300 max-w-xs">
                                            <div
                                                className="truncate"
                                                title={order.shippingAddress}
                                            >
                                                {order.shippingAddress}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {order.recipientName} •{" "}
                                                {order.recipientPhone}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 font-bold text-slate-900 dark:text-white text-lg">
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="py-5 px-6">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}
                                            >
                                                {order.status === "Pending" && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                                                )}
                                                {(order.status === "Shipped" ||
                                                    order.status ===
                                                        "Shipping") && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                                )}
                                                {(order.status ===
                                                    "Completed" ||
                                                    order.status ===
                                                        "Delivered") && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                )}
                                                {order.status}
                                            </span>
                                        </td>

                                        {/* 👇 CỘT NÚT CHI TIẾT (Đã gắn sự kiện onClick) */}
                                        <td className="py-5 px-6 text-right">
                                            <button
                                                onClick={() =>
                                                    handleViewDetails(order.id)
                                                }
                                                className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                                title="Xem chi tiết hóa đơn"
                                            >
                                                <span className="material-symbols-outlined">
                                                    arrow_forward_ios
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- 3. Component Modal Popup (Đặt ở cuối trang) --- */}
            <OrderDetailsModal
                isOpen={isModalOpen}
                order={selectedOrder}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default OrderHistory;
