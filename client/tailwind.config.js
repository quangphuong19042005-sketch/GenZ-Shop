/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#135bec", // Màu xanh cũ
                "vip-gold": "#f2d00d", // Màu vàng mới cho trang VIP
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "vip-dark": "#121212", // Nền tối đặc biệt cho VIP
                "vip-card": "#1c1c1c",
            },
            fontFamily: {
                display: ["Plus Jakarta Sans", "sans-serif"],
                vip: ["Work Sans", "sans-serif"], // Font mới cho trang VIP
            },
            borderRadius: {
                lg: "2rem",
                xl: "3rem",
            },
        },
    },
    plugins: [],
};
