import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- DUMMY DATA ---
const TRENDING_ITEMS = [
    {
        id: 1,
        name: "Varsity Jacket '24",
        price: 120,
        img: "https://images.unsplash.com/photo-1551488852-0801464c9397?q=80&w=2072&auto=format&fit=crop",
    },
    {
        id: 2,
        name: "Oversized Graphic Tee",
        price: 45,
        img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
    },
    {
        id: 3,
        name: "Cargo Parachute Pants",
        price: 85,
        img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1994&auto=format&fit=crop",
    },
    {
        id: 4,
        name: "Distressed Denim",
        price: 95,
        img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2070&auto=format&fit=crop",
    },
];

// --- COMPONENT: MARQUEE ---
const Marquee = () => (
    <div className="bg-yellow-400 py-3 overflow-hidden whitespace-nowrap border-y-2 border-black">
        <motion.div
            className="inline-block text-black font-black text-xl md:text-2xl uppercase tracking-widest"
            animate={{ x: [0, -1000] }}
            transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 20,
            }}
        >
            New Collection Dropping Soon • Free Shipping on Orders over $200 •
            Worldwide Delivery • Urban Legend Est. 2024 • Wear Your Vibe • New
            Collection Dropping Soon • Free Shipping on Orders over $200 •
            Worldwide Delivery • Urban Legend Est. 2024 • Wear Your Vibe •
        </motion.div>
    </div>
);

// --- MAIN COMPONENT ---
const HomePage = () => {
    return (
        <div className="flex flex-col w-full bg-white dark:bg-[#0f172a] overflow-hidden">
            {/* 1. HERO SECTION */}
            <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1 px-4 border border-white text-white rounded-full text-sm font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-sm"
                    >
                        Season 02 / 2024
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-white text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-none mb-6 drop-shadow-2xl"
                    >
                        NOT JUST <br />{" "}
                        <span className="text-stroke-white text-transparent">
                            CLOTHING
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Chúng tôi không bán quần áo. Chúng tôi bán phong cách
                        sống.
                        <br />
                        Nơi cái tôi được thể hiện qua từng đường kim mũi chỉ.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            SHOP NOW
                            <span className="material-symbols-outlined">
                                arrow_forward
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. INFINITE SCROLL TEXT */}
            <Marquee />

            {/* 3. ABOUT US */}
            <section className="py-20 md:py-32 px-4 md:px-12 max-w-[1440px] mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1523396870176-23b04336c257?q=80&w=1954&auto=format&fit=crop"
                            alt="About Us"
                            className="rounded-2xl shadow-2xl w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-slate-900 dark:bg-yellow-400 rounded-2xl -z-10 hidden md:block"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <span className="text-yellow-500 font-bold tracking-widest uppercase">
                            Who We Are
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                            BORN FROM THE <br /> STREETS.
                        </h2>
                        <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
                            <strong>STREETWEAR</strong> không chỉ là xu hướng,
                            đó là tiếng nói. Được thành lập vào năm 2024, chúng
                            tôi mang đến những thiết kế táo bạo, phá vỡ mọi quy
                            chuẩn.
                        </p>
                        <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed">
                            Mỗi sản phẩm là sự kết hợp giữa văn hóa Hip-hop,
                            nghệ thuật đường phố và chất lượng vải cao cấp.
                            Chúng tôi tôn trọng sự độc bản của chính bạn.
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/about"
                                className="text-slate-900 dark:text-white font-bold border-b-2 border-yellow-400 hover:text-yellow-500 transition-colors"
                            >
                                READ OUR STORY
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. SHOP BY CATEGORY */}
            <section className="py-10 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        Collections
                    </h2>
                    {/* 👇 ĐÃ SỬA LỖI Ở ĐÂY: Dùng &rarr; thay cho -> */}
                    <Link
                        to="/shop"
                        className="hidden md:block text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                        VIEW ALL &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TOPS */}
                    <Link
                        to="/tops"
                        className="group relative h-[400px] md:h-[600px] overflow-hidden rounded-2xl"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1887&auto=format&fit=crop"
                            alt="Tops"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                        <div className="absolute bottom-8 left-8">
                            <h3 className="text-5xl font-black text-white italic tracking-tighter mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                TOPS
                            </h3>
                            <span className="text-white/80 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                Hoodies / Tees / Jackets
                            </span>
                        </div>
                    </Link>

                    {/* BOTTOMS */}
                    <Link
                        to="/bottoms"
                        className="group relative h-[400px] md:h-[600px] overflow-hidden rounded-2xl"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1552160753-117159d74108?q=80&w=1932&auto=format&fit=crop"
                            alt="Bottoms"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                        <div className="absolute bottom-8 left-8">
                            <h3 className="text-5xl font-black text-white italic tracking-tighter mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                BOTTOMS
                            </h3>
                            <span className="text-white/80 font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                Joggers / Jeans / Cargos
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* 5. TRENDING NOW */}
            <section className="py-20 bg-slate-50 dark:bg-[#1a2230] mt-10">
                <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                    <div className="text-center mb-16">
                        <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase">
                            Weekly Hype
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-2">
                            TRENDING NOW
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {TRENDING_ITEMS.map((item) => (
                            <Link
                                to={`/shop`}
                                key={item.id}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-200 mb-4">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-400">
                                        <span className="material-symbols-outlined text-sm font-bold">
                                            add_shopping_cart
                                        </span>
                                    </button>
                                </div>
                                <h3 className="text-slate-900 dark:text-white font-bold text-lg truncate group-hover:text-yellow-500 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-slate-500 dark:text-gray-400 font-mono">
                                    ${item.price}.00
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FEATURES */}
            <section className="py-16 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center gap-3 p-6">
                        <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white">
                            local_shipping
                        </span>
                        <h4 className="font-black text-xl uppercase dark:text-white">
                            Free Shipping
                        </h4>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Miễn phí vận chuyển cho tất cả đơn hàng trên 500k.
                            Giao hàng hỏa tốc trong 2h.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 border-x-0 md:border-x border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white">
                            verified
                        </span>
                        <h4 className="font-black text-xl uppercase dark:text-white">
                            Authentic Quality
                        </h4>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Cam kết chất liệu vải cao cấp, bền màu, form dáng
                            chuẩn Streetwear quốc tế.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6">
                        <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white">
                            support_agent
                        </span>
                        <h4 className="font-black text-xl uppercase dark:text-white">
                            24/7 Support
                        </h4>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Đội ngũ hỗ trợ nhiệt tình, đổi trả dễ dàng trong
                            vòng 30 ngày.
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. NEWSLETTER CTA */}
            <section className="relative py-24 px-4 bg-black overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase italic">
                        Don't Miss The Drop
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Đăng ký để nhận thông báo sớm nhất về các bộ sưu tập
                        giới hạn và mã giảm giá 10%.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 backdrop-blur-md"
                        />
                        <button className="bg-yellow-400 text-black font-black px-8 py-4 rounded-full hover:bg-white transition-colors uppercase tracking-wider">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
