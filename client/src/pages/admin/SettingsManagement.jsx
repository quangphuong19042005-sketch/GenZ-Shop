import React from "react";

const SettingsManagement = () => {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Cấu hình Hệ thống
            </h1>

            <div className="bg-white dark:bg-[#1a2230] p-8 rounded-xl border border-gray-200 dark:border-[#282e39] max-w-2xl">
                <form className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Tên cửa hàng
                        </label>
                        <input
                            type="text"
                            defaultValue="STREETWEAR STUDIO"
                            className="w-full border p-3 rounded bg-transparent dark:border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Email liên hệ
                        </label>
                        <input
                            type="email"
                            defaultValue="admin@streetwear.com"
                            className="w-full border p-3 rounded bg-transparent dark:border-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">
                            Phí ship mặc định ($)
                        </label>
                        <input
                            type="number"
                            defaultValue="5.00"
                            className="w-full border p-3 rounded bg-transparent dark:border-gray-700"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="maintenance"
                            className="w-5 h-5"
                        />
                        <label
                            htmlFor="maintenance"
                            className="text-sm font-medium"
                        >
                            Bật chế độ bảo trì (Maintenance Mode)
                        </label>
                    </div>
                    <button
                        type="button"
                        className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded hover:opacity-90 transition-opacity"
                    >
                        Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsManagement;
