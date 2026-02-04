import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu nhập lại không khớp!");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:5165/api/auth/register",
                {
                    fullName: formData.fullName,
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                },
            );

            if (res.data.success) {
                alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/auth/login");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Đăng ký thất bại");
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

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="Họ và tên"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                />
                <input
                    required
                    name="username"
                    type="text"
                    placeholder="Tên đăng nhập"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                />
                <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                />
                <input
                    required
                    name="phone"
                    type="text"
                    placeholder="Số điện thoại"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                />
                <input
                    required
                    name="password"
                    type="password"
                    placeholder="Mật khẩu"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                />
                <input
                    required
                    name="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    onChange={handleChange}
                    className="p-3 border rounded-lg dark:bg-slate-800 dark:text-white"
                />

                <button
                    disabled={loading}
                    className="bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                    {loading ? "Đang xử lý..." : "ĐĂNG KÝ NGAY"}
                </button>
            </form>

            <div className="text-center text-sm">
                Đã có tài khoản?{" "}
                <Link
                    to="/auth/login"
                    className="text-primary font-bold hover:underline"
                >
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
};

export default RegisterPage; // 👈 DÒNG QUAN TRỌNG ĐỂ SỬA LỖI
