import React, { useState, useEffect } from "react";
import axios from "axios";

const MarketingManagement = () => {
    const [coupons, setCoupons] = useState([]);

    // Form States
    const [newCode, setNewCode] = useState("");
    const [discount, setDiscount] = useState("");
    const [usageLimit, setUsageLimit] = useState(100); // Mặc định 100 lượt
    const [expiryDate, setExpiryDate] = useState(""); // Rỗng = Vĩnh viễn
    const [loading, setLoading] = useState(false);

    // Helper: Format ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return "Vĩnh viễn";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const fetchCoupons = async () => {
        try {
            const res = await axios.get("http://localhost:5165/api/coupons");
            setCoupons(res.data);
        } catch (error) {
            console.error("Lỗi lấy mã giảm giá:", error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreateCoupon = async () => {
        if (!newCode || !discount) {
            alert("Vui lòng nhập Mã code và % Giảm giá!");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                code: newCode,
                discountPercent: parseInt(discount),
                isActive: true,
                usageLimit: parseInt(usageLimit) || 100, // Nếu ko nhập thì lấy 100
                validUntil: expiryDate ? new Date(expiryDate) : null, // Null = Vĩnh viễn
            };

            await axios.post("http://localhost:5165/api/coupons", payload);

            alert("Tạo mã thành công! 🎉");

            // Reset form
            setNewCode("");
            setDiscount("");
            setUsageLimit(100);
            setExpiryDate("");

            fetchCoupons();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Lỗi khi tạo mã");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa mã này?")) return;
        try {
            await axios.delete(`http://localhost:5165/api/coupons/${id}`);
            fetchCoupons();
        } catch (error) {
            alert("Lỗi khi xóa mã");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Marketing & Khuyến mãi
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FORM TẠO MÃ */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-gray-200 dark:border-[#282e39] h-fit">
                    <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                        Tạo mã giảm giá mới
                    </h3>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={newCode}
                            onChange={(e) =>
                                setNewCode(e.target.value.toUpperCase())
                            }
                            placeholder="Mã Code (VD: TET2025)"
                            className="border p-2 rounded bg-transparent text-slate-900 dark:text-white dark:border-gray-700 uppercase"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Giảm giá (%)
                                </label>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) =>
                                        setDiscount(e.target.value)
                                    }
                                    placeholder="%"
                                    className="w-full border p-2 rounded bg-transparent text-slate-900 dark:text-white dark:border-gray-700"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Lượt dùng tối đa
                                </label>
                                <input
                                    type="number"
                                    value={usageLimit}
                                    onChange={(e) =>
                                        setUsageLimit(e.target.value)
                                    }
                                    placeholder="SL"
                                    className="w-full border p-2 rounded bg-transparent text-slate-900 dark:text-white dark:border-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                Hạn sử dụng (Bỏ trống = Vĩnh viễn)
                            </label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="w-full border p-2 rounded bg-transparent text-slate-900 dark:text-white dark:border-gray-700"
                            />
                        </div>

                        <button
                            onClick={handleCreateCoupon}
                            disabled={loading}
                            className="bg-primary text-white font-bold py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 mt-2"
                        >
                            {loading ? "Đang tạo..." : "Tạo Mã Ngay"}
                        </button>
                    </div>
                </div>

                {/* DANH SÁCH MÃ */}
                <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-gray-200 dark:border-[#282e39]">
                    <h3 className="font-bold mb-4 text-slate-900 dark:text-white">
                        Danh sách mã ({coupons.length})
                    </h3>

                    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
                        {coupons.length === 0 ? (
                            <p className="text-gray-500 text-sm italic">
                                Chưa có mã giảm giá nào.
                            </p>
                        ) : (
                            coupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="flex justify-between items-start p-3 bg-gray-50 dark:bg-[#282e39] rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-primary text-lg">
                                                {coupon.code}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${coupon.isActive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
                                            >
                                                {coupon.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
                                            Giảm {coupon.discountPercent}%
                                        </p>

                                        <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">
                                                    calendar_month
                                                </span>
                                                <span>
                                                    HSD:{" "}
                                                    {formatDate(
                                                        coupon.validUntil,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">
                                                    group
                                                </span>
                                                <span>
                                                    Đã dùng: {coupon.usedCount}{" "}
                                                    / {coupon.usageLimit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                        title="Xóa mã"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingManagement;
