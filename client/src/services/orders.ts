import axiosInstance from "@/lib/axiosInstance";

interface GetOrdersParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const getOrders = async (params: GetOrdersParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append("search", params.search);
  if (params.status && params.status !== "all") searchParams.append("status", params.status);
  if (params.sortBy && params.sortOrder) {
    searchParams.append("sortBy", params.sortBy);
    searchParams.append("sortOrder", params.sortOrder);
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/api/orders?${queryString}` : "/api/orders";
  
  const response = await axiosInstance.get(url);
  return response.data;
};

const getOrderByKey = async (order_key: string) => {
  const response = await axiosInstance.get(`/api/orders/${order_key}`);
  return response.data;
};

const getOrderProducts = async (order_key: string) => {
  const response = await axiosInstance.get(`/api/orders/${order_key}/products`);
  return response.data;
};

export { getOrders, getOrderByKey, getOrderProducts };