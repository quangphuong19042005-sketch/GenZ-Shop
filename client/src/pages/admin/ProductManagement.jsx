import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState("All");

    // --- State Form ---
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Tops");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // --- State Biến thể ---
    const [variants, setVariants] = useState([]);
    const [newSize, setNewSize] = useState("");
    const [newColor, setNewColor] = useState("");
    const [newStock, setNewStock] = useState(0);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const addVariant = () => {
        if (!newSize || !newColor) return alert("Vui lòng nhập Size và Màu");
        const exists = variants.find(
            (v) =>
                v.size.toUpperCase() === newSize.toUpperCase() &&
                v.color.toUpperCase() === newColor.toUpperCase(),
        );
        if (exists) return alert("Biến thể này đã tồn tại!");

        setVariants([
            ...variants,
            {
                size: newSize,
                color: newColor,
                stockQuantity: parseInt(newStock) || 0,
            },
        ]);
        setNewSize("");
        setNewColor("");
        setNewStock(0);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setName("");
        setPrice("");
        setCategory("Tops");
        setDescription("");
        setIsActive(true);
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingId(null);
        setVariants([]);
        setNewSize("");
        setNewColor("");
        setNewStock(0);
    };

    const handleEditClick = (product) => {
        setEditingId(product.id);
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category);
        setDescription(product.description || "");
        setIsActive(product.isActive);
        setVariants(product.variants || []);
        const imgLink = product.imageUrl?.startsWith("http")
            ? product.imageUrl
            : `http://localhost:5165${product.imageUrl}`;
        setPreviewUrl(imgLink);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            try {
                await axios.delete(`http://localhost:5165/api/products/${id}`);
                setProducts(products.filter((p) => p.id !== id));
                alert("Đã xóa sản phẩm!");
            } catch (error) {
                alert("Lỗi khi xóa sản phẩm!");
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("Name", name);
            formData.append("Price", price);
            formData.append("Category", category);
            formData.append("Description", description);
            formData.append("IsActive", isActive);
            formData.append("VariantsJson", JSON.stringify(variants));
            if (selectedFile) formData.append("ImageFile", selectedFile);

            const url = editingId
                ? `http://localhost:5165/api/products/${editingId}`
                : "http://localhost:5165/api/products";
            const method = editingId ? "put" : "post";

            const res = await axios[method](url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (editingId) {
                setProducts(
                    products.map((p) => (p.id === editingId ? res.data : p)),
                );
            } else {
                setProducts([res.data, ...products]);
            }
            setShowModal(false);
            resetForm();
            alert("Lưu thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi lưu sản phẩm!");
        }
    };

    const filteredProducts = products.filter(
        (p) => filterCategory === "All" || p.category === filterCategory,
    );

    return (
        <div className="flex flex-col gap-8 p-6 bg-gray-900 min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Quản lý Sản phẩm
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Tổng cộng: {filteredProducts.length} sản phẩm
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-700">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="border-none bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-gray-300 focus:ring-0 cursor-pointer hover:bg-gray-700 rounded-md transition-colors outline-none"
                        >
                            <option value="All" className="bg-gray-800">
                                Tất cả danh mục
                            </option>
                            <option value="Tops" className="bg-gray-800">
                                Áo (Tops)
                            </option>
                            <option value="Bottoms" className="bg-gray-800">
                                Quần (Bottoms)
                            </option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">
                            add
                        </span>{" "}
                        Thêm mới
                    </button>
                </div>
            </div>

            {/* Bảng sản phẩm */}
            <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="bg-gray-900 text-gray-400 uppercase text-xs font-bold border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-4 w-[30%]">Sản phẩm</th>
                                <th className="px-6 py-4 w-[15%]">Giá</th>
                                <th className="px-6 py-4 w-[30%]">
                                    Kho hàng (Biến thể)
                                </th>
                                <th className="px-6 py-4 text-center w-[10%]">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-right w-[15%]">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-gray-500 italic"
                                    >
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-gray-500 italic"
                                    >
                                        Không tìm thấy sản phẩm nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-700 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-gray-700 border border-gray-600 overflow-hidden shrink-0">
                                                    <img
                                                        src={
                                                            product.imageUrl
                                                                ? `http://localhost:5165${product.imageUrl}`
                                                                : "https://placehold.co/100"
                                                        }
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "https://placehold.co/100?text=No+Img")
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-medium mt-0.5">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">
                                            ${product.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {product.variants
                                                    ?.slice(0, 4)
                                                    .map((v, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-gray-700 text-gray-300 border border-gray-600"
                                                        >
                                                            {v.size}-{v.color}:{" "}
                                                            <span className="ml-1 text-white font-bold">
                                                                {
                                                                    v.stockQuantity
                                                                }
                                                            </span>
                                                        </span>
                                                    ))}
                                                {product.variants?.length >
                                                    4 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-gray-700 text-gray-500 border border-gray-600">
                                                        +
                                                        {product.variants
                                                            .length - 4}{" "}
                                                        more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${product.isActive ? "bg-green-900/30 text-green-400 border-green-800" : "bg-red-900/30 text-red-400 border-red-800"}`}
                                            >
                                                {product.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(product)
                                                    }
                                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg transition-all"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        edit
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                                                    title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-gray-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-700">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-2xl sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {editingId
                                        ? "Cập nhật sản phẩm"
                                        : "Thêm sản phẩm mới"}
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Điền thông tin chi tiết sản phẩm bên dưới
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-full transition-all"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <form
                                id="productForm"
                                onSubmit={handleSave}
                                className="grid grid-cols-2 gap-6"
                            >
                                {/* Cột Trái: Thông tin chính */}
                                <div className="col-span-2 sm:col-span-1 space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Tên sản phẩm{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm placeholder-gray-500"
                                            placeholder="Nhập tên sản phẩm..."
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Giá ($){" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm"
                                                value={price}
                                                onChange={(e) =>
                                                    setPrice(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                Danh mục
                                            </label>
                                            <select
                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium cursor-pointer text-sm"
                                                value={category}
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                            >
                                                <option value="Tops">
                                                    Tops
                                                </option>
                                                <option value="Bottoms">
                                                    Bottoms
                                                </option>
                                                <option value="Outerwear">
                                                    Outerwear
                                                </option>
                                                <option value="Accessories">
                                                    Accessories
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            rows="4"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium resize-none text-sm placeholder-gray-500"
                                            placeholder="Mô tả chi tiết sản phẩm..."
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                        ></textarea>
                                    </div>

                                    <div
                                        className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex items-center justify-between cursor-pointer"
                                        onClick={() => setIsActive(!isActive)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${isActive ? "bg-blue-600" : "bg-gray-600"}`}
                                            >
                                                <div
                                                    className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isActive ? "translate-x-4" : ""}`}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-300 select-none">
                                                Đang kinh doanh
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cột Phải: Ảnh & Biến thể */}
                                <div className="col-span-2 sm:col-span-1 space-y-6">
                                    {/* Upload Ảnh */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            Hình ảnh
                                        </label>
                                        <div className="w-full h-48 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-gray-900 hover:bg-gray-800 hover:border-blue-500 transition-all cursor-pointer group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            {previewUrl ? (
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center group-hover:scale-105 transition-transform">
                                                    <span className="material-symbols-outlined text-4xl text-gray-500 group-hover:text-blue-400">
                                                        cloud_upload
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-2 font-medium">
                                                        Click để tải ảnh lên
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quản lý Biến thể */}
                                    <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">
                                                    inventory_2
                                                </span>{" "}
                                                Biến thể (Size/Màu)
                                            </h3>
                                        </div>

                                        <div className="flex gap-2 mb-3">
                                            <input
                                                placeholder="Size (S, M...)"
                                                className="w-20 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm focus:border-blue-500 outline-none placeholder-gray-500"
                                                value={newSize}
                                                onChange={(e) =>
                                                    setNewSize(e.target.value)
                                                }
                                            />
                                            <input
                                                placeholder="Màu (Đen...)"
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm focus:border-blue-500 outline-none placeholder-gray-500"
                                                value={newColor}
                                                onChange={(e) =>
                                                    setNewColor(e.target.value)
                                                }
                                            />
                                            <input
                                                type="number"
                                                placeholder="SL"
                                                className="w-16 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white text-sm focus:border-blue-500 outline-none placeholder-gray-500"
                                                value={newStock}
                                                onChange={(e) =>
                                                    setNewStock(e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={addVariant}
                                                className="bg-blue-600 text-white px-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    add
                                                </span>
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                            {variants.length === 0 && (
                                                <p className="text-xs text-gray-500 italic w-full text-center py-2">
                                                    Chưa có biến thể nào.
                                                </p>
                                            )}
                                            {variants.map((v, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm animate-scale-in"
                                                >
                                                    <span className="text-xs font-bold text-gray-300">
                                                        {v.size}-{v.color}
                                                    </span>
                                                    <span className="text-xs text-blue-400 font-bold bg-blue-900/30 px-1.5 rounded">
                                                        x{v.stockQuantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVariant(index)
                                                        }
                                                        className="text-gray-500 hover:text-red-500 transition-colors flex items-center"
                                                    >
                                                        <span className="material-symbols-outlined text-base">
                                                            close
                                                        </span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-gray-700 bg-gray-800 rounded-b-2xl flex justify-end gap-3 sticky bottom-0 z-10">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                form="productForm"
                                type="submit"
                                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                            >
                                {editingId ? "Lưu thay đổi" : "Tạo sản phẩm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
