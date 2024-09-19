import axios from "axios";

const apiUrl = "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default axiosInstance;
