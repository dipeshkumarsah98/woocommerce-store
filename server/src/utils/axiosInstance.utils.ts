import axios from 'axios';

const BASE_URL = process.env.BASE_URL;
const CONSUMER_KEY = process.env.C_USERNAME;
const CONSUMER_SECRET = process.env.C_PASSWORD;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  auth: {
    username: CONSUMER_KEY || '',
    password: CONSUMER_SECRET || '',
  },
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url} with status ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`Response error from ${error.config?.url}:`, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
