import React from "react";
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
    // Mock Data cho biểu đồ doanh thu
    const data = [
        { name: "T2", rev: 4000, orders: 24 },
        { name: "T3", rev: 3000, orders: 13 },
        { name: "T4", rev: 2000, orders: 58 },
        { name: "T5", rev: 2780, orders: 39 },
        { name: "T6", rev: 1890, orders: 48 },
        { name: "T7", rev: 2390, orders: 38 },
        { name: "CN", rev: 3490, orders: 43 },
    ];

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Cập nhật lúc: 27/01/2025
                    </p>
                </div>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90">
                    <span className="material-symbols-outlined text-sm">
                        download
                    </span>{" "}
                    Xuất báo cáo
                </button>
            </div>

            {/* 1. OVERVIEW WIDGETS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Widget 1: Doanh thu */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <span className="material-symbols-outlined">
                                payments
                            </span>
                        </div>
                        <span className="flex items-center text-green-500 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                            +12.5%
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Tổng doanh thu
                    </p>
                    <h3 className="text-2xl font-black">$48,250.00</h3>
                </div>

                {/* Widget 2: Đơn hàng */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <span className="material-symbols-outlined">
                                shopping_cart
                            </span>
                        </div>
                        <span className="flex items-center text-blue-500 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            +8
                        </span>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Đơn hàng mới
                    </p>
                    <h3 className="text-2xl font-black">1,203</h3>
                </div>

                {/* Widget 3: Khách hàng mới */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <span className="material-symbols-outlined">
                                group_add
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                        Khách hàng mới
                    </p>
                    <h3 className="text-2xl font-black">432</h3>
                </div>

                {/* Widget 4: Low Stock (Quan trọng) */}
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl animate-pulse">
                            <span className="material-symbols-outlined">
                                warning
                            </span>
                        </div>
                        <button className="text-xs font-bold text-red-600 hover:underline">
                            Xem chi tiết
                        </button>
                    </div>
                    <p className="text-red-500/80 text-xs font-bold uppercase tracking-wider mb-1">
                        Sắp hết hàng
                    </p>
                    <h3 className="text-2xl font-black text-red-600">
                        5 Items
                    </h3>
                </div>
            </div>

            {/* 2. CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ doanh thu (Lớn) */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
                    <h3 className="text-lg font-bold mb-6">
                        Phân tích doanh thu
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
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
                                            stopColor="#135bec"
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#135bec"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#333"
                                    vertical={false}
                                    opacity={0.1}
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
                                        backgroundColor: "#1a2230",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rev"
                                    stroke="#135bec"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Sản phẩm (Nhỏ) */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
                    <h3 className="text-lg font-bold mb-6">Top Bán Chạy</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            {
                                name: "Graphic Tee",
                                sales: "1.2k",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAV5BGc5H_xbM5mP48zVPQtsAdE-FCW3uR2_0BKXG1I-IGjUSGs37vh5f6qSmwNsDPkWmJI2wlhRzWnGDtQJMoMNzyEVEPb5v4Dt3sa33iekr9PLBXyA1GTCnI_IoqpSzvC1Jjly04REmbEcOtZSrp1DzWf8P58u7MUGmT34suVzDX6DSSOdp097_tXf2tkpoJkdivke7h9EVbvg9k-dmfjJVMMDBxhnYEOWl59qB0nPr3SfMmjss3G7ScuEoCjd6zIFG9yFpJJx73S",
                            },
                            {
                                name: "Box Fit Hoodie",
                                sales: "940",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWJOLCHPMraqja7-KSXYuAlY80fWdkOUaLeHE0xKHNEya7zzLu1Y4yWZ1_VcZZGrW0pitSITEpJVjHDZd07w9XIN1dq4QGKbVFKC2pf-CBZhSbTalmMSIugwO9KGKzKSDEx0cUIA_o8ddVGAdnJ5FVOdnoHXVW1Q6x3YzWGZBnTknv4xfk16LV1TipNQXEPQ8TN6EXs0N49mWI-pf1bgr7O2Fv9uw-SpnnEtlsy4EcU4zO3CMeT4d2urZUoO42lbLMpC8IdMMouVW_",
                            },
                            {
                                name: "Cargo Pants",
                                sales: "850",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcdnxLFm9mJjoDh_SwFg-2miKSoRKAqWK2kCdmA7pl69LuJFSWXVAIth-Dd5e9fE7FHr5MaoLNpDCEgFl3q-Gak54Gx-ha-85g5M-J6TlnQOp2ykMA17d-G1k9CYJZORqbKo1Gnq-pTlAgvGGrWAJavX5ZFfn__4SwNFFfk7IumwI8vRpuuX0quq1KPArbgYU6lV1CmT_4oB1xSNwY1TnI9KmX9eO2ALBRBE__4s6uEt9jCyZllJPNVp4ozaGYsSJ_Bc6D3UJUHTAh",
                            },
                            {
                                name: "Dad Cap",
                                sales: "400",
                                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsV3456lEFutJnxsvkvgyej-gp9Sf1C155U2euoUE0urmPWE1EKgN2aIe2Piw8z5d8VWnN55WKH4vs9FPQFFnj6I8aFL_JBmtPgDXSj5-gFy1kAt3RDFC0vRjOkpZMlgJfUn7oHneX0gvQwgkM8Xw8iXy8prcpF0-exVRpXLlfvr5eBHAy1MrD1zoqHU2NEhN7oC7jw7A_SNB3LheJjNAeH1XJksZwH8wm4fCnyJuFUP60iOLnYfPoQv39kGlP1AxrTBJRxl_-yi-V",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-[#282e39] rounded-xl transition-colors"
                            >
                                <div
                                    className="size-12 rounded-lg bg-cover bg-center bg-gray-200"
                                    style={{
                                        backgroundImage: `url('${item.img}')`,
                                    }}
                                ></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm truncate">
                                        {item.name}
                                    </h4>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2">
                                        <div
                                            className="bg-primary h-1.5 rounded-full"
                                            style={{
                                                width: `${80 - idx * 15}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="font-bold text-sm">
                                    {item.sales}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. RECENT ORDERS (Hành động gấp) */}
            <div className="bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Đơn hàng gần đây</h3>
                    <button className="text-primary text-sm font-bold hover:underline">
                        Xem tất cả
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-[#282e39]">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">
                                    Mã đơn
                                </th>
                                <th className="px-4 py-3">Khách hàng</th>
                                <th className="px-4 py-3">Tổng tiền</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3 rounded-tr-lg text-right">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {[
                                {
                                    id: "#ORD-7782",
                                    user: "Alex Pham",
                                    total: "$120.00",
                                    status: "Pending",
                                },
                                {
                                    id: "#ORD-7781",
                                    user: "Sarah Nguyen",
                                    total: "$55.00",
                                    status: "Completed",
                                },
                                {
                                    id: "#ORD-7780",
                                    user: "Mike Tran",
                                    total: "$285.00",
                                    status: "Shipping",
                                },
                                {
                                    id: "#ORD-7779",
                                    user: "Jenny Wu",
                                    total: "$42.00",
                                    status: "Cancelled",
                                },
                                {
                                    id: "#ORD-7778",
                                    user: "Tom Holland",
                                    total: "$1200.00",
                                    status: "Pending",
                                },
                            ].map((order, idx) => (
                                <tr
                                    key={idx}
                                    className="hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                                >
                                    <td className="px-4 py-4 font-bold text-primary">
                                        {order.id}
                                    </td>
                                    <td className="px-4 py-4 font-bold">
                                        {order.user}
                                    </td>
                                    <td className="px-4 py-4">{order.total}</td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : order.status ===
                                                        "Completed"
                                                      ? "bg-green-100 text-green-600"
                                                      : order.status ===
                                                          "Shipping"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#282e39] hover:text-primary transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    visibility
                                                </span>
                                            </button>
                                            <button
                                                className="size-8 flex items-center justify-center rounded bg-gray-100 dark:bg-[#282e39] hover:text-green-500 transition-colors"
                                                title="Duyệt đơn"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    check
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
