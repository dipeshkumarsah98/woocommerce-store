import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});

axiosInstance.interceptors.response.use((response) => {
  if (response.status === 200) {
    return response.data;
  }
  return response;
});

export default axiosInstance;