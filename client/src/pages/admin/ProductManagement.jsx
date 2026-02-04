import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // --- State cho chức năng SỬA ---
    const [editingId, setEditingId] = useState(null); // Lưu ID sản phẩm đang sửa (null = thêm mới)

    const [filterCategory, setFilterCategory] = useState("All");

    // --- State Form ---
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState(10);
    const [category, setCategory] = useState("Tops");
    const [description, setDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5165/api/products");
            setProducts(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        if (filterCategory === "All") return true;
        return product.category === filterCategory;
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // --- HÀM RESET FORM (Dùng chung cho Thêm, Sửa, Đóng modal) ---
    const resetForm = () => {
        setName("");
        setPrice("");
        setStock(10);
        setCategory("Tops");
        setDescription("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null); // Reset trạng thái sửa
    };

    // --- XỬ LÝ KHI BẤM NÚT SỬA ---
    const handleEditClick = (product) => {
        setEditingId(product.id); // Đánh dấu là đang sửa ID này

        // Đổ dữ liệu cũ vào form
        setName(product.name);
        setPrice(product.price);
        setStock(product.stockQuantity);
        setCategory(product.category);
        setDescription(product.description || "");

        // Hiển thị ảnh cũ
        // Lưu ý: Thêm http://localhost... nếu link trong DB là đường dẫn tương đối
        const imgLink = product.imageUrl.startsWith("http")
            ? product.imageUrl
            : `http://localhost:5165${product.imageUrl}`;
        setPreviewUrl(imgLink);

        setShowModal(true); // Mở modal
    };

    // --- XỬ LÝ LƯU (THÊM HOẶC SỬA) ---
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("Name", name);
            formData.append("Price", price);
            formData.append("StockQuantity", stock);
            formData.append("Category", category);
            formData.append("Description", description);

            if (selectedFile) {
                formData.append("ImageFile", selectedFile);
            }

            if (editingId) {
                // === LOGIC SỬA (PUT) ===
                const res = await axios.put(
                    `http://localhost:5165/api/products/${editingId}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );

                // Cập nhật lại sản phẩm trong danh sách hiển thị (không cần load lại trang)
                setProducts(
                    products.map((p) => (p.id === editingId ? res.data : p)),
                );
                alert("Cập nhật thành công!");
            } else {
                // === LOGIC THÊM MỚI (POST) ===
                const res = await axios.post(
                    "http://localhost:5165/api/products",
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } },
                );
                setProducts([res.data, ...products]);
                alert("Thêm sản phẩm thành công!");
            }

            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Lỗi lưu:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            try {
                await axios.delete(`http://localhost:5165/api/products/${id}`);
                setProducts(products.filter((p) => p.id !== id));
            } catch (error) {
                alert("Không thể xóa sản phẩm này.");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                        Quản lý Sản phẩm
                    </h1>
                    <p className="text-sm text-gray-500">
                        Hiển thị {filteredProducts.length} sản phẩm
                    </p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-white dark:bg-[#1a2230] border border-gray-200 dark:border-[#282e39] text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium outline-none"
                    >
                        <option value="All">Tất cả danh mục</option>
                        <option value="Tops">Áo (Tops)</option>
                        <option value="Bottoms">Quần (Bottoms)</option>
                        <option value="Outerwear">Áo khoác (Outerwear)</option>
                        <option value="Accessories">Phụ kiện</option>
                    </select>

                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-500/30"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="hidden sm:inline">Thêm mới</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1a2230] rounded-xl shadow border border-gray-200 dark:border-[#282e39] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-[#282e39] text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Sản phẩm</th>
                            <th className="px-6 py-4">Danh mục</th>
                            <th className="px-6 py-4">Giá</th>
                            <th className="px-6 py-4">Kho</th>
                            <th className="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredProducts.map((product) => (
                            <tr
                                key={product.id}
                                className="hover:bg-gray-50 dark:hover:bg-[#282e39]/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded bg-gray-100 border overflow-hidden shrink-0">
                                            <img
                                                src={`http://localhost:5165${product.imageUrl}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "https://placehold.co/100?text=No+Img")
                                                }
                                            />
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">
                                            {product.name}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-300">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${product.stockQuantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                    >
                                        {product.stockQuantity || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* NÚT SỬA */}
                                        <button
                                            onClick={() =>
                                                handleEditClick(product)
                                            }
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Sửa"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                edit
                                            </span>
                                        </button>

                                        {/* NÚT XÓA */}
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Xóa"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL FORM (DÙNG CHUNG CHO THÊM VÀ SỬA) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                            {editingId
                                ? "Cập nhật sản phẩm"
                                : "Thêm sản phẩm mới"}
                        </h2>
                        <form
                            onSubmit={handleSave}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm font-bold mb-1 text-gray-500">
                                    Tên sản phẩm
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1 text-gray-500">
                                        Giá ($)
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-primary"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1 text-gray-500">
                                        Kho
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-primary"
                                        value={stock}
                                        onChange={(e) =>
                                            setStock(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1 text-gray-500">
                                        Danh mục
                                    </label>
                                    <select
                                        className="w-full border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-primary"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                    >
                                        <option value="Tops">Tops</option>
                                        <option value="Bottoms">Bottoms</option>
                                        <option value="Outerwear">
                                            Outerwear
                                        </option>
                                        <option value="Accessories">
                                            Accessories
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-bold mb-1 text-gray-500">
                                    Mô tả
                                </label>
                                <textarea
                                    className="w-full border p-2 rounded dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:border-primary"
                                    rows="3"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-500">
                                    Hình ảnh{" "}
                                    {editingId && "(Bỏ trống nếu không đổi)"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                />
                                {previewUrl && (
                                    <div className="mt-3">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-32 w-auto rounded border shadow-sm object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 py-2 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-primary text-white rounded font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    {editingId ? "Cập nhật" : "Lưu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
