import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // 1. Thêm state để hiện loading khi bấm nút
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // 2. Thêm từ khóa ASYNC ở đây
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Xóa lỗi cũ
        setIsSubmitting(true); // Bật loading

        // 3. Thêm từ khóa AWAIT ở đây (đợi Server trả lời)
        const result = await login(username, password);

        if (result.success) {
            navigate("/");
        } else {
            // Nếu lỗi, hiện thông báo và tắt loading
            setError(result.message || "Đăng nhập thất bại");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase">
                Welcome Back
            </h2>
            <p className="text-gray-500 mb-8 text-sm">
                Please enter your details to sign in.
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                        error
                    </span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                        placeholder="user1"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isSubmitting} // Khóa input khi đang gửi
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-500">Remember me</span>
                    </label>
                    <a
                        href="#"
                        className="text-primary font-bold hover:underline"
                    >
                        Forgot Password?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting} // Khóa nút khi đang gửi
                    className={`bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-lg hover:opacity-90 transition-all mt-2 flex justify-center items-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                    to="/auth/register"
                    className="text-primary font-bold hover:underline"
                >
                    Create account
                </Link>
            </div>
        </div>
    );
};

export default LoginPage;
