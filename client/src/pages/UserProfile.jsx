import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ProfileSidebar from "../components/ProfileSidebar"; // 1. Import Sidebar mới

const UserProfile = () => {
    const { user } = useAuth();

    // Nếu chưa đăng nhập thì hiện thông báo
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">
                    Vui lòng đăng nhập để xem hồ sơ.
                </h2>
                <Link
                    to="/auth/login"
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold"
                >
                    Đăng nhập ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#f8f8f5] dark:bg-[#121212] min-h-screen font-display text-slate-900 dark:text-white">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* --- 2. THAY THẾ SIDEBAR CŨ BẰNG COMPONENT MỚI --- */}
                    <ProfileSidebar />

                    {/* --- MAIN CONTENT AREA (GIỮ NGUYÊN) --- */}
                    <div className="flex-1 flex flex-col gap-10">
                        {/* 1. Profile Header */}
                        <section className="bg-gray-100 dark:bg-[#1e1e1e] rounded-xl p-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative group">
                                    <div
                                        className="size-32 rounded-xl bg-center bg-cover border-2 border-[#f2d00d] overflow-hidden"
                                        style={{
                                            backgroundImage:
                                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr86vUXW1XOnmprjnZizS6GvTDTo8c_NFN6FHen74n9SdFlBepFJ5aW49Oix6yiw-ZxdNXX7XGs3gClUAlS64IQzCn_x5ON79-uDzt3N8UQBPPzN_ld_nDBW_QWf3MeKah_iAWKQVsHhQ6-_MOGez-JVkndHb9fbSKdE3b5_vI9J1F9KmIjHEwpUe4d5bis6MXrAmEm6hMsGwXOSVycwd89IaEVK2U-2nBM-LKNXjcB9JFryeFTfTt1AA206MYLMjTD_ckF-656s_t')",
                                        }}
                                    ></div>
                                    <button className="absolute -bottom-2 -right-2 bg-[#f2d00d] text-black p-2 rounded-lg shadow-lg hover:scale-105 transition-transform">
                                        <span className="material-symbols-outlined text-sm">
                                            edit
                                        </span>
                                    </button>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold tracking-tight mb-1">
                                        {user.name}
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
                                        {user.username === "user1"
                                            ? "admin@streetwear.com"
                                            : `${user.username}@example.com`}
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#f2d00d] text-lg">
                                                verified_user
                                            </span>
                                            <span>Member since 2023</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#f2d00d] text-lg">
                                                loyalty
                                            </span>
                                            <span>
                                                {user.role === "admin"
                                                    ? "Diamond Admin"
                                                    : "Platinum Tier"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="bg-[#f2d00d] text-black font-bold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#f2d00d]/20">
                                    Edit Profile
                                </button>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                            {/* 2. Recent Orders Section */}
                            <section className="flex flex-col gap-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-xl font-bold">
                                        Recent Orders
                                    </h2>
                                    <a
                                        className="text-[#f2d00d] text-sm font-bold hover:underline"
                                        href="#"
                                    >
                                        View All
                                    </a>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {/* Order Item 1 */}
                                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1e1e1e]/50 border border-gray-200 dark:border-[#2d2d2d] p-4 rounded-xl">
                                        <div
                                            className="size-20 rounded-lg bg-center bg-cover flex-shrink-0"
                                            style={{
                                                backgroundImage:
                                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCCmMcoW-rVN5Xotduort94q91Wrdi5sDM4tzyXq4CgA_ly0-o_uWeyY0ydlkYiwaPv9drxi4cwxGflC569Nk35S8ZRIiJHJnSKVpgAywGGCuy_j0UEjlkM4XJCFn7mO8zJ8b5rLa6zTXPoWK8PAEoTpjDzo_WQgdvq5J4w9kiLUgpEcdKF3Z-Ui7mX50UM7mLjIGTs12r_A6RcX2sJI7CyQhLxR5dJvY39VcGmA3dSrN0HDRJlS_7xc9Gle_ZbdJp5fiWZoGaQoxc')",
                                            }}
                                        ></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-bold text-sm">
                                                    Order #SW-82734
                                                </p>
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-[#f2d00d]/20 text-[#f2d00d] px-2 py-1 rounded">
                                                    Shipping
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
                                                Oversized "Nocturnal" Hoodie - L
                                            </p>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-[#f2d00d] h-full w-[65%]"></div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                Arriving by Friday, Oct 27
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Item 2 */}
                                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#1e1e1e]/50 border border-gray-200 dark:border-[#2d2d2d] p-4 rounded-xl">
                                        <div
                                            className="size-20 rounded-lg bg-center bg-cover flex-shrink-0"
                                            style={{
                                                backgroundImage:
                                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBUwo5kQcYjsXAiIsfKalNjpZTvtkgTp7klSp8BOgaYsiZupIa0WXV4P2V6vy45EwR1kSIoAzzybIqUYF4GnYWiBzxiRVi9WSJsUNC261cm1qkohuR6aXSi5jHOgLwkycVJLiFA7sHkU9tSUUq2hnLepdmFZzvXx66O-e0hpszviuPse8Z6gf1mjOsh3Y5zOS0FzIbtDYhVwQLm2kQ3kNefvf-V5GFU_bU7pXVUS6Q9_rQFg6BlMrsEX6QmZd4qoJld9QEDJasmeDhb')",
                                            }}
                                        ></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-bold text-sm">
                                                    Order #SW-81902
                                                </p>
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-500 px-2 py-1 rounded">
                                                    Delivered
                                                </span>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
                                                Utility Cargo Pants - Olive - M
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#f2d00d] cursor-pointer hover:underline">
                                                <span className="material-symbols-outlined text-xs">
                                                    receipt_long
                                                </span>
                                                <span>Reorder this item</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Style Profile Section */}
                            <section className="flex flex-col gap-6">
                                <div className="px-2">
                                    <h2 className="text-xl font-bold">
                                        Style Profile
                                    </h2>
                                </div>
                                <div className="bg-gray-100 dark:bg-[#1e1e1e] p-6 rounded-xl h-full border border-transparent dark:border-[#2d2d2d]">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider font-bold">
                                        Your Aesthetic
                                    </p>
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {[
                                            "Streetwear",
                                            "Techwear",
                                            "Monochrome",
                                            "Minimalist",
                                            "Vintage 90s",
                                        ].map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-4 py-2 text-xs font-bold rounded-full border ${
                                                    idx % 2 === 0
                                                        ? "bg-[#f8f8f5] dark:bg-[#121212] border-[#f2d00d] text-[#f2d00d]"
                                                        : "bg-[#f8f8f5] dark:bg-[#121212] border-[#2d2d2d] text-gray-400"
                                                }`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-[#f2d00d]/10 rounded-lg border border-[#f2d00d]/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="material-symbols-outlined text-[#f2d00d]">
                                                auto_awesome
                                            </span>
                                            <p className="text-sm font-bold">
                                                Curated for you
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                            Based on your recent cargo pant
                                            purchase, we recommend checking out
                                            the{" "}
                                            <span className="text-[#f2d00d] font-bold underline cursor-pointer">
                                                Tech-Utility Drop
                                            </span>{" "}
                                            happening this Saturday.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* 4. Personal Info Grid */}
                        <section className="flex flex-col gap-6 mb-10">
                            <div className="px-2">
                                <h2 className="text-xl font-bold">
                                    Personal Details
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name", value: user.name },
                                    {
                                        label: "Primary Email",
                                        value:
                                            user.username === "user1"
                                                ? "admin@streetwear.com"
                                                : `${user.username}@example.com`,
                                    },
                                    {
                                        label: "Phone Number",
                                        value: "+1 (555) 123-4567",
                                    },
                                    {
                                        label: "Default Address",
                                        value: "123 Streetwear Ave, Apt 4B, NY 10001",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-6 bg-gray-50 dark:bg-[#1e1e1e]/30 rounded-xl border border-gray-200 dark:border-[#2d2d2d] flex flex-col gap-1 hover:border-[#f2d00d] transition-colors group"
                                    >
                                        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest group-hover:text-[#f2d00d] transition-colors">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
