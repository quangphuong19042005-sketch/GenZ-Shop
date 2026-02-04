import React, { useState, useEffect } from "react";
import ProfileSidebar from "../components/ProfileSidebar";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import Auth

const SavedAddresses = () => {
    const { user } = useAuth(); // Lấy thông tin user đăng nhập
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // State form
    const [newAddress, setNewAddress] = useState({
        recipientName: "", // Sửa tên biến khớp với Database C#
        phone: "",
        addressLine: "", // Sửa tên biến khớp với Database C#
        type: "Nhà riêng",
    });

    // 1. Load danh sách từ API
    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5165/api/addresses/user/${user.id}`,
            );
            setAddresses(res.data);
        } catch (error) {
            console.error("Lỗi tải địa chỉ:", error);
        }
    };

    // 2. Xử lý Thêm mới
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                userId: user.id,
                ...newAddress,
                isDefault: false, // Backend sẽ tự xử lý nếu là cái đầu tiên
            };
            await axios.post("http://localhost:5165/api/addresses", payload);

            setShowModal(false);
            setNewAddress({
                recipientName: "",
                phone: "",
                addressLine: "",
                type: "Nhà riêng",
            });
            fetchAddresses(); // Load lại danh sách
        } catch (error) {
            console.error("Lỗi thêm địa chỉ:", error);
            alert("Lỗi server!");
        }
    };

    // 3. Xử lý Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            try {
                await axios.delete(`http://localhost:5165/api/addresses/${id}`);
                fetchAddresses();
            } catch (error) {
                console.error("Lỗi xóa:", error);
            }
        }
    };

    // 4. Xử lý Đặt mặc định
    const handleSetDefault = async (id) => {
        try {
            await axios.put(
                `http://localhost:5165/api/addresses/set-default/${id}/user/${user.id}`,
            );
            fetchAddresses();
        } catch (error) {
            console.error("Lỗi đặt mặc định:", error);
        }
    };

    const handleInputChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-[#f8f8f5] dark:bg-[#121212] min-h-screen font-display text-slate-900 dark:text-white">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    <ProfileSidebar />

                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Sổ địa chỉ</h1>
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition shadow-lg"
                            >
                                + Thêm địa chỉ mới
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                Bạn chưa lưu địa chỉ nào.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        className={`p-6 rounded-xl border-2 relative transition-all bg-white dark:bg-[#1e1e1e]
                                            ${
                                                addr.isDefault
                                                    ? "border-primary shadow-md"
                                                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                                            }`}
                                    >
                                        {addr.isDefault && (
                                            <span className="absolute top-4 right-4 text-[10px] font-black uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                                                Mặc định
                                            </span>
                                        )}

                                        <h3 className="font-bold mb-1 flex items-center gap-2">
                                            {addr.recipientName}
                                            <span className="text-[10px] font-normal bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">
                                                {addr.type}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {addr.phone}
                                        </p>
                                        <p className="text-sm text-slate-700 dark:text-gray-300 mb-6 min-h-[40px]">
                                            {addr.addressLine}
                                        </p>

                                        <div className="flex gap-4 text-sm font-bold text-gray-500">
                                            <button
                                                onClick={() =>
                                                    handleDelete(addr.id)
                                                }
                                                className="hover:text-red-500 transition"
                                            >
                                                Xóa
                                            </button>
                                            {!addr.isDefault && (
                                                <button
                                                    onClick={() =>
                                                        handleSetDefault(
                                                            addr.id,
                                                        )
                                                    }
                                                    className="text-primary ml-auto hover:underline"
                                                >
                                                    Đặt làm mặc định
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                            Thêm địa chỉ mới
                        </h2>
                        <form
                            onSubmit={handleSave}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block">
                                    Tên người nhận
                                </label>
                                <input
                                    required
                                    name="recipientName"
                                    value={newAddress.recipientName}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-primary bg-transparent text-slate-900 dark:text-white"
                                    placeholder="Ví dụ: Alex Nguyen"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block">
                                    Số điện thoại
                                </label>
                                <input
                                    required
                                    name="phone"
                                    value={newAddress.phone}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-primary bg-transparent text-slate-900 dark:text-white"
                                    placeholder="Ví dụ: 0909..."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block">
                                    Địa chỉ chi tiết
                                </label>
                                <textarea
                                    required
                                    name="addressLine"
                                    value={newAddress.addressLine}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-primary bg-transparent text-slate-900 dark:text-white"
                                    placeholder="Số nhà, tên đường, phường, quận..."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block">
                                    Loại địa chỉ
                                </label>
                                <div className="flex gap-4">
                                    {["Nhà riêng", "Văn phòng"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                setNewAddress({
                                                    ...newAddress,
                                                    type,
                                                })
                                            }
                                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition
                                                ${
                                                    newAddress.type === type
                                                        ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black"
                                                        : "border-gray-300 text-gray-500 hover:border-slate-900"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-full font-bold border border-gray-300 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-full font-bold bg-primary text-white hover:bg-blue-600 transition shadow-lg"
                                >
                                    Lưu địa chỉ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedAddresses;
