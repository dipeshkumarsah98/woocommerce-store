import Product from "../models/product.model";
import { IProduct, IProductQuery } from "../types/product.type";
import axiosInstance from "../utils/axiosInstance.utils";
import httpLogger from "./logger.service";
import { Types } from "mongoose";

const getProducts = async (payload: IProductQuery) => {
  const { search, sortBy, sortOrder } = payload;

  const query: any = {};
  if (search) {
    query.$text = { $search: search };
  }

  const sort: any = {};
  if (sortBy && sortOrder) {
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;
  }

  const products = await Product.find(query)
    .populate({
      path: "orders",
      select: "number",
    })
    .sort(sort)
    .lean();
  return products;
};

const createManyProducts = async (products: IProduct[]) => {
  const newProducts = await Product.insertMany(products);
  return newProducts;
};

const getProductById = async (id: number): Promise<IProduct | null> => {
  const product = await Product.findOne({ product_id: id });
  return product;
};

const getProductBySku = async (sku: string): Promise<IProduct | null> => {
  const product = await Product.findOne({ sku }).populate({
    path: "orders",
    select: "number",
  });
  return product;
};

const getProductsByIds = async (ids: Types.ObjectId[]) => {
  const products = await Product.find({ _id: { $in: ids } }).lean();
  return products;
};

const createProduct = async (product: IProduct) => {
  const newProduct = new Product(product);
  await newProduct.save();
  return newProduct;
};

const fetchAndCreateProducts = async (productId: number) => {
  try {
    const url = `wp-json/wc/v3/products/${productId}`;
    const { data } = await axiosInstance.get(url);

    const payload: IProduct = {
      name: data.name,
      product_id: data.id,
      description: data.description,
      meta_data: data.meta_data,
      sku: data.sku,
      stock_status: data.stock_status,
      categories: data.categories,
      price: data.price,
      images: data.images,
    };
    const product = await createProduct(payload);

    return product;
  } catch (error: any) {
    httpLogger.error(`Error fetching and creating product`, {
      error: error.message,
    });

    throw error;
  }
};

const syncProducts = async () => {
  try {
    const { data } = await axiosInstance.get("wp-json/wc/v3/products");
    return data;
  } catch (error: any) {
    httpLogger.error(`Error syncing products`, {
      error: error.message,
    });

    return [];
  }
};

export default {
  createManyProducts,
  getProductById,
  getProducts,
  createProduct,
  syncProducts,
  getProductBySku,
  fetchAndCreateProducts,
  getProductsByIds,
};
