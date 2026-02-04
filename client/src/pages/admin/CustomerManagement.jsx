import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch data from Server
    const fetchCustomers = async () => {
        try {
            const res = await axios.get("http://localhost:5165/api/users");
            setCustomers(res.data);
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
            await axios.delete(`http://localhost:5165/api/users/${id}`);
            alert("User deleted successfully!");
            fetchCustomers(); // Refresh the list
        } catch (error) {
            alert(
                "Error deleting user: " +
                    (error.response?.data?.message || "Server Error"),
            );
        }
    };

    // Helper: Dynamic colors for membership tiers
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
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Customer Management ({customers.length})
            </h1>

            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-200 dark:border-[#282e39] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-[#282e39] text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Total Spent</th>
                                <th className="px-6 py-4">Tier & Role</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
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
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                                                    {(
                                                        user.fullName ||
                                                        user.email
                                                    ).charAt(0)}
                                                </div>
                                                {user.fullName || "No Name"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex flex-col">
                                                <span>{user.email}</span>
                                                <span className="text-xs text-gray-400">
                                                    {user.phone || "---"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">
                                            ${user.totalSpent.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getTierColor(user.membershipTier)}`}
                                                >
                                                    {user.membershipTier}
                                                </span>
                                                <span className="text-xs text-gray-400 capitalize">
                                                    Role: {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== "admin" && (
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
