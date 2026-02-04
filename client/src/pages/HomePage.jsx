import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="flex flex-col gap-12 md:gap-20 pb-20">
            {/* Hero Section */}
            <section className="@container w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-6">
                <div className="relative w-full rounded-lg md:rounded-xl overflow-hidden min-h-[600px] lg:min-h-[750px] flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD01Lv3TTW4DPcNRGYy-X3QhRv4AlIW2nIpXPnD2VyKQzrMqoFm2qnph6TrtQb4UUuJJYKrFMahxd74EXWes5pern5OdAf8hXGvc5NN_hi-57nr1InMlfwukT6oZgvxlESSm2BAVd-Twz9q_8nFJxU96BX3V8JVxWamc0OoHFgMoOV8ywhI_qEZOmOQN5Ttv_7oCE2Oob59ZZxiobsIF4PhJXd1y8F8Yj7AT312uVEp_V-KrDTydn3fsPwCm_8ISdoWIF0PTGKmAYLE")',
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl animate-fade-in-up">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                            Drop 002 Live Now
                        </span>
                        <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-4 drop-shadow-2xl">
                            URBAN
                            <br />
                            LEGEND
                        </h1>
                        <p className="text-gray-300 text-base md:text-lg font-medium max-w-lg mb-8 tracking-wide">
                            Redefining the streets with oversized silhouettes
                            and premium fabrics.
                        </p>
                        <Link
                            to="/shop"
                            className="group flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                        >
                            <span className="text-base font-bold uppercase tracking-wide">
                                Shop Collection
                            </span>
                            <span className="material-symbols-outlined group-hover:translate-x-1">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Shop By Category */}
            <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center uppercase dark:text-white">
                        Shop By Category
                    </h2>
                    <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Tops */}
                    <Link
                        to="/tops"
                        className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl block"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_skV6MxiSUTP80uWEmMsaunkz9M4GMg_nUuzOvJ7tFnkN3i0i2iNI36acNVmU1ZqnCWF8Um4pHKEPPGohfSEe224yWVKW6rvdpf-UaHZjXKRMdLy2gfB3e_wjnvwuFXOJ52HtcdK4dkNF-WnPnSIXUWJ1WrgtZ8Ji1h7jH3qLYM8f0ZAAXbOSGDTHdNjywAfMgHdgI0ovmb4XFjcbxohFqXUy1GXkQ2bzgIq6gmvutmt_dOYls1KNSgVKWL_f8v6Azwz-saDTsjY9")',
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase mb-1">
                                    Tops
                                </h3>
                                <p className="text-white/80 font-bold text-lg tracking-widest">
                                    / ÁO
                                </p>
                            </div>
                            <span className="size-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <span className="material-symbols-outlined">
                                    north_east
                                </span>
                            </span>
                        </div>
                    </Link>
                    {/* Bottoms */}
                    <Link
                        to="/bottoms"
                        className="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl block"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAoC6gd4JLiYGN9tGNfHbLUZDXDctwW5GowkTBqLfyu6tAmi_em91z-3SnetaQ_sLZKrvfgyIG0Dlxi0vXmMerEYAwj_YRyVMAedoC4ACBDkvO4g52Yy-xiSV48mIQKT-x9mK24hv2lEbGGcTLvgfhSZpzMAmxILM6AZ9Y1mfkb8MSHtzlNdy1dWnKJ8-lqk89UnOsr8Sydb9nkMXPW-Qzv15v0URtpWt3JCJrxGu7lOATQHa_4r2ZcTIBflDMvn9Q4YGG8503MBhMq")',
                            }}
                        ></div>
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                            <div>
                                <h3 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase mb-1">
                                    Bottoms
                                </h3>
                                <p className="text-white/80 font-bold text-lg tracking-widest">
                                    / QUẦN
                                </p>
                            </div>
                            <span className="size-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                <span className="material-symbols-outlined">
                                    north_east
                                </span>
                            </span>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
