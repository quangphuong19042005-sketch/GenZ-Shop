import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState("");
    const [selectedPages, setSelectedPages] = useState([]);

    // Định nghĩa các trang Admin có trong hệ thống (ID phải khớp với AdminLayout)
    const pages = [
        { id: "products", label: "Quản lý Sản phẩm" },
        { id: "orders", label: "Quản lý Đơn hàng" },
        { id: "customers", label: "Quản lý Khách hàng" },
        { id: "roles", label: "Phân quyền (Roles)" }, // Cho phép ai đó quản lý quyền
        { id: "marketing", label: "Marketing" },
        { id: "settings", label: "Cấu hình hệ thống" },
    ];

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await axiosClient.get("/api/role");
            setRoles(res.data.roles);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateRole = async () => {
        if (!roleName) return alert("Vui lòng nhập tên quyền!");

        try {
            // Nối mảng thành chuỗi: ["orders", "products"] -> "orders,products"
            const permissionsString = selectedPages.join(",");

            await axiosClient.post("/api/role", {
                roleName: roleName,
                permissions: permissionsString,
                description: "Được tạo bởi Admin",
            });

            alert("Tạo quyền thành công!");
            setRoleName("");
            setSelectedPages([]);
            fetchRoles();
        } catch (error) {
            alert(
                "Lỗi: " +
                    (error.response?.data?.message || "Không thể tạo quyền"),
            );
        }
    };

    const handleDeleteRole = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa quyền này?")) return;
        try {
            await axiosClient.delete(`/api/role/${id}`);
            fetchRoles();
        } catch (error) {
            alert("Lỗi: " + error.response?.data?.message);
        }
    };

    const togglePage = (pageId) => {
        setSelectedPages((prev) =>
            prev.includes(pageId)
                ? prev.filter((p) => p !== pageId)
                : [...prev, pageId],
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* 👇 SỬA Ở ĐÂY: Thêm dark:text-white */}
            <h1 className="text-3xl font-black mb-8 text-slate-900 dark:text-white">
                Quản lý Phân Quyền (Roles)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM TẠO QUYỀN */}
                {/* Thêm dark:bg-[#1a2230] dark:border-[#282e39] cho khung */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-[#282e39] h-fit">
                    <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined">
                            add_moderator
                        </span>
                        Tạo Role Mới
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                Tên Role
                            </label>
                            {/* Thêm dark mode cho input */}
                            <input
                                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0b0e14] dark:text-white p-2.5 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-colors"
                                placeholder="VD: Shipper, Content Writer..."
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>

                        <div>
                            <p className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                Được phép truy cập:
                            </p>
                            <div className="space-y-2">
                                {pages.map((page) => (
                                    <label
                                        key={page.id}
                                        className="flex items-center gap-3 p-2 border border-gray-100 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="size-4 accent-slate-900"
                                            checked={selectedPages.includes(
                                                page.id,
                                            )}
                                            onChange={() => togglePage(page.id)}
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {page.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCreateRole}
                            className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-slate-900/20"
                        >
                            Lưu Role Mới
                        </button>
                    </div>
                </div>

                {/* DANH SÁCH QUYỀN */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-100 dark:border-[#282e39] overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-[#282e39] border-b border-gray-100 dark:border-gray-700 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4">Tên Quyền</th>
                                    <th className="p-4">Trang được truy cập</th>
                                    <th className="p-4 text-right">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                                    >
                                        {/* Tên Role: màu trắng ở dark mode */}
                                        <td className="p-4 font-bold text-slate-800 dark:text-white">
                                            {role.roleName}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {role.permissions === "all" ? (
                                                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded text-xs font-bold border border-purple-200 dark:border-purple-800">
                                                        FULL ACCESS
                                                    </span>
                                                ) : (
                                                    role.permissions
                                                        .split(",")
                                                        .map((p) => (
                                                            <span
                                                                key={p}
                                                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-100 dark:border-blue-800 capitalize"
                                                            >
                                                                {p}
                                                            </span>
                                                        ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            {role.roleName !== "admin" && (
                                                <button
                                                    onClick={() =>
                                                        handleDeleteRole(
                                                            role.id,
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                                    title="Xóa quyền"
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        delete
                                                    </span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManagement;
