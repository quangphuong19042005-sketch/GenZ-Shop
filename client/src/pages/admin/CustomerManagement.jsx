import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient"; // 👇 1. Dùng axiosClient chuẩn
import { useAuth } from "../../context/AuthContext"; // 👇 2. Lấy info admin đang đăng nhập

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy thông tin admin hiện tại để tránh tự xóa/hạ quyền chính mình
    const { user: currentUser } = useAuth();

    // 1. Fetch data (Sửa đường dẫn thành /api/user cho khớp với Controller)
    const fetchCustomers = async () => {
        try {
            const res = await axiosClient.get("/api/user");
            setCustomers(res.data.users); // Backend trả về { success: true, users: [...] }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customers:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // 2. Delete customer handler
    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this user? This action cannot be undone!",
            )
        )
            return;

        try {
            await axiosClient.delete(`/api/user/${id}`); // Sửa lại endpoint nếu cần
            alert("User deleted successfully!");
            fetchCustomers();
        } catch (error) {
            alert(
                "Error deleting user: " +
                    (error.response?.data?.message || "Server Error"),
            );
        }
    };

    // 👇 3. HÀM MỚI: Cập nhật quyền (Phân quyền)
    const handleUpdateRole = async (userId, newRole) => {
        const action =
            newRole === "admin"
                ? "Thăng chức lên ADMIN"
                : "Hạ chức xuống MEMBER";
        if (!window.confirm(`Bạn có chắc muốn ${action} cho user này?`)) return;

        try {
            const res = await axiosClient.put(
                `/api/user/update-role/${userId}`,
                {
                    role: newRole,
                },
            );

            if (res.data.success) {
                alert(`Thành công! User đã được cập nhật thành ${newRole}.`);
                fetchCustomers(); // Load lại bảng ngay lập tức
            }
        } catch (error) {
            alert(
                "Lỗi: " +
                    (error.response?.data?.message ||
                        "Không thể cập nhật quyền"),
            );
        }
    };

    // Helper: Dynamic colors
    const getTierColor = (tier) => {
        switch (tier) {
            case "Diamond":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Platinum":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "Gold":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Customer & Role Management ({customers.length})
            </h1>

            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-200 dark:border-[#282e39] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-[#282e39] text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Info</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role & Tier</th>
                                <th className="px-6 py-4 text-center">
                                    Set Permissions
                                </th>
                                <th className="px-6 py-4 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        Loading data...
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-gray-400">
                                            #{user.id}
                                        </td>

                                        {/* Cột Info User */}
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold uppercase text-xs">
                                                    {(
                                                        user.fullName ||
                                                        user.username ||
                                                        "?"
                                                    ).charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>
                                                        {user.fullName ||
                                                            user.username}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-normal">
                                                        @{user.username}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Cột Contact */}
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col">
                                                <span>{user.email}</span>
                                                <span className="text-xs text-gray-400">
                                                    {user.phone || "---"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Cột Role & Tier */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                {/* Hiển thị Role Badge */}
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                                                        user.role === "admin"
                                                            ? "bg-purple-100 text-purple-700 border-purple-200"
                                                            : "bg-green-100 text-green-700 border-green-200"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getTierColor(user.membershipTier)}`}
                                                >
                                                    {user.membershipTier}
                                                </span>
                                            </div>
                                        </td>

                                        {/* 👇 CỘT MỚI: Cấp quyền */}
                                        <td className="px-6 py-4 text-center">
                                            {/* Không cho phép sửa chính mình */}
                                            {currentUser?.id !== user.id ? (
                                                <>
                                                    {user.role === "member" ? (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateRole(
                                                                    user.id,
                                                                    "admin",
                                                                )
                                                            }
                                                            className="bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1 mx-auto shadow-sm"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                arrow_upward
                                                            </span>
                                                            Make Admin
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateRole(
                                                                    user.id,
                                                                    "member",
                                                                )
                                                            }
                                                            className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-50 transition flex items-center gap-1 mx-auto"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                arrow_downward
                                                            </span>
                                                            Demote
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    (You)
                                                </span>
                                            )}
                                        </td>

                                        {/* Cột Xóa */}
                                        <td className="px-6 py-4 text-right">
                                            {currentUser?.id !== user.id && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Delete User"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        delete
                                                    </span>
                                                </button>
                                            )}
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

export default CustomerManagement;
