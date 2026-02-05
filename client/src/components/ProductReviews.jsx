import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Giả sử bạn có AuthContext

const ProductReviews = ({ productId }) => {
    const { user } = useAuth(); // Lấy user đang đăng nhập
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // 1. Load Reviews & Check quyền
    useEffect(() => {
        fetchReviews();
        if (user) {
            checkPermission();
        }
    }, [productId, user]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5165/api/reviews/product/${productId}`,
            );
            setReviews(res.data);
        } catch (error) {
            console.error("Lỗi tải review", error);
        }
    };

    const checkPermission = async () => {
        try {
            // Gọi API check xem ông này mua hàng chưa
            const res = await axios.get(
                `http://localhost:5165/api/reviews/can-review?userId=${user.id}&productId=${productId}`,
            );
            setCanReview(res.data.canReview);
        } catch (error) {
            console.error("Lỗi check quyền", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment) return alert("Vui lòng viết nội dung đánh giá!");

        setSubmitting(true);
        try {
            await axios.post("http://localhost:5165/api/reviews", {
                userId: user.id,
                productId: parseInt(productId),
                rating: rating,
                comment: comment,
            });

            alert("Cảm ơn bạn đã đánh giá!");
            setComment("");
            setCanReview(false); // Đánh giá xong thì ẩn form đi
            fetchReviews(); // Reload lại list
        } catch (error) {
            alert("Lỗi khi gửi đánh giá");
        } finally {
            setSubmitting(false);
        }
    };

    // Helper render sao
    const renderStars = (starCount) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`text-lg ${i < starCount ? "text-yellow-400" : "text-gray-300"}`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="mt-12 bg-white dark:bg-[#1a2230] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#282e39]">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Đánh giá sản phẩm ({reviews.length})
            </h3>

            {/* FORM VIẾT ĐÁNH GIÁ (Chỉ hiện nếu có quyền) */}
            {canReview ? (
                <div className="mb-8 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <h4 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                        Viết đánh giá của bạn
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1 text-gray-500">
                                Mức độ hài lòng
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <textarea
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:text-white dark:border-slate-700"
                                rows="3"
                                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            disabled={submitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
                        >
                            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                    </form>
                </div>
            ) : (
                user && (
                    <div className="mb-8 text-sm text-gray-500 italic">
                        Bạn cần mua sản phẩm này để viết đánh giá.
                    </div>
                )
            )}

            {/* DANH SÁCH REVIEW */}
            <div className="space-y-6">
                {reviews.length === 0 && (
                    <p className="text-gray-400">Chưa có đánh giá nào.</p>
                )}

                {reviews.map((rev) => (
                    <div
                        key={rev.id}
                        className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0"
                    >
                        <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                            {rev.userAvatar ? (
                                <img src={rev.userAvatar} alt="avt" />
                            ) : (
                                rev.userName?.charAt(0)
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-white">
                                        {rev.userName}
                                    </h5>
                                    <div className="flex text-sm mb-1">
                                        {renderStars(rev.rating)}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(rev.createdAt).toLocaleDateString(
                                        "vi-VN",
                                    )}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
                                {rev.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews;
