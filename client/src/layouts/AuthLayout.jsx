import React from "react";
import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-[#1a2230] rounded-2xl shadow-2xl overflow-hidden m-4">
                {/* Left Side: Image / Branding */}
                <div className="hidden md:flex flex-col justify-center items-center bg-primary p-10 text-white relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4nTGmz0dmqX2eFcP4yI0AnxQO3JATpGp4GsJxVI1LW8BcShPflxvZCExgC8dMsSuxZPuCWK2AkH25Ka-_j7ol6axYjx_wAv1BHpGdsKdd7LHrKN-I-fgO3Hh7N6Iz5XUtyh3aCJgM8Tfv9ZleXfAKh5I5W0Kw4TR6H5XWPRMMYFCK6PzwGOfj9W9sSAtj7viGYJ0L9unImQhFS9ZWeQxilBp3nhqGQyV8g0MEExGxnHypXaMIw1g7NYHHHPxVJCFmAnslYPcZz-FN')",
                        }}
                    ></div>
                    <div className="relative z-10 text-center">
                        <span className="material-symbols-outlined text-6xl mb-4">
                            bolt
                        </span>
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                            Streetwear
                            <br />
                            VIP Access
                        </h2>
                        <p className="mt-4 font-medium opacity-90">
                            Join the movement. Unlock exclusive drops.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form (Outlet) */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative">
                    <Link
                        to="/"
                        className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </Link>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
