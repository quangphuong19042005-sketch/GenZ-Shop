import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { vipDrops, vipRewards } from "../data/vipData";
import axios from "axios";

// =================================================================
// 1. COMPONENT CON: MÀN HÌNH DASHBOARD (Dành cho ai ĐÃ LÀ VIP)
// =================================================================
const VIPDashboard = ({ user }) => {
    const currentPoints = user?.loyaltyPoints || 0;
    const currentTier = user?.membershipTier || "Gold";

    let nextTier = "Diamond";
    let pointsToNextTier = 0;
    let progressPercent = 0;

    if (currentPoints < 5000) {
        nextTier = "Platinum";
        pointsToNextTier = 5000 - currentPoints;
        progressPercent = (currentPoints / 5000) * 100;
    } else {
        nextTier = "Diamond (Max)";
        progressPercent = 100;
    }

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).getFullYear()
        : new Date().getFullYear();

    return (
        <div className="font-vip bg-[#f8f8f5] dark:bg-[#121212] text-gray-900 dark:text-white min-h-screen">
            <div className="max-w-[1200px] mx-auto px-6 py-10">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-vip-gold/10 text-vip-gold border border-vip-gold/20 rounded text-[10px] font-black tracking-widest uppercase">
                                {currentTier} MEMBER
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter uppercase italic">
                            Welcome, <br />
                            <span className="bg-gradient-to-br from-[#f2d00d] to-[#b89b06] bg-clip-text text-transparent">
                                {user?.fullName}
                            </span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg mt-2 uppercase tracking-wide">
                            VIP SINCE {joinDate}
                        </p>
                    </div>
                </div>

                {/* Stats & Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-100 dark:bg-[#1c1c1c] rounded-xl p-8 border border-gray-200 dark:border-[#2a2a2a]">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                            Current Balance
                        </p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black italic">
                                {currentPoints.toLocaleString()}
                            </span>
                            <span className="text-vip-gold font-bold text-lg uppercase italic">
                                PTS
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-gray-100 dark:bg-[#1c1c1c] rounded-xl p-8 border border-gray-200 dark:border-[#2a2a2a]">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Progress to {nextTier}
                            </p>
                            <span className="text-vip-gold font-black italic">
                                {Math.round(progressPercent)}%
                            </span>
                        </div>
                        <div className="w-full h-4 bg-gray-200 dark:bg-[#2a2a2a] rounded-full mb-4 overflow-hidden">
                            <div
                                className="h-full bg-vip-gold rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-400">
                            Earn{" "}
                            <span className="text-white font-bold">
                                {pointsToNextTier} more points
                            </span>{" "}
                            to level up.
                        </p>
                    </div>
                </div>

                {/* Rewards Grid */}
                <div className="mb-16">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
                        Exclusive Rewards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {vipRewards.map((reward, idx) => (
                            <div
                                key={idx}
                                className="bg-white/5 border border-vip-gold/10 p-6 rounded-xl hover:bg-[#2a2a2a] transition-all"
                            >
                                <span className="material-symbols-outlined text-vip-gold text-4xl mb-4">
                                    {reward.icon}
                                </span>
                                <h3 className="font-black uppercase italic mb-2">
                                    {reward.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {reward.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// 2. COMPONENT CON: MÀN HÌNH ĐĂNG KÝ (Dành cho Member thường)
// =================================================================
const VIPRegistration = ({ user }) => {
    const [loading, setLoading] = useState(false);

    const handleJoinVIP = async () => {
        setLoading(true);
        try {
            // Gọi API nâng cấp
            const res = await axios.post(
                `http://localhost:5165/api/auth/upgrade-vip/${user.id}`,
            );

            if (res.data.success) {
                alert("🎉 Chúc mừng! Bạn đã trở thành thành viên VIP Gold!");

                // ✅ QUAN TRỌNG: Cập nhật LocalStorage ngay lập tức
                // Để khi reload, app biết là user đã lên Gold
                const updatedUser = {
                    ...user,
                    membershipTier: "Gold",
                    loyaltyPoints: (user.loyaltyPoints || 0) + 500,
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));

                // ✅ Reload trang để chuyển sang màn hình Dashboard
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            alert(
                "Lỗi khi tham gia VIP: " +
                    (error.response?.data?.message || "Lỗi server"),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

            <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Left: Text */}
                <div>
                    <span className="text-vip-gold font-bold tracking-widest uppercase text-sm mb-2 block">
                        GenZ Shop Membership
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-6">
                        Join the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-vip-gold to-yellow-200">
                            Inner Circle
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Nâng cấp tài khoản lên VIP để mở khóa quyền lợi độc
                        quyền: Freeship trọn đời, Giảm giá 15% mọi đơn hàng, và
                        quyền mua sớm các bộ sưu tập giới hạn.
                    </p>

                    <ul className="space-y-4 mb-8">
                        {[
                            "Tặng ngay 500 điểm thưởng",
                            "Ưu đãi sinh nhật đặc biệt",
                            "Hỗ trợ 24/7 riêng biệt",
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-vip-gold">
                                    check_circle
                                </span>
                                <span className="font-bold">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleJoinVIP}
                        disabled={loading}
                        className="bg-vip-gold hover:bg-white text-black px-10 py-4 rounded-full font-black text-lg uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    >
                        {loading ? "Đang xử lý..." : "Tham gia VIP Ngay"}
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        Hoàn toàn miễn phí. Hủy bất cứ lúc nào.
                    </p>
                </div>

                {/* Right: Card Visual */}
                <div className="relative hidden md:block">
                    <div className="w-full aspect-[1.6/1] bg-gradient-to-br from-[#1a1a1a] to-black rounded-2xl border border-vip-gold/30 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:rotate-2 transition-transform duration-500">
                        <div className="absolute -right-10 -top-10 size-40 bg-vip-gold/20 rounded-full blur-3xl"></div>
                        <div className="flex justify-between items-start">
                            <span className="font-black italic text-2xl text-white">
                                GENZ VIP
                            </span>
                            <span className="material-symbols-outlined text-vip-gold text-4xl">
                                diamond
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                                Member Name
                            </p>
                            <p className="text-xl font-bold text-white uppercase">
                                {user?.fullName || "Your Name"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =================================================================
// 3. MAIN COMPONENT: ĐIỀU HƯỚNG THÔNG MINH
// =================================================================
const VIPPage = () => {
    const { user } = useAuth();

    // Nếu chưa đăng nhập -> Không hiện gì
    if (!user) return null;

    // Kiểm tra: Nếu hạng là Gold, Platinum hoặc Diamond -> Là VIP
    const isVIP = ["Gold", "Platinum", "Diamond"].includes(user.membershipTier);

    return (
        <>
            {isVIP ? (
                // ĐÃ LÀ VIP -> HIỆN DASHBOARD
                <VIPDashboard user={user} />
            ) : (
                // CHƯA LÀ VIP (Silver/Member) -> HIỆN FORM ĐĂNG KÝ
                <VIPRegistration user={user} />
            )}
        </>
    );
};

export default VIPPage;
