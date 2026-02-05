import React, { useEffect, useState } from "react";
import axios from "axios";
// 1. Import Component Modal
import OrderDetailsModal from "../../components/OrderDetailsModal";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- State cho Modal chi tiết ---
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- 1. Load dữ liệu từ API ---
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:5165/api/orders");
            setOrders(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
            setLoading(false);
        }
    };

    // --- 2. Xử lý Xem chi tiết (MỚI THÊM) ---
    const handleViewDetails = async (id) => {
        try {
            // Gọi API lấy chi tiết đơn hàng (bao gồm OrderItems)
            // Vì list bên ngoài có thể không chứa list sản phẩm con
            const res = await axios.get(
                `http://localhost:5165/api/orders/${id}`,
            );
            setSelectedOrder(res.data); // Lưu data vào state
            setIsModalOpen(true); // Mở modal
        } catch (error) {
            console.error("Lỗi xem chi tiết:", error);
            alert("Không thể tải chi tiết đơn hàng.");
        }
    };

    // --- 3. Xử lý đổi trạng thái ---
    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(
                `http://localhost:5165/api/orders/${id}/status`,
                JSON.stringify(newStatus),
                { headers: { "Content-Type": "application/json" } },
            );

            setOrders(
                orders.map((order) =>
                    order.id === id ? { ...order, status: newStatus } : order,
                ),
            );
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Không thể cập nhật trạng thái.");
        }
    };

    // --- 4. Xử lý xóa đơn hàng ---
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            try {
                await axios.delete(`http://localhost:5165/api/orders/${id}`);
                setOrders(orders.filter((order) => order.id !== id));
            } catch (error) {
                console.error("Lỗi xóa:", error);
                alert("Không thể xóa đơn hàng.");
            }
        }
    };

    // --- 5. Tạo dữ liệu mẫu ---
    const handleSeedData = async () => {
        try {
            await axios.post("http://localhost:5165/api/orders/seed");
            fetchOrders();
            alert("Đã tạo dữ liệu mẫu!");
        } catch (error) {
            alert("Lỗi khi tạo dữ liệu mẫu hoặc dữ liệu đã tồn tại.");
        }
    };

    // Helper: Format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
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
            case "Completed":
            case "Delivered":
                return "text-green-700 bg-green-100 border border-green-200";
            case "Shipped":
            case "Shipping":
                return "text-blue-700 bg-blue-100 border border-blue-200";
            case "Cancelled":
                return "text-red-700 bg-red-100 border border-red-200";
            default:
                return "text-gray-700 bg-gray-100 border border-gray-200";
        }
    };

    if (loading)
        return (
            <div className="p-10 text-center">
                Đang tải danh sách đơn hàng...
            </div>
        );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    Quản lý Đơn hàng
                </h1>
                <button
                    onClick={handleSeedData}
                    className="text-xs font-bold text-blue-500 hover:underline border border-blue-200 px-3 py-1 rounded bg-blue-50"
                >
                    + Tạo dữ liệu mẫu
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-200 dark:border-[#282e39] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-[#282e39] text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Mã đơn</th>
                            <th className="px-6 py-4">Khách hàng</th>
                            <th className="px-6 py-4">Ngày đặt</th>
                            <th className="px-6 py-4">Tổng tiền</th>
                            <th className="px-6 py-4">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {orders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-8 text-gray-500"
                                >
                                    Chưa có đơn hàng nào.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-bold text-primary">
                                        {order.orderCode
                                            ? `#${order.orderCode}`
                                            : `#${order.id}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {order.recipientName}
                                            </span>
                                            <span className="text-[11px] text-gray-400">
                                                {order.recipientPhone}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                        ${order.totalAmount}
                                    </td>

                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    order.id,
                                                    e.target.value,
                                                )
                                            }
                                            className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Pending">
                                                Pending
                                            </option>
                                            <option value="Shipping">
                                                Shipping
                                            </option>
                                            <option value="Shipped">
                                                Shipped
                                            </option>
                                            <option value="Delivered">
                                                Delivered
                                            </option>
                                            <option value="Completed">
                                                Completed
                                            </option>
                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {/* Nút Xem Chi Tiết (MỚI) */}
                                            <button
                                                onClick={() =>
                                                    handleViewDetails(order.id)
                                                }
                                                className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    visibility
                                                </span>
                                            </button>

                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() =>
                                                    handleDelete(order.id)
                                                }
                                                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                                title="Xóa đơn hàng"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 6. Nhúng Modal vào cuối trang */}
            <OrderDetailsModal
                isOpen={isModalOpen}
                order={selectedOrder}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default OrderManagement;
