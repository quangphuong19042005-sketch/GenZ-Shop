import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Đảm bảo đường dẫn đúng tới file Context

const LoginPage = () => {
    // 1. Khai báo State
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. Lấy hàm login từ AuthContext và hàm điều hướng
    const { login } = useAuth();
    const navigate = useNavigate();

    // 3. Xử lý khi bấm nút Sign In
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // Gọi hàm login từ AuthContext (Hàm này sẽ gọi API backend)
            const result = await login(username, password);

            if (result.success) {
                // 🎉 Đăng nhập thành công -> Chuyển hướng
                // Kiểm tra role để chuyển về trang Admin hoặc trang chủ
                if (result.user?.role === "admin") {
                    navigate("/");
                } else {
                    navigate("/");
                }
            } else {
                // ❌ Đăng nhập thất bại (Backend trả về success: false)
                // Hiển thị thông báo lỗi cụ thể từ Backend gửi lên
                setError(
                    result.message || "Tên đăng nhập hoặc mật khẩu không đúng.",
                );
            }
        } catch (err) {
            // 💥 Lỗi mạng hoặc lỗi hệ thống khác
            console.error("Lỗi đăng nhập:", err);
            setError("Lỗi kết nối đến Server. Vui lòng thử lại sau.");
        } finally {
            // Tắt trạng thái loading dù thành công hay thất bại
            setIsSubmitting(false);
        }
    };

    // 4. Giao diện (JSX)
    return (
        <div className="w-full max-w-md mx-auto py-10 px-4">
            <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase">
                    Welcome Back
                </h2>
                <p className="text-gray-500 text-sm">
                    Please enter your details to sign in.
                </p>
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 animate-pulse">
                    <span className="material-symbols-outlined text-lg">
                        error
                    </span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Input Username */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                        Username
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none dark:text-white transition-all"
                        placeholder="Nhập tên đăng nhập"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(""); // Xóa lỗi khi người dùng gõ lại
                        }}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Input Password */}
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none dark:text-white transition-all"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-slate-900 focus:ring-slate-900 accent-slate-900"
                        />
                        <span className="text-gray-500">Remember me</span>
                    </label>
                    <Link
                        to="/auth/forgot-password"
                        className="text-slate-900 dark:text-white font-bold hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-lg hover:opacity-90 transition-all flex justify-center items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Sign In"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                    to="/auth/register"
                    className="text-slate-900 dark:text-white font-bold hover:underline"
                >
                    Create account
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
