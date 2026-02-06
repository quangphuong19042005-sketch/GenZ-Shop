import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // Đảm bảo file này đã được tạo ở Bước 1

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axiosClient.post("/api/auth/register", {
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            if (res.data.success) {
                alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/auth/login");
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Đăng ký thất bại. Vui lòng thử lại.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto py-10 px-4">
            <div className="text-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase">
                    Tạo tài khoản
                </h1>
                <p className="text-gray-500 mt-2">
                    Tham gia cộng đồng Streetwear ngay
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                    <span className="material-symbols-outlined text-lg">
                        error
                    </span>
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="Họ và tên"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
                <input
                    required
                    name="username"
                    type="text"
                    placeholder="Tên đăng nhập"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
                <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
                <input
                    required
                    name="phone"
                    type="text"
                    placeholder="Số điện thoại"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
                <input
                    required
                    name="password"
                    type="password"
                    placeholder="Mật khẩu"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />
                <input
                    required
                    name="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                />

                <button
                    disabled={loading}
                    className={`bg-slate-900 dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold hover:opacity-90 transition-all flex justify-center items-center shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {loading ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "ĐĂNG KÝ NGAY"
                    )}
                </button>
            </form>

            <div className="text-center text-sm text-gray-500">
                Đã có tài khoản?{" "}
                <Link
                    to="/auth/login"
                    className="text-slate-900 dark:text-white font-bold hover:underline"
                >
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage;
