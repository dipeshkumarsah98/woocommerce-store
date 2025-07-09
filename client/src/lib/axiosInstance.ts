import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
});

axiosInstance.interceptors.response.use((response) => {
  if (response.status === 200) {
    return response.data;
  }
  return response;
});

export default axiosInstance;