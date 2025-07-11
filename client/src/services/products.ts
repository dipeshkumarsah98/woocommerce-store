import axiosInstance from "@/lib/axiosInstance";

interface GetProductsParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const getProducts = async (params: GetProductsParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append("search", params.search);
  if (params.sortBy && params.sortOrder) {
    searchParams.append("sortBy", params.sortBy);
    searchParams.append("sortOrder", params.sortOrder);
  }
  
  const queryString = searchParams.toString();
  const url = queryString ? `/api/products?${queryString}` : "/api/products";
  
  const response = await axiosInstance.get(url);
  return response.data;
};

const getProductBySku = async (sku: string) => {
  const response = await axiosInstance.get(`/api/products/${sku}`);
  return response.data;
};

const getProductOrders = async (sku: string) => {
  const response = await axiosInstance.get(`/api/products/${sku}/orders`);
  return response.data;
};

export { getProducts, getProductBySku, getProductOrders };