import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://car-management-65lw.onrender.com/api",
    withCredentials: true
})

export default axiosInstance;
