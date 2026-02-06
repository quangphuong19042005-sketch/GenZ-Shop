import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5165", // Đảm bảo port này khớp với port backend đang chạy
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;
