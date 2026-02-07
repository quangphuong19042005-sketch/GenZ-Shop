import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [roles, setRoles] = useState([]); // 1. Thêm state lưu danh sách Role
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();

    // Fetch Users & Roles
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Gọi song song cả 2 API để tiết kiệm thời gian
            const [usersRes, rolesRes] = await Promise.all([
                axiosClient.get("/api/user"),
                axiosClient.get("/api/role"),
            ]);

            setCustomers(usersRes.data.users);
            setRoles(rolesRes.data.roles); // Lưu danh sách role vào state
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Hàm cập nhật Role (Mới)
    const handleRoleChange = async (userId, newRole) => {
        if (
            !window.confirm(
                `Bạn có chắc muốn đổi quyền user này thành "${newRole}"?`,
            )
        )
            return;

        try {
            await axiosClient.put(`/api/user/update-role/${userId}`, {
                role: newRole,
            });
            alert("Cập nhật thành công!");
            fetchData(); // Load lại bảng
        } catch (error) {
            alert(
                "Lỗi: " +
                    (error.response?.data?.message || "Không thể cập nhật"),
            );
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa user này? Hành động không thể hoàn tác!"))
            return;
        try {
            await axiosClient.delete(`/api/user/${id}`);
            fetchData();
        } catch (error) {
            alert("Lỗi xóa user");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">
                Quản lý User & Phân Quyền
            </h1>

            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-200 dark:border-[#282e39] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-[#282e39] text-gray-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">User Info</th>
                                <th className="px-6 py-4">Vai trò hiện tại</th>
                                <th className="px-6 py-4">
                                    Đổi Quyền (Assign Role)
                                </th>
                                <th className="px-6 py-4 text-right">Xóa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {customers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                                >
                                    {/* INFO */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-white">
                                                {user.username
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {user.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* CURRENT ROLE */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                                user.role === "admin"
                                                    ? "bg-purple-100 text-purple-700 border-purple-200"
                                                    : "bg-blue-50 text-blue-600 border-blue-100"
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    {/* 👇 SELECT BOX CHỌN ROLE (Dynamic) */}
                                    <td className="px-6 py-4">
                                        {currentUser?.id !== user.id ? (
                                            <select
                                                className="bg-white dark:bg-[#0b0e14] border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white text-xs rounded p-2 outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                                                value={user.role} // Giá trị hiện tại
                                                onChange={(e) =>
                                                    handleRoleChange(
                                                        user.id,
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                {/* Option mặc định */}
                                                <option value="member">
                                                    Member (Khách hàng)
                                                </option>
                                                <option value="admin">
                                                    Admin (Full quyền)
                                                </option>

                                                {/* Render các role động từ database */}
                                                {roles
                                                    .filter(
                                                        (r) =>
                                                            r.roleName !==
                                                                "admin" &&
                                                            r.roleName !==
                                                                "member",
                                                    )
                                                    .map((r) => (
                                                        <option
                                                            key={r.id}
                                                            value={r.roleName}
                                                        >
                                                            {r.roleName
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                r.roleName.slice(
                                                                    1,
                                                                )}{" "}
                                                            ({r.description})
                                                        </option>
                                                    ))}
                                            </select>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">
                                                Không thể tự sửa
                                            </span>
                                        )}
                                    </td>

                                    {/* DELETE */}
                                    <td className="px-6 py-4 text-right">
                                        {currentUser?.id !== user.id && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">
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
    );
};

export default CustomerManagement;
