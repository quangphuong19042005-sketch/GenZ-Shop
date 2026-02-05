import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

const AdminDashboard = () => {
    // State lưu dữ liệu từ API
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        lowStockCount: 0,
        recentOrders: [],
        chartData: [],
    });
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu khi vào trang
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5165/api/dashboard/stats",
                );
                setStats(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper format tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    // Helper format ngày
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                Đang tải dữ liệu báo cáo...
            </div>
        );

    return (
        <div className="flex flex-col gap-8 p-6 bg-gray-900 min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Dữ liệu thời gian thực
                    </p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                    <span className="material-symbols-outlined text-sm">
                        download
                    </span>{" "}
                    Xuất báo cáo
                </button>
            </div>

            {/* 1. OVERVIEW WIDGETS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Widget 1: Doanh thu */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-900/30 text-green-400 rounded-xl">
                            <span className="material-symbols-outlined">
                                payments
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                        Tổng doanh thu
                    </p>
                    <h3 className="text-2xl font-black text-white">
                        {formatCurrency(stats.totalRevenue)}
                    </h3>
                </div>

                {/* Widget 2: Đơn hàng */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl">
                            <span className="material-symbols-outlined">
                                shopping_cart
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                        Tổng đơn hàng
                    </p>
                    <h3 className="text-2xl font-black text-white">
                        {stats.totalOrders}
                    </h3>
                </div>

                {/* Widget 3: Khách hàng */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-900/30 text-purple-400 rounded-xl">
                            <span className="material-symbols-outlined">
                                group_add
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                        Khách hàng
                    </p>
                    <h3 className="text-2xl font-black text-white">
                        {stats.totalCustomers}
                    </h3>
                </div>

                {/* Widget 4: Sắp hết hàng */}
                <div className="bg-red-900/10 p-6 rounded-2xl shadow-sm border border-red-900/30 hover:border-red-900/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-900/20 text-red-500 rounded-xl animate-pulse">
                            <span className="material-symbols-outlined">
                                warning
                            </span>
                        </div>
                    </div>
                    <p className="text-red-400/80 text-xs font-bold uppercase tracking-wider mb-1">
                        Sắp hết hàng
                    </p>
                    <h3 className="text-2xl font-black text-red-500">
                        {stats.lowStockCount} Items
                    </h3>
                </div>
            </div>

            {/* 2. CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ doanh thu (Lớn) */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-6">
                        Doanh thu 7 ngày qua
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient
                                        id="colorRev"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#374151"
                                    vertical={false}
                                    opacity={0.5}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1f2937",
                                        border: "1px solid #374151",
                                        borderRadius: "12px",
                                        color: "#fff",
                                        boxShadow:
                                            "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                                    }}
                                    itemStyle={{ color: "#e5e7eb" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rev"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    name="Doanh thu"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Sản phẩm (Có thể làm API riêng sau, tạm thời giữ Mock hoặc ẩn đi nếu chưa làm) */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">
                            bar_chart
                        </span>
                        <p className="text-gray-400">
                            Chức năng Top sản phẩm <br /> đang phát triển...
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. RECENT ORDERS (Hành động gấp) */}
            <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white">
                        Đơn hàng mới nhất
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-lg font-bold">
                                    Mã đơn
                                </th>
                                <th className="px-6 py-4 font-bold">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-4 font-bold">
                                    Ngày đặt
                                </th>
                                <th className="px-6 py-4 font-bold">
                                    Tổng tiền
                                </th>
                                <th className="px-6 py-4 rounded-tr-lg font-bold">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {stats.recentOrders.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-4"
                                    >
                                        Chưa có đơn hàng nào
                                    </td>
                                </tr>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-blue-400">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-200">
                                            {order.recipientName}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border 
                                                ${
                                                    order.status === "Pending"
                                                        ? "bg-yellow-900/20 text-yellow-400 border-yellow-800"
                                                        : order.status ===
                                                            "Completed"
                                                          ? "bg-green-900/20 text-green-400 border-green-800"
                                                          : "bg-gray-700 text-gray-300 border-gray-600"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
